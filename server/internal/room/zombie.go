package room

import (
	"math"
	"math/rand"
	"sync/atomic"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

var nextZombieID int32 = 99

func getNextZombieID() int {
	id := atomic.AddInt32(&nextZombieID, 1)
	if id > 240 {
		atomic.StoreInt32(&nextZombieID, 99)
		id = 100
	}
	return int(id)
}

// Zombie represents an AI-controlled enemy orb that hunts players.
type Zombie struct {
	ID             int
	X              float32
	Y              float32
	Z              float32
	Angle          float32
	Health         float32
	MaxHealth      float32
	Speed          float32
	AttackCooldown float32
	Damage         float32
	AttackRange    float32
	SlashCooldown  float32
}

// NewZombie creates a new Zombie at a spawn location around the arena edge.
func NewZombie(cfg *config.Config) *Zombie {
	id := getNextZombieID()
	half := (cfg.FloorSize / 2) - 1.0

	var x, z float32
	edge := rand.Intn(4)
	switch edge {
	case 0: // North edge
		x = (rand.Float32()*2 - 1) * half
		z = -half
	case 1: // South edge
		x = (rand.Float32()*2 - 1) * half
		z = half
	case 2: // West edge
		x = -half
		z = (rand.Float32()*2 - 1) * half
	case 3: // East edge
		x = half
		z = (rand.Float32()*2 - 1) * half
	}

	return &Zombie{
		ID:             id,
		X:              x,
		Y:              -0.2,
		Z:              z,
		Angle:          0,
		Health:         24.0, // Dies in 3 bullet hits (8 dmg each)
		MaxHealth:      24.0,
		Speed:          2.6 + rand.Float32()*0.6, // 2.6 - 3.2 speed
		AttackCooldown: 0,
		Damage:         12.0,
		AttackRange:    0.7,
		SlashCooldown:  0,
	}
}

// Update advances the zombie AI by dt seconds.
func (z *Zombie) Update(dt float32, players map[int]*Player, obstacles []config.Obstacle, floorSize float32) (attackTarget *Player) {
	if z.Health <= 0 {
		return nil
	}

	if z.AttackCooldown > 0 {
		z.AttackCooldown -= dt
	}
	if z.SlashCooldown > 0 {
		z.SlashCooldown -= dt
	}

	// Find nearest living human player (ID < 100)
	var closestPlayer *Player
	var minDist float32 = 9999.0

	for _, p := range players {
		if p.ID >= 100 || p.Health <= 0 {
			continue
		}
		dx := p.X - z.X
		dz := p.Z - z.Z
		dist := float32(math.Sqrt(float64(dx*dx + dz*dz)))
		if dist < minDist {
			minDist = dist
			closestPlayer = p
		}
	}

	if closestPlayer == nil {
		return nil
	}

	// Calculate direction towards target player
	dx := closestPlayer.X - z.X
	dz := closestPlayer.Z - z.Z
	dist := minDist

	if dist > 0.01 {
		dirX := dx / dist
		dirZ := dz / dist

		// Turn towards player
		desiredAngle := float32(math.Atan2(float64(dirX), float64(dirZ)))
		z.Angle = desiredAngle

		// Move towards player if outside attack range
		if dist > z.AttackRange*0.6 {
			z.X += dirX * z.Speed * dt
			z.Z += dirZ * z.Speed * dt

			// Arena boundary clamp
			half := floorSize / 2
			if z.X < -half {
				z.X = -half
			} else if z.X > half {
				z.X = half
			}
			if z.Z < -half {
				z.Z = -half
			} else if z.Z > half {
				z.Z = half
			}

			// Obstacle collisions
			z.X, z.Z = resolveObstacles(z.X, z.Z, 0.28, obstacles)
		}

		// Attack player if within melee range
		if dist <= z.AttackRange && z.AttackCooldown <= 0 {
			z.AttackCooldown = 1.2 // 1.2s between zombie attacks
			z.SlashCooldown = 0.4
			attackTarget = closestPlayer
		}
	}

	return attackTarget
}

// ToSnapshot converts a Zombie to a network PlayerSnapshot for transmission.
func (z *Zombie) ToSnapshot() network.PlayerSnapshot {
	return network.PlayerSnapshot{
		ID:             uint8(z.ID),
		X:              z.X,
		Y:              z.Y,
		Z:              z.Z,
		Angle:          z.Angle,
		Cooldown:       z.AttackCooldown,
		Health:         z.Health,
		DashCooldown:   0,
		ShieldCooldown: 0,
		SlashCooldown:  z.SlashCooldown,
	}
}
