package room

import (
	"math"

	"mirror-duel-server-go/internal/config"
	"mirror-duel-server-go/internal/network"
)

// Projectile holds spawn data for a projectile.
type Projectile struct {
	ID          int
	StartX      float32
	Y           float32
	StartZ      float32
	DirX        float32
	DirZ        float32
	Speed       float32
	MaxReach    float32
	SpawnTick   int
	PlayerOwner int
}

// Player mirrors the TypeScript Player class.
type Player struct {
	ID   int
	Name string
	X    float32
	Y    float32
	Z    float32

	TargetX float32
	TargetZ float32

	Angle    float32
	Cooldown float32

	JustFired      bool
	BufferedInputs []network.PlayerInput
	GameSession    *GameSession
	Session        SessionIface
	Config         *config.Config
}

// NewPlayer creates a new Player.
func NewPlayer(id int, name string, x, y, z float32, cfg *config.Config) *Player {
	return &Player{
		ID:        id,
		Name:      name,
		X:         x,
		Y:         y,
		Z:         z,
		TargetX:   x,
		TargetZ:   z,
		Config:    cfg,
	}
}

// QueueInput appends to the player's input buffer.
func (p *Player) QueueInput(input network.PlayerInput) {
	p.BufferedInputs = append(p.BufferedInputs, input)
}

// ProcessInputs processes buffered inputs for one tick.
// Takes only the last input (intermediate inputs are discarded).
func (p *Player) ProcessInputs(dt float32) {
	if len(p.BufferedInputs) == 0 {
		return
	}

	last := &p.BufferedInputs[len(p.BufferedInputs)-1]
	moveX := last.MoveX
	moveZ := last.MoveZ

	halfFloor := p.Config.FloorSize / 2
	speed := p.Config.PlayerSpeed

	// Update target position with camera-relative movement + speed modulation
	if moveX != 0 || moveZ != 0 {
		// Camera-relative: W=-Z, S=+Z, A=-X, D=+X
		moveDirX := float32(moveX)
		moveDirZ := float32(-moveZ)

		// Player forward direction (from angle)
		playerForwardX := math.Sin(float64(p.Angle))
		playerForwardZ := math.Cos(float64(p.Angle))

		// Normalized move direction
		moveLen := float32(math.Sqrt(float64(moveDirX*moveDirX + moveDirZ*moveDirZ)))
		normMoveX := moveDirX / moveLen
		normMoveZ := moveDirZ / moveLen

		// Alignment (dot product of move dir and player forward)
		alignment := normMoveX*float32(playerForwardX) + normMoveZ*float32(playerForwardZ)
		speedMult := 0.75 + 0.25*alignment

		p.TargetX += normMoveX * speed * speedMult * dt
		p.TargetZ += normMoveZ * speed * speedMult * dt
	}

	// Clamp target to floor bounds [-5, 5]
	if p.TargetX < -halfFloor {
		p.TargetX = -halfFloor
	} else if p.TargetX > halfFloor {
		p.TargetX = halfFloor
	}
	if p.TargetZ < -halfFloor {
		p.TargetZ = -halfFloor
	} else if p.TargetZ > halfFloor {
		p.TargetZ = halfFloor
	}

	// Smooth lerp toward target position
	lerpFactor := p.Config.LerpFactor
	if lerpFactor == 0 {
		lerpFactor = 8
	}
	alpha := float32(1.0 - math.Exp(-float64(lerpFactor)*float64(dt)))
	p.X += (p.TargetX - p.X) * alpha
	p.Z += (p.TargetZ - p.Z) * alpha

	// Update angle toward mouse cursor
	mdx := last.MouseX - p.X
	mdz := last.MouseY - p.Z
	dist := float32(math.Sqrt(float64(mdx*mdx + mdz*mdz)))
	if dist > 0.01 {
		p.Angle = float32(math.Atan2(float64(mdx), float64(mdz)))
	}

	// Cooldown decay
	if p.Cooldown > 0 {
		p.Cooldown -= dt
		if p.Cooldown < 0 {
			p.Cooldown = 0
		}
	}

	// Clear buffer
	p.BufferedInputs = nil
}


