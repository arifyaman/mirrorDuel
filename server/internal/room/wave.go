package room

import (
	"math"
	"math/rand"
)

const (
	WaveStatePlaying      uint8 = 0
	WaveStateIntermission uint8 = 1

	WaveDuration         float32 = 60.0 // 60 seconds per wave
	IntermissionDuration float32 = 5.0  // 5 seconds between waves
)

// WaveManager manages round progression, wave timers, and difficulty scaling.
type WaveManager struct {
	CurrentWave       int
	State             uint8
	Timer             float32
	SpawnTimer        float32
	ZombiesSpawned    int
	TotalWaveZombies  int
	TotalKills        int
	SpawnInterval     float32
	BaseZombieHP      float32
	BaseZombieSpeed   float32
	BaseZombieDamage  float32
}

// NewWaveManager creates and initializes a WaveManager for Wave 1.
func NewWaveManager() *WaveManager {
	wm := &WaveManager{
		CurrentWave: 1,
		State:       WaveStatePlaying,
		Timer:       10.0,
		TotalKills:  0,
	}
	wm.setupWave(1)
	return wm
}

// setupWave configures parameters for the given wave number.
func (wm *WaveManager) setupWave(wave int) {
	wm.CurrentWave = wave
	wm.State = WaveStatePlaying
	wm.Timer = 10.0 // 10 seconds per wave
	wm.SpawnTimer = 0
	wm.ZombiesSpawned = 0

	switch wave {
	case 1:
		// Wave 1 (10s round)
		wm.TotalWaveZombies = 6
		wm.SpawnInterval = 1.4
		wm.BaseZombieHP = 16.0
		wm.BaseZombieSpeed = 2.3
		wm.BaseZombieDamage = 8.0
	case 2:
		// Wave 2 (10s round)
		wm.TotalWaveZombies = 8
		wm.SpawnInterval = 1.2
		wm.BaseZombieHP = 24.0
		wm.BaseZombieSpeed = 3.0
		wm.BaseZombieDamage = 12.0
	case 3:
		// Wave 3 (10s round)
		wm.TotalWaveZombies = 11
		wm.SpawnInterval = 1.0
		wm.BaseZombieHP = 32.0
		wm.BaseZombieSpeed = 3.3
		wm.BaseZombieDamage = 16.0
	default:
		// Wave 4+ (10s round)
		wm.TotalWaveZombies = 14 + (wave-4)*3
		wm.SpawnInterval = 0.7
		wm.BaseZombieHP = 32.0 + float32(wave-3)*6.0
		wm.BaseZombieSpeed = float32(math.Min(4.2, 3.3+float64(wave-3)*0.15))
		wm.BaseZombieDamage = 16.0 + float32(wave-3)*3.0
	}
}

// CreateWaveZombie instantiates a Zombie tailored to the current wave's stats.
func (wm *WaveManager) CreateWaveZombie(floorSize float32) *Zombie {
	id := getNextZombieID()
	half := (floorSize / 2) - 1.0

	var x, z float32
	edge := rand.Intn(4)
	switch edge {
	case 0: // North
		x = (rand.Float32()*2 - 1) * half
		z = -half
	case 1: // South
		x = (rand.Float32()*2 - 1) * half
		z = half
	case 2: // West
		x = -half
		z = (rand.Float32()*2 - 1) * half
	case 3: // East
		x = half
		z = (rand.Float32()*2 - 1) * half
	}

	speedVariation := (rand.Float32()*0.6 - 0.3) // ±0.3 speed variance
	hpVariation := float32(rand.Intn(2)) * 4.0

	return &Zombie{
		ID:             id,
		X:              x,
		Y:              -0.2,
		Z:              z,
		Angle:          0,
		Health:         wm.BaseZombieHP + hpVariation,
		MaxHealth:      wm.BaseZombieHP + hpVariation,
		Speed:          wm.BaseZombieSpeed + speedVariation,
		AttackCooldown: 0,
		Damage:         wm.BaseZombieDamage,
		AttackRange:    0.7,
		SlashCooldown:  0,
	}
}

// Update advances the wave timer and transitions states.
// Returns: (spawnZombie bool, waveJustCleared bool, waveJustStarted bool)
func (wm *WaveManager) Update(dt float32, activeZombieCount int) (spawnZombie bool, waveJustCleared bool, waveJustStarted bool) {
	if wm.State == WaveStatePlaying {
		wm.Timer -= dt
		wm.SpawnTimer += dt

		// Check if wave is cleared (either timer runs out OR all wave zombies killed)
		allSpawned := wm.ZombiesSpawned >= wm.TotalWaveZombies
		clearedByTimer := wm.Timer <= 0
		clearedByExtermination := allSpawned && activeZombieCount == 0

		if clearedByTimer || clearedByExtermination {
			// Transition to Intermission
			wm.State = WaveStateIntermission
			wm.Timer = IntermissionDuration
			waveJustCleared = true
			return false, waveJustCleared, false
		}

		// Spawn new zombie if limit not reached and interval elapsed
		if !allSpawned && wm.SpawnTimer >= wm.SpawnInterval && activeZombieCount < 10 {
			wm.SpawnTimer = 0
			wm.ZombiesSpawned++
			spawnZombie = true
		}
	} else if wm.State == WaveStateIntermission {
		wm.Timer -= dt
		if wm.Timer <= 0 {
			// Start next wave!
			wm.setupWave(wm.CurrentWave + 1)
			waveJustStarted = true
		}
	}

	return spawnZombie, waveJustCleared, waveJustStarted
}
