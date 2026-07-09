package room

import (
	"log"
	"math"
	"sync"
	"sync/atomic"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

// GameEvent records a game event for broadcast to clients (embedded in STATE_SNAPSHOT).
type GameEvent struct {
	Type    uint8
	Payload []byte
}

// GameSession mirrors the TypeScript GameSession (a 1v1 room).
type GameSession struct {
	RoomID          int
	tick            int
	Config          *config.Config
	mu              sync.Mutex
	Players         map[int]*Player
	Projectiles     []Projectile
	pendingEvents []GameEvent
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
	type skillType int
	const (
		skillFire   skillType = 1
		skillDash   skillType = 2
		skillShield skillType = 3
		skillSlash  skillType = 4
	)
	type activation struct {
		skill skillType
	}
	activatedIDs := make(map[int]activation)
	firedPlayers := make(map[int]*Player)
	for _, player := range s.Players {
		player.ProcessInputs(0.01667)
		if player.JustFired {
			activatedIDs[player.ID] = activation{skill: skillFire}
			firedPlayers[player.ID] = player
			player.JustFired = false
			player.healSkill(s.Config.SkillHealAmount)
		}
		if player.JustDashed {
			activatedIDs[player.ID] = activation{skill: skillDash}
			player.JustDashed = false
			player.healSkill(s.Config.SkillHealAmount)
		}
		if player.JustShielded {
			activatedIDs[player.ID] = activation{skill: skillShield}
			player.ShieldActivatedTick = s.tick
			player.PerfectBlockUsed = false
			player.JustShielded = false
			player.healSkill(s.Config.SkillHealAmount)
		}
		if player.JustSlashed {
			activatedIDs[player.ID] = activation{skill: skillSlash}
			player.JustSlashed = false
		}
	}

	// Mirror cooldown reduction: when a skill activates, reduce the SAME skill's
	// cooldown on the opponent by 50%
	for activatedID, act := range activatedIDs {
		for _, player := range s.Players {
			if player.ID != activatedID {
				switch act.skill {
				case skillFire:
					if player.Cooldown > 0 {
						player.Cooldown *= 0.5
					}
				case skillDash:
					if player.DashCooldown > 0 {
						player.DashCooldown *= 0.5
					}
		case skillShield:
				if player.ShieldCooldown > 0 {
					player.ShieldCooldown *= 0.5
				}
			case skillSlash:
				if player.SlashCooldown > 0 {
					player.SlashCooldown *= 0.5
				}
			}
		}
	}
	}

	// Fire projectiles for players that fired this tick (must be inside lock so projectiles
	// are captured in the snapshot below)
	for _, player := range firedPlayers {
		if player.Cooldown > 0 || player.Health <= 0 {
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
			if player.ID == p.PlayerOwner || player.Health <= 0 {
				continue
			}
			dx := px - player.X
			dz := pz - player.Z
			dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
			if dist < hitRadius {
				if player.ShieldActive {
					angle := float64(player.Angle)
					facingX := float32(math.Sin(angle))
					facingZ := float32(math.Cos(angle))
					ndx := dx / dist
					ndz := dz / dist
					dot := ndx*facingX + ndz*facingZ
					if dot >= float32(math.Cos(50*math.Pi/180)) {
						log.Printf("[BLOCK] projectile %d (player %d) blocked by player %d's shield (cone)",
							p.ID, p.PlayerOwner, player.ID)
						// Perfect block: fire free projectile if within timing window
						cfg := s.Config.Shield
						elapsed := float32(s.tick-player.ShieldActivatedTick) * 0.01667
						if !player.PerfectBlockUsed && elapsed <= cfg.PerfectBlockWindow {
							player.PerfectBlockUsed = true
							pAngle := float64(player.Angle)
							pDirX := float32(math.Sin(pAngle))
							pDirZ := float32(math.Cos(pAngle))
							pSpawnX := player.X + pDirX*0.3
							pSpawnZ := player.Z + pDirZ*0.3
							pCfg := s.Config.Projectile
							alive = append(alive, Projectile{
								ID:          int(atomic.AddInt32(&projectileIDCounter, 1)),
								StartX:      pSpawnX,
								Y:           player.Y,
								StartZ:      pSpawnZ,
								DirX:        pDirX,
								DirZ:        pDirZ,
								Speed:       pCfg.Speed,
								MaxReach:    pCfg.MaxReach,
								SpawnTick:   s.tick,
								PlayerOwner: player.ID,
							})
							s.pendingEvents = append(s.pendingEvents, GameEvent{
								Type:    network.EventPerfectBlock,
								Payload: network.EncodePerfectBlockPayload(uint8(player.ID), player.X, player.Z, player.Angle),
							})
							log.Printf("[PERFECT BLOCK] player %d triggered perfect block, fired free projectile", player.ID)
						}
						hit = true
						break
					}
				}
				if player.IsDashing {
					log.Printf("[DODGE] projectile %d (player %d) dodged by player %d's dash",
						p.ID, p.PlayerOwner, player.ID)
					hit = true
					break
				}
			player.Health -= s.Config.Projectile.Damage
			if player.Health < 0 {
				player.Health = 0
			}
			if dist > 0.01 {
				knx := (player.X - px) / dist
				knz := (player.Z - pz) / dist
				player.applyKnockback(knx, knz, s.Config.Projectile.Damage*s.Config.KnockbackScale)
			}
			log.Printf("[HIT] projectile %d (player %d) hit player %d | pos=(%.2f, %.2f) | health=%.0f",
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

	// Process slash activations — instant hit detection
	cfg := s.Config.Slash
	slashActivated := make(map[int]*Player)
	for id, act := range activatedIDs {
		if act.skill == skillSlash {
			if p, ok := s.Players[id]; ok {
				slashActivated[id] = p
			}
		}
	}

	for attackerID, attacker := range slashActivated {
		if attacker.Health <= 0 {
			continue
		}
		for _, victim := range s.Players {
			if victim.ID == attackerID {
				continue
			}
			if victim.Health <= 0 {
				continue
			}

			dx := victim.X - attacker.X
			dz := victim.Z - attacker.Z
			dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
			if dist > cfg.HitRadius {
				continue
			}

			// Check if victim is in the attack cone
			victimDirX := dx / dist
			victimDirZ := dz / dist
			attackerDirX := float32(math.Sin(float64(attacker.Angle)))
			attackerDirZ := float32(math.Cos(float64(attacker.Angle)))
			dot := victimDirX*attackerDirX + victimDirZ*attackerDirZ
			maxCos := float32(math.Cos(float64(cfg.ConeAngle) * math.Pi / 180))

			if dot < maxCos {
				continue
			}

			// Check shield block
			if victim.ShieldActive {
				victimFacingX := float32(math.Sin(float64(victim.Angle)))
				victimFacingZ := float32(math.Cos(float64(victim.Angle)))
				// Direction from victim to attacker (where the slash comes from)
				blockDot := (-victimDirX)*victimFacingX + (-victimDirZ)*victimFacingZ
				if blockDot >= float32(math.Cos(50*math.Pi/180)) {
					// Blocked by shield
					continue
				}
			}

			// Check dodge
			if victim.IsDashing {
				continue
			}

			// Apply damage
			victim.Health -= cfg.Damage
			if victim.Health < 0 {
				victim.Health = 0
			}
			if dist > 0.01 {
				knx := (victim.X - attacker.X) / dist
				knz := (victim.Z - attacker.Z) / dist
				victim.applyKnockback(knx, knz, cfg.Damage*s.Config.KnockbackScale)
			}
			log.Printf("[SLASH] attacker=%d hit victim=%d damage=%.0f | health=%.0f | dist=%.2f",
				attackerID, victim.ID, cfg.Damage, victim.Health, dist)
			break
		}
	}

	// Collect slash events for client VFX (all slashes, not just hits)
	for _, attacker := range slashActivated {
		evtPayload := network.EncodeSlashPayload(uint8(attacker.ID), attacker.X, attacker.Z, attacker.Angle)
		s.pendingEvents = append(s.pendingEvents, GameEvent{
			Type:    network.EventSlash,
			Payload: evtPayload,
		})
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
			ID:             uint8(p.ID),
			X:              p.X,
			Y:              p.Y,
			Z:              p.Z,
			Angle:          p.Angle,
			Cooldown:       p.Cooldown,
			Health:         p.Health,
			DashCooldown:   p.DashCooldown,
			ShieldCooldown: p.ShieldCooldown,
			SlashCooldown:  p.SlashCooldown,
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
			OwnerID:   uint8(p.PlayerOwner),
		})
	}

	return
}

// GetPendingEvents returns and clears pending events for this tick.
func (s *GameSession) GetPendingEvents() []GameEvent {
	events := s.pendingEvents
	s.pendingEvents = nil
	return events
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

	if len(s.Players) == 2 {
		s.Reset()
	}

	return player
}

// Reset resets the game state — both players to initial positions,
// full health, no cooldowns, projectiles cleared.
func (s *GameSession) Reset() {
	for _, p := range s.Players {
		if p.ID == 1 {
			p.X = -2
			p.Z = -0.2
			p.Angle = float32(math.Pi / 2) // face +X
		} else {
			p.X = 2
			p.Z = -0.2
			p.Angle = float32(-math.Pi / 2) // face -X
		}
		p.TargetX = p.X
		p.TargetZ = p.Z
		p.Health = s.Config.MaxHealth
		p.Cooldown = 0
		p.DashCooldown = 0
		p.ShieldCooldown = 0
		p.SlashCooldown = 0
		p.IsDashing = false
		p.ShieldActive = false
	}
	s.Projectiles = nil
}
