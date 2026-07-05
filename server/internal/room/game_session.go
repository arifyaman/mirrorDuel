package room

import (
	"fmt"
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

	// Fire projectiles for players that fired this tick (must be inside lock so projectiles
	// are captured in the snapshot below)
	for _, player := range firedPlayers {
		if player.Cooldown > 0 {
			continue
		}
		cfg := s.Config.Projectile
		player.Cooldown = cfg.Cooldown

		// Direction from player's facing angle (source of truth), not mouse aim
		angle := float64(player.Angle)
		dirX := float32(math.Sin(angle))
		dirZ := float32(math.Cos(angle))
		spawnX := player.X + dirX*0.3
		spawnZ := player.Z + dirZ*0.3
		s.Projectiles = append(s.Projectiles, Projectile{
			ID:          int(atomic.AddInt32(&projectileIDCounter, 1)),
			StartX:      spawnX,
			Y:           player.Y,
			StartZ:      spawnZ,
			DirX:        dirX,
			DirZ:        dirZ,
			Speed:       cfg.Speed,
			MaxReach:    cfg.MaxReach,
			SpawnTick:   s.tick,
			PlayerOwner: player.ID,
		})
	}

	// Update projectiles with collision detection (server-authoritative)
	maxReach := s.Config.Projectile.MaxReach
	hitRadius := float32(0.5)
	alive := make([]Projectile, 0, len(s.Projectiles))
	for _, p := range s.Projectiles {
		traveled := float32(s.tick-p.SpawnTick)*0.01667*p.Speed
		if traveled >= maxReach {
			continue
		}
		// Compute current projectile position
		px := p.StartX + p.DirX*traveled
		pz := p.StartZ + p.DirZ*traveled

		hit := false
		for _, player := range s.Players {
			if player.ID == p.PlayerOwner {
				continue
			}
			dx := px - player.X
			dz := pz - player.Z
			dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
			if dist < hitRadius {
				player.Health -= 20
				fmt.Printf("[HIT] projectile %d (player %d) hit player %d | pos=(%.2f, %.2f) | health=%.0f\n",
					p.ID, p.PlayerOwner, player.ID, player.X, player.Z, player.Health)
				hit = true
				break
			}
		}
		if !hit {
			alive = append(alive, p)
		}
	}
	s.Projectiles = alive

	s.mu.Unlock()
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
			Health:   p.Health,
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
