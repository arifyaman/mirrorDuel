package config

import "math"

// Config holds all game configuration, mirroring config/index.ts.
type Config struct {
	QUICPort      int
	HTTPPort      int
	FloorSize     float32
	PlayerSpeed   float32
	LerpFactor    float32
	SpeedStrafe   float32
	TurnSpeed     float32
	KnockbackScale float32
	MaxHealth       float32
	SkillHealAmount float32
	Projectile      ProjectileConfig
	Dash          DashConfig
	Shield        ShieldConfig
	Slash         SlashConfig
	Obstacles          []Obstacle
	ObstacleGridWidth  int
	ObstacleGridHeight int
	ObstacleBitmask    []byte
}

// Obstacle is a static axis-aligned blocking cube on the floor.
// X/Z is the center of the cube; HalfWidth/HalfDepth are half-extents along X/Z.
type Obstacle struct {
	X         float32
	Z         float32
	HalfWidth float32
	HalfDepth float32
}

// DashConfig holds dash skill settings.
type DashConfig struct {
	Cooldown     float32
	Distance     float32
	Duration     float32 // seconds
	EaseOutStart float32 // 0-1, fraction of dash when deceleration begins
}

// ShieldConfig holds shield skill settings.
type ShieldConfig struct {
	Cooldown           float32
	ActiveDuration     float32 // 1 second
	PerfectBlockWindow float32 // seconds after shield opens to allow perfect block
}

// ProjectileConfig mirrors the skills.projectile config.
type ProjectileConfig struct {
	Cooldown      float32
	Speed         float32
	MaxReach      float32
	Damage        float32
	MaxParticles  int
	BurstSpeed    float32
	BurstDuration float32
}

// SlashConfig holds the crescent slash skill settings.
type SlashConfig struct {
	Cooldown   float32
	Damage     float32
	HitRadius  float32
	ConeAngle  float32 // degrees
}

// Default returns the default game configuration. The obstacle map starts
// out empty here — main.go loads the real layout from a PNG map file at
// startup (see LoadObstacleMap) and overwrites Obstacles/ObstacleBitmask
// before the room manager is created. Keeping Default() itself free of
// file I/O means Config is always valid even if that load is skipped.
func Default() *Config {
	emptyGrid := EmptyObstacleGrid(DefaultMapWidth, DefaultMapHeight)
	return &Config{
		QUICPort:    4433,
		HTTPPort:    8081,
  FloorSize:   20,
		PlayerSpeed: 5,
		LerpFactor:  8,
		SpeedStrafe: 0.75,
		TurnSpeed:     math.Pi*5.5,
		KnockbackScale: 0.08,
		MaxHealth:      100,
		SkillHealAmount: 2,
		Projectile: ProjectileConfig{
			Cooldown:      0.14,
			Speed:         24.0,
			MaxReach:      18.0,
			Damage:        8.0,
			MaxParticles:  12,
			BurstSpeed:    10,
			BurstDuration: 0.6,
		},
		Dash: DashConfig{
			Cooldown:     7,
			Distance:     4,
			Duration:     20.0 / 60.0,
			EaseOutStart: 0.2,
		},
		Shield: ShieldConfig{
			Cooldown:           7,
			ActiveDuration:     1,
			PerfectBlockWindow: 0.35,
		},
		Slash: SlashConfig{
			Cooldown:   0.5,
			Damage:     4.2,
			HitRadius:  0.95,
			ConeAngle:  85,
		},
		Obstacles:          BuildObstaclesFromGrid(emptyGrid, DefaultMapWidth, DefaultMapHeight),
		ObstacleGridWidth:  DefaultMapWidth,
		ObstacleGridHeight: DefaultMapHeight,
		ObstacleBitmask:    PackObstacleBitmask(emptyGrid, DefaultMapWidth, DefaultMapHeight),
	}
}
