package room

import (
	"math"
	"sync"
	"sync/atomic"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

// GameSession mirrors the TypeScript GameSession (a 1v1 room).
type GameSession struct {
	RoomID      int
	tick        int
	Config      *config.Config
	mu          sync.Mutex
	Players     map[int]*Player
	Projectiles []Projectile
}

var projectileIDCounter int32

// NewGameSession creates a new game session.
func NewGameSession(roomID int, cfg *config.Config) *GameSession {
	return &GameSession{
		RoomID:  roomID,
		Config:  cfg,
		Players: make(map[int]*Player),
	}
}

// TickStep executes one game tick (60Hz = 16.67ms).
func (s *GameSession) TickStep() {
	s.mu.Lock()
	s.tick++

	// Process buffered inputs for all players
	firedIDs := make(map[int]bool)
	firedPlayers := make(map[int]*Player)
	for _, player := range s.Players {
		player.ProcessInputs(0.01667)
		if player.JustFired {
			firedIDs[player.ID] = true
			firedPlayers[player.ID] = player
			player.JustFired = false
		}
	}

	// Mirror cooldown reduction: when any player fires, reduce all OTHER players' cooldowns by 50%
	for firedID := range firedIDs {
		for _, player := range s.Players {
			if player.ID != firedID && player.Cooldown > 0 {
				player.Cooldown *= 0.5
			}
		}
	}

	// Update projectiles (client simulates position from spawn data)
	maxReach := s.Config.Projectile.MaxReach
	alive := make([]Projectile, 0, len(s.Projectiles))
	for _, p := range s.Projectiles {
		traveled := float32(s.tick-p.SpawnTick)*0.01667*p.Speed
		if traveled < maxReach {
			alive = append(alive, p)
		}
	}
	s.Projectiles = alive

	// Get snapshot data while holding lock
	snapshotTick := uint16(s.tick)
	snapshotPlayers := make([]network.PlayerSnapshot, 0, len(s.Players))
	for _, p := range s.Players {
		snapshotPlayers = append(snapshotPlayers, network.PlayerSnapshot{
			ID:       uint8(p.ID),
			X:        p.X,
			Y:        p.Y,
			Z:        p.Z,
			Angle:    p.Angle,
			Cooldown: p.Cooldown,
		})
	}
	snapshotProjectiles := make([]network.ProjectileSnapshot, 0, len(s.Projectiles))
	for _, p := range s.Projectiles {
		snapshotProjectiles = append(snapshotProjectiles, network.ProjectileSnapshot{
			ID:        uint8(p.ID),
			SpawnTick: uint16(p.SpawnTick),
			StartX:    p.StartX,
			Y:         p.Y,
			StartZ:    p.StartZ,
			DirX:      p.DirX,
			DirZ:      p.DirZ,
			Speed:     p.Speed,
			MaxReach:  p.MaxReach,
		})
	}
	s.mu.Unlock()

	// Spawn projectiles for fired players (outside lock)
	for _, player := range firedPlayers {
		s.ActivateProjectile(player, player.X, player.Z)
	}

	// Broadcast (outside lock)
	if len(snapshotPlayers) > 0 {
		data := network.EncodeStateSnapshot(snapshotTick, snapshotPlayers, snapshotProjectiles)
		for _, p := range s.Players {
			if p.Session != nil {
				p.Session.SendSnapshot(data)
			}
		}
	}
}

// GetSnapshot returns player and projectile data for encoding.
func (s *GameSession) GetSnapshot() (tick uint16, players []network.PlayerSnapshot, projectiles []network.ProjectileSnapshot) {
	s.mu.Lock()
	defer s.mu.Unlock()

	tick = uint16(s.tick)

	players = make([]network.PlayerSnapshot, 0, len(s.Players))
	for _, p := range s.Players {
		players = append(players, network.PlayerSnapshot{
			ID:       uint8(p.ID),
			X:        p.X,
			Y:        p.Y,
			Z:        p.Z,
			Angle:    p.Angle,
			Cooldown: p.Cooldown,
		})
	}

	projectiles = make([]network.ProjectileSnapshot, 0, len(s.Projectiles))
	for _, p := range s.Projectiles {
		projectiles = append(projectiles, network.ProjectileSnapshot{
			ID:        uint8(p.ID),
			SpawnTick: uint16(p.SpawnTick),
			StartX:    p.StartX,
			Y:         p.Y,
			StartZ:    p.StartZ,
			DirX:      p.DirX,
			DirZ:      p.DirZ,
			Speed:     p.Speed,
			MaxReach:  p.MaxReach,
		})
	}

	return
}

// AddPlayer creates and returns a new Player for this session.
func (s *GameSession) AddPlayer(id int, name string, session SessionIface) *Player {
	s.mu.Lock()
	defer s.mu.Unlock()

	var x, z float32
	if id == 1 {
		x = -2
	} else {
		x = 2
	}
	y := float32(-0.2)
	z = y // Override z to -0.2 as per TypeScript

	player := NewPlayer(id, name, x, y, z, s.Config)
	player.Z = z // Ensure Z is -0.2
	player.GameSession = s
	player.Session = session
	s.Players[id] = player
	return player
}

// ActivateProjectile spawns a projectile if the player's cooldown allows.
func (s *GameSession) ActivateProjectile(p *Player, mouseX, mouseY float32) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if p.Cooldown > 0 {
		return
	}

	cfg := s.Config.Projectile
	p.Cooldown = cfg.Cooldown

	dx := mouseX - p.X
	dz := mouseY - p.Z
	len2 := dx*dx + dz*dz
	if len2 < 0.0001 {
		return
	}
	length := float32(math.Sqrt(float64(len2)))
	dirX := dx / length
	dirZ := dz / length

	p.JustFired = true

	spawnX := p.X + dirX*0.3
	spawnZ := p.Z + dirZ*0.3
	s.Projectiles = append(s.Projectiles, Projectile{
		ID:          int(atomic.AddInt32(&projectileIDCounter, 1)),
		StartX:      spawnX,
		Y:           p.Y,
		StartZ:      spawnZ,
		DirX:        dirX,
		DirZ:        dirZ,
		Speed:       cfg.Speed,
		MaxReach:    cfg.MaxReach,
		SpawnTick:   s.tick,
		PlayerOwner: p.ID,
	})
}
