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
	ID     int
	Name   string
	X      float32
	Y      float32
	Z      float32
	Health float32

	TargetX float32
	TargetZ float32

	Angle        float32
	Cooldown     float32
	DashCooldown float32

	JustFired      bool
	JustDashed     bool
	JustShielded   bool
	AimX           float32
	AimZ           float32
	BufferedInputs []network.PlayerInput
	GameSession    *GameSession
	Session        SessionIface
	Config         *config.Config

	IsDashing    bool
	DashElapsed  float32
	DashStartX   float32
	DashStartZ   float32
	DashTargetX  float32
	DashTargetZ  float32

	ShieldCooldown     float32
	ShieldActive       bool
	ShieldActivatedTick int
	PerfectBlockUsed   bool

	SlashCooldown    float32
	SlashActive      bool
	SlashActiveTime  float32
	JustSlashed      bool
}

// NewPlayer creates a new Player.
func NewPlayer(id int, name string, x, y, z float32, cfg *config.Config) *Player {
	return &Player{
		ID:        id,
		Name:      name,
		X:         x,
		Y:         y,
		Z:         z,
		Health:    cfg.MaxHealth,
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
	if len(p.BufferedInputs) == 0 || p.Health <= 0 {
		p.BufferedInputs = nil
		return
	}

	last := &p.BufferedInputs[len(p.BufferedInputs)-1]

	if p.IsDashing {
		p.processDash(dt)
		p.processAngleAndAim(last)
		p.processMovementTarget(last, dt)
	} else {
		p.processNormal(last, dt)
	}

	// Cooldown decay
	if p.Cooldown > 0 {
		p.Cooldown -= dt
		if p.Cooldown < 0 {
			p.Cooldown = 0
		}
	}
	if p.DashCooldown > 0 {
		p.DashCooldown -= dt
		if p.DashCooldown < 0 {
			p.DashCooldown = 0
		}
	}
	if p.ShieldCooldown > 0 {
		p.ShieldCooldown -= dt
		if p.ShieldCooldown < 0 {
			p.ShieldCooldown = 0
		}
	}
	p.processShield()

	if p.SlashCooldown > 0 {
		p.SlashCooldown -= dt
		if p.SlashCooldown < 0 {
			p.SlashCooldown = 0
		}
	}
	p.processSlash()

	// Check for projectile activation (flags & 0x01)
	if last.Flags&0x01 != 0 && p.Cooldown <= 0 && !p.IsDashing {
		p.JustFired = true
	}

	// Check for dash activation (flags & 0x02)
	if last.Flags&0x02 != 0 && p.DashCooldown <= 0 && !p.IsDashing {
		p.startDash()
	}

	// Check for shield activation (flags & 0x04)
	if last.Flags&0x04 != 0 && p.ShieldCooldown <= 0 && !p.IsDashing {
		p.startShield()
	}

	// Check for slash activation (flags & 0x08)
	if last.Flags&0x08 != 0 && p.SlashCooldown <= 0 && !p.IsDashing {
		p.JustSlashed = true
		p.SlashCooldown = p.Config.Slash.Cooldown
	}

	// Clear buffer
	p.BufferedInputs = nil
}

func (p *Player) processNormal(last *network.PlayerInput, dt float32) {
	p.processMovementTarget(last, dt)
	p.applyLerp(dt)
	p.processAngleAndAim(last)
}

func (p *Player) processMovementTarget(last *network.PlayerInput, dt float32) {
	moveX := last.MoveX
	moveZ := last.MoveZ

	halfFloor := p.Config.FloorSize / 2
	speed := p.Config.PlayerSpeed

	if moveX != 0 || moveZ != 0 {
		moveDirX := float32(moveX)
		moveDirZ := float32(-moveZ)

		playerForwardX := math.Sin(float64(p.Angle))
		playerForwardZ := math.Cos(float64(p.Angle))

		moveLen := float32(math.Sqrt(float64(moveDirX*moveDirX + moveDirZ*moveDirZ)))
		normMoveX := moveDirX / moveLen
		normMoveZ := moveDirZ / moveLen

		alignment := normMoveX*float32(playerForwardX) + normMoveZ*float32(playerForwardZ)
		speedMult := 0.75 + 0.25*alignment

		p.TargetX += normMoveX * speed * speedMult * dt
		p.TargetZ += normMoveZ * speed * speedMult * dt
	}

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
}

func (p *Player) applyLerp(dt float32) {
	lerpFactor := p.Config.LerpFactor
	if lerpFactor == 0 {
		lerpFactor = 8
	}
	alpha := float32(1.0 - math.Exp(-float64(lerpFactor)*float64(dt)))
	p.X += (p.TargetX - p.X) * alpha
	p.Z += (p.TargetZ - p.Z) * alpha
}

func (p *Player) applyKnockback(dirX, dirZ float32, magnitude float32) {
	p.TargetX += dirX * magnitude
	p.TargetZ += dirZ * magnitude
	p.X += dirX * magnitude * 0.5
	p.Z += dirZ * magnitude * 0.5

	halfFloor := p.Config.FloorSize / 2
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
	if p.X < -halfFloor {
		p.X = -halfFloor
	} else if p.X > halfFloor {
		p.X = halfFloor
	}
	if p.Z < -halfFloor {
		p.Z = -halfFloor
	} else if p.Z > halfFloor {
		p.Z = halfFloor
	}
}

func (p *Player) healSkill(amount float32) {
	p.Health += amount
	if p.Health > p.Config.MaxHealth {
		p.Health = p.Config.MaxHealth
	}
}

func (p *Player) processAngleAndAim(last *network.PlayerInput) {
	mdx := last.MouseX - p.X
	mdz := last.MouseY - p.Z
	dist := float32(math.Sqrt(float64(mdx*mdx + mdz*mdz)))
	if dist > 0.01 {
		desiredAngle := math.Atan2(float64(mdx), float64(mdz))
		angleDiff := math.Atan2(math.Sin(desiredAngle-float64(p.Angle)), math.Cos(desiredAngle-float64(p.Angle)))
		maxDelta := float64(p.Config.TurnSpeed) * 0.01667
		if angleDiff > maxDelta {
			angleDiff = maxDelta
		} else if angleDiff < -maxDelta {
			angleDiff = -maxDelta
		}
		p.Angle += float32(angleDiff)
	}

	p.AimX = last.MouseX
	p.AimZ = last.MouseY
}

func (p *Player) startDash() {
	p.JustDashed = true
	p.IsDashing = true
	p.DashCooldown = p.Config.Dash.Cooldown
	p.DashElapsed = 0
	p.DashStartX = p.X
	p.DashStartZ = p.Z

	angle := float64(p.Angle)
	dirX := float32(math.Sin(angle))
	dirZ := float32(math.Cos(angle))
	dist := p.Config.Dash.Distance

	p.DashTargetX = p.X + dirX*dist
	p.DashTargetZ = p.Z + dirZ*dist

	halfFloor := p.Config.FloorSize / 2
	if p.DashTargetX < -halfFloor {
		p.DashTargetX = -halfFloor
	} else if p.DashTargetX > halfFloor {
		p.DashTargetX = halfFloor
	}
	if p.DashTargetZ < -halfFloor {
		p.DashTargetZ = -halfFloor
	} else if p.DashTargetZ > halfFloor {
		p.DashTargetZ = halfFloor
	}
}

func (p *Player) processDash(dt float32) {
	p.DashElapsed += dt
	duration := p.Config.Dash.Duration
	if duration <= 0 {
		duration = 1
	}
	t := float64(p.DashElapsed / duration)
	if t >= 1 {
		t = 1
	}

	s := float64(p.Config.Dash.EaseOutStart)
	if s < 0 {
		s = 0
	} else if s > 1 {
		s = 1
	}
	a := 2 / (1 + s)

	var eased float64
	if t < s {
		eased = a * t
	} else {
		u := (t - s) / (1 - s)
		eased = a*s + (1-a*s)*(1-(1-u)*(1-u))
	}

	p.X = p.DashStartX + (p.DashTargetX-p.DashStartX)*float32(eased)
	p.Z = p.DashStartZ + (p.DashTargetZ-p.DashStartZ)*float32(eased)

	if t >= 1 {
		p.IsDashing = false
		p.TargetX = p.X
		p.TargetZ = p.Z	
	}
}

func (p *Player) startShield() {
	p.JustShielded = true
	p.ShieldCooldown = p.Config.Shield.Cooldown
	p.ShieldActive = true
}

func (p *Player) processShield() {
	if !p.ShieldActive {
		return
	}
	elapsed := p.Config.Shield.Cooldown - p.ShieldCooldown
	if elapsed >= p.Config.Shield.ActiveDuration {
		p.ShieldActive = false
	}
}

func (p *Player) startSlash() {
	p.SlashActive = true
	p.SlashActiveTime = 0
	p.JustSlashed = true
}

func (p *Player) processSlash() {
	if !p.SlashActive {
		return
	}
	p.SlashActiveTime += 1.0 / 60.0 // ~16ms per tick
	if p.SlashActiveTime >= 0.15 {
		p.SlashActive = false
	}
}
