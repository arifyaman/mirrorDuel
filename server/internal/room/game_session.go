package room

import (
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
	RoomID        int
	tick          int
	Config        *config.Config
	mu            sync.Mutex
	Players       map[int]*Player
	Zombies       map[int]*Zombie
	Wave          *WaveManager
	isGameOver    bool
	gameOverTimer float32
	Projectiles   []Projectile
	pendingEvents []GameEvent
}

var projectileIDCounter int32

// NewGameSession creates a new game session.
func NewGameSession(roomID int, cfg *config.Config) *GameSession {
	return &GameSession{
		RoomID:  roomID,
		Config:  cfg,
		Players: make(map[int]*Player),
		Zombies: make(map[int]*Zombie),
		Wave:    NewWaveManager(),
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
		if player.Health <= 0 {
			continue
		}
		cfg := s.Config.Projectile

		// Direction from player's facing angle (source of truth), not mouse aim
		angle := float64(player.Angle)
		dirX := float32(math.Sin(angle))
		dirZ := float32(math.Cos(angle))

		if player.HasDualWield {
			// Perpendicular vector for left and right guns
			perpX := float32(math.Cos(angle))
			perpZ := float32(-math.Sin(angle))

			// Right gun projectile
			rSpawnX := player.X + dirX*0.45 - perpX*0.35
			rSpawnZ := player.Z + dirZ*0.45 - perpZ*0.35
			s.Projectiles = append(s.Projectiles, Projectile{
				ID:          int(atomic.AddInt32(&projectileIDCounter, 1)),
				StartX:      rSpawnX,
				Y:           player.Y,
				StartZ:      rSpawnZ,
				DirX:        dirX,
				DirZ:        dirZ,
				Speed:       cfg.Speed,
				MaxReach:    cfg.MaxReach,
				SpawnTick:   s.tick,
				PlayerOwner: player.ID,
			})

			// Left gun projectile
			lSpawnX := player.X + dirX*0.45 + perpX*0.35
			lSpawnZ := player.Z + dirZ*0.45 + perpZ*0.35
			s.Projectiles = append(s.Projectiles, Projectile{
				ID:          int(atomic.AddInt32(&projectileIDCounter, 1)),
				StartX:      lSpawnX,
				Y:           player.Y,
				StartZ:      lSpawnZ,
				DirX:        dirX,
				DirZ:        dirZ,
				Speed:       cfg.Speed,
				MaxReach:    cfg.MaxReach,
				SpawnTick:   s.tick,
				PlayerOwner: player.ID,
			})
		} else {
			// Single gun projectile
			spawnX := player.X + dirX*0.35
			spawnZ := player.Z + dirZ*0.35
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

		// Destroy projectile on contact with a blocking obstacle cube
		blockedByObstacle := false
		for _, o := range s.Config.Obstacles {
			if px >= o.X-o.HalfWidth && px <= o.X+o.HalfWidth && pz >= o.Z-o.HalfDepth && pz <= o.Z+o.HalfDepth {
				blockedByObstacle = true
				break
			}
		}
		if blockedByObstacle {
			continue
		}

		hit := false

		// 1. Check projectile collision with Zombies
		for zID, z := range s.Zombies {
			if z.Health <= 0 {
				continue
			}
			dx := px - z.X
			dz := pz - z.Z
			dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
			if dist < hitRadius {
				owner := s.Players[p.PlayerOwner]
				hasExplosive := owner != nil && owner.HasExplosive
				hasPiercing := owner != nil && owner.HasPiercing

				z.Health -= s.Config.Projectile.Damage
				if dist > 0.01 {
					knx := (z.X - px) / dist
					knz := (z.Z - pz) / dist
					z.X += knx * 0.4
					z.Z += knz * 0.4
				}

				if z.Health <= 0 {
					s.Wave.TotalKills++
					delete(s.Zombies, zID)
				}

				// Explosive Ammo Perk: AoE explosion dealing 24 damage + radial knockback to all nearby zombies!
				if hasExplosive {
					s.pendingEvents = append(s.pendingEvents, GameEvent{
						Type:    network.EventExplosion,
						Payload: network.EncodeExplosionPayload(px, pz),
					})
					explosionRadius := float32(2.5)
					for otherZID, otherZ := range s.Zombies {
						if otherZID == zID || otherZ.Health <= 0 {
							continue
						}
						edx := otherZ.X - px
						edz := otherZ.Z - pz
						eDist := float32(math.Sqrt(float64(edx*edx + edz*edz)))
						if eDist <= explosionRadius {
							otherZ.Health -= 24.0 // High AoE splash damage!
							if eDist > 0.01 {
								otherZ.X += (edx / eDist) * 0.75
								otherZ.Z += (edz / eDist) * 0.75
							}
							if otherZ.Health <= 0 {
								s.Wave.TotalKills++
								delete(s.Zombies, otherZID)
							}
						}
					}
				}

				if !hasPiercing {
					hit = true
					break
				}
			}
		}

		if !hit {
			alive = append(alive, p)
		}
	}
	s.Projectiles = alive

	// Process slash activations — only hits Zombies (Co-op Mode, Friendly Fire Disabled)
	cfg := s.Config.Slash
	slashActivated := make(map[int]*Player)
	for id, act := range activatedIDs {
		if act.skill == skillSlash {
			if p, ok := s.Players[id]; ok {
				slashActivated[id] = p
			}
		}
	}

	for _, attacker := range slashActivated {
		if attacker.Health <= 0 {
			continue
		}

		attackerDirX := float32(math.Sin(float64(attacker.Angle)))
		attackerDirZ := float32(math.Cos(float64(attacker.Angle)))
		maxCos := float32(math.Cos(float64(cfg.ConeAngle) * math.Pi / 180))

		// Slash hitting Zombies
		for zID, z := range s.Zombies {
			if z.Health <= 0 {
				continue
			}
			dx := z.X - attacker.X
			dz := z.Z - attacker.Z
			dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
			if dist <= cfg.HitRadius {
				vDirX := dx / dist
				vDirZ := dz / dist
				dot := vDirX*attackerDirX + vDirZ*attackerDirZ
				if dot >= maxCos {
					z.Health -= cfg.Damage * 3.5
					z.X += vDirX * 0.7
					z.Z += vDirZ * 0.7
					if z.Health <= 0 {
						s.Wave.TotalKills++
						delete(s.Zombies, zID)
					}
				}
			}
		}
	}

	// Check for Squad Wipe (all human players dead)
	allHumansDead := len(s.Players) > 0
	for _, p := range s.Players {
		if p.Health > 0 {
			allHumansDead = false
			break
		}
	}
	if allHumansDead {
		if !s.isGameOver {
			s.isGameOver = true
			s.gameOverTimer = 3.5
			s.pendingEvents = append(s.pendingEvents, GameEvent{
				Type:    network.EventSquadWiped,
				Payload: []byte{uint8(s.Wave.CurrentWave)},
			})
		}
	}

	if s.isGameOver {
		s.gameOverTimer -= 0.01667
		if s.gameOverTimer <= 0 {
			s.isGameOver = false
			s.Reset()
		}
	}

	// Collect slash events for client VFX
	for _, attacker := range slashActivated {
		evtPayload := network.EncodeSlashPayload(uint8(attacker.ID), attacker.X, attacker.Z, attacker.Angle)
		s.pendingEvents = append(s.pendingEvents, GameEvent{
			Type:    network.EventSlash,
			Payload: evtPayload,
		})
	}

	// Process Ground Defense Turrets for players with HasTurret
	for _, player := range s.Players {
		if !player.HasTurret || player.Health <= 0 {
			continue
		}
		player.TurretCooldown -= 0.01667
		if player.TurretCooldown <= 0 {
			// Find nearest zombie to player's turret
			var closestZ *Zombie
			var closestZID int
			minDist := float32(12.0)
			for zID, z := range s.Zombies {
				if z.Health <= 0 {
					continue
				}
				dx := z.X - player.TurretX
				dz := z.Z - player.TurretZ
				dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
				if dist < minDist {
					minDist = dist
					closestZ = z
					closestZID = zID
				}
			}

			if closestZ != nil {
				player.TurretCooldown = 1.1 // Balanced, deliberate heavy turret firing rate!
				closestZ.Health -= 24.0     // Heavy autocannon damage per shot!
				if minDist > 0.01 {
					closestZ.X += ((closestZ.X - player.TurretX) / minDist) * 0.4
					closestZ.Z += ((closestZ.Z - player.TurretZ) / minDist) * 0.4
				}
				if closestZ.Health <= 0 {
					s.Wave.TotalKills++
					delete(s.Zombies, closestZID)
				}

				// Broadcast turret fire event to clients
				tAngle := float32(math.Atan2(float64(closestZ.X-player.TurretX), float64(closestZ.Z-player.TurretZ)))
				s.pendingEvents = append(s.pendingEvents, GameEvent{
					Type:    network.EventTurretFire,
					Payload: network.EncodeTurretFirePayload(player.TurretX, player.TurretZ, tAngle, closestZ.X, closestZ.Z),
				})
			}
		}
	}

	// Update Waves, Zombie Spawning, and AI (60s horde wave mode)
	if len(s.Players) > 0 {
		spawnZombie, waveJustCleared, waveJustStarted := s.Wave.Update(0.01667, len(s.Zombies))

		if spawnZombie {
			z := s.Wave.CreateWaveZombie(s.Config.FloorSize)
			s.Zombies[z.ID] = z
		}

		if waveJustCleared {
			s.Zombies = make(map[int]*Zombie)
			for _, p := range s.Players {
				maxHP := float32(100.0)
				if p.HasArmor {
					maxHP = 150.0
				}
				p.Health = maxHP // Revive and restore full health to all players!
				p.Ammo = p.MaxAmmo
				p.IsDashing = false
				p.Cooldown = 0
			}
		}

		if waveJustStarted {
			for _, p := range s.Players {
				if p.Health <= 0 {
					maxHP := float32(100.0)
					if p.HasArmor {
						maxHP = 150.0
					}
					p.Health = maxHP
					p.Ammo = p.MaxAmmo
					p.IsDashing = false
					p.Cooldown = 0
				}
			}
		}

		// Update each active zombie
		for zID, z := range s.Zombies {
			if z.Health <= 0 {
				delete(s.Zombies, zID)
				continue
			}
			targetPlayer := z.Update(0.01667, s.Players, s.Config.Obstacles, s.Config.FloorSize)
			if targetPlayer != nil {
				if !targetPlayer.ShieldActive && !targetPlayer.IsDashing {
					targetPlayer.Health -= z.Damage
					if targetPlayer.Health < 0 {
						targetPlayer.Health = 0
					}
					s.pendingEvents = append(s.pendingEvents, GameEvent{
						Type:    network.EventSlash,
						Payload: network.EncodeSlashPayload(uint8(z.ID), z.X, z.Z, z.Angle),
					})
				}
			}
		}

		// Broadcast wave status event to clients
		if s.tick%6 == 0 || waveJustCleared || waveJustStarted {
			s.pendingEvents = append(s.pendingEvents, GameEvent{
				Type:    network.EventWaveUpdate,
				Payload: network.EncodeWaveUpdatePayload(uint8(s.Wave.CurrentWave), s.Wave.State, s.Wave.Timer, uint8(len(s.Zombies)), uint16(s.Wave.TotalKills)),
			})
		}
	}

	s.mu.Unlock()
}

// GetSnapshot returns player, zombie and projectile data for encoding.
func (s *GameSession) GetSnapshot() (tick uint16, players []network.PlayerSnapshot, projectiles []network.ProjectileSnapshot) {
	s.mu.Lock()
	defer s.mu.Unlock()

	tick = uint16(s.tick)

	players = make([]network.PlayerSnapshot, 0, len(s.Players)+len(s.Zombies))
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
	for _, z := range s.Zombies {
		if z.Health > 0 {
			players = append(players, z.ToSnapshot())
		}
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
		p.Ammo = 5
		p.MaxAmmo = 5
		p.DashCooldown = 0
		p.ShieldCooldown = 0
		p.SlashCooldown = 0
		p.IsDashing = false
		p.ShieldActive = false
		p.HasDualWield = false
		p.HasTurret = false
		p.HasExplosive = false
		p.HasPiercing = false
		p.HasArmor = false
		p.HasCyberDash = false
	}
	s.Projectiles = nil
	s.Zombies = make(map[int]*Zombie)
	s.Wave = NewWaveManager()
	s.isGameOver = false
	s.gameOverTimer = 0
}
