# mirrorDuel - Game Mechanics & Technical Documentation

## Overview
A 3D arena-style game built with PlayCanvas where a player (red box) moves around a floor plane with a camera-relative movement system and skill-based projectile attacks.

## Basic Game Mechanics

### Player Movement
- **Controls**: WASD keys for movement, mouse for aiming
- **Movement Direction**: Relative to camera orientation
  - W = forward (camera forward), S = backward
  - A = left strafe, D = right strafe
- **Player Orientation**: Player entity looks toward mouse cursor position on the ground plane
- **Speed Modulation**: Speed varies based on alignment between movement direction and facing direction
  - Moving forward (aligned): 100% speed
  - Moving sideways/strafing: 75% speed
  - Formula: `speedMultiplier = 0.75 + 0.25 * alignment` where alignment is dot product of moveDir and playerForward

### Projectile Skill
- **Activation**: Left mouse click
- **Cooldown**: 0.2 seconds
- **Projectile Properties**:
  - Travel distance: 4 units
  - Speed: 15 units/sec
  - Travel time: ~0.27 seconds
- **Direction**: Towards mouse cursor position on ground plane (y=-0.5)
- **Visual Effects**:
  - Cyan colored cube (0.16 scale)
  - Burst particles at launch (20 particles with random velocities)
  - Particles biased 80% toward projectile direction with 20% randomness
  - Particles fade, shrink, and slow down over lifetime (0.5-1.5 seconds)

### Scene Elements
- **Floor**: Gray box (10x0.1x10) at y=-0.5, diffuse color (0.75, 0.75, 0.75)
- **Player**: Red box (0.5 scale) at y=-0.20, diffuse color (1,0,0)
- **Forward Indicator**: Green strip (1.1x1.1x0.2) on player showing forward direction
- **Lighting**:
  - Directional light (sun): warm white (1, 0.95, 0.8), intensity 2, soft shadows
  - Shadows: 2048 resolution, 20 unit distance, normal offset bias 0.02
- **Camera**: Static position (0, 10, 10), looking at origin
- **Background**: Clear color (0.1, 0.2, 0.3) - dark blue

## Technical Architecture

### Project Structure
```
client/
├── index.html                    # Main entry point, scene setup
├── package.json                  # Dependencies: playcanvas 2.20.3, vite 8.1.1
├── src/
│   ├── player.js                 # Player class with movement and skill management
│   ├── skill.js                  # Base Skill class for extensibility
│   └── skills/
│       └── projectile.js         # ProjectileSkill implementation
```

### Key Files

#### `index.html` (Lines 1-99)
- **Entry Point**: Creates PlayCanvas Application with canvas
- **Scene Setup**: Floor, camera, directional light, TAA
- **Render Pipeline**:
  - TAA enabled with jitter=1
  - ACES tone mapping
  - Subtle bloom (intensity: 0.02)
  - No MSAA (TAA replaces it)

#### `src/player.js` (Lines 1-165)
- **Player Class**: Manages movement, skills, and entity hierarchy
- **Key Methods**:
  - `constructor()`: Creates player entity, forward strip, projectile, registers skills
  - `raycastToPlane(e)`: Casts ray from camera through mouse to ground plane (y=-0.5)
  - `update(dt)`: Handles movement input, camera-relative direction, skill updates
  - `tryActivateSkill()`: Tries to activate first available skill
  - `addSkill(skill)`, `removeSkill(skill)`: Skill management

#### `src/skill.js` (Lines 1-24)
- **Base Skill Class**: Provides cooldown system
- **Key Properties**:
  - `cooldown`: Current cooldown timer
  - `maxCooldown`: Maximum cooldown duration
- **Key Methods**:
  - `canActivate()`: Returns true if cooldown <= 0
  - `activate()`: Sets cooldown to maxCooldown
  - `update(dt)`: Decrements cooldown
  - `onRemove()`: Cleanup callback

#### `src/skills/projectile.js` (Lines 1-192)
- **ProjectileSkill Class**: Implements projectile attack
- **Key Methods**:
  - `_createProjectile()`: Creates projectile entity with material
  - `_createBurstParticle()`: Creates individual particle entity
  - `activate(cameraComponent)`: Launches projectile with burst particles
  - `update(dt)`: Updates projectile position and particle animations
  - `onRemove()`: Cleans up projectile and all particles

### Movement System Details
```javascript
// Camera-relative movement vector
const moveDir = new Vec3(
  cameraForward.x * moveZ + cameraRight.x * moveX,
  0,
  cameraForward.z * moveZ + cameraRight.z * moveX
).normalize();

// Speed multiplier based on alignment
const alignment = moveDir.dot(playerForward);
const speedMultiplier = 0.75 + 0.25 * alignment;

// Smooth movement with exponential interpolation
const alpha = 1 - Math.exp(-this.lerpFactor * dt);
pos.x += (this.targetPos.x - pos.x) * alpha;
```

### Skill System Architecture
The skill system is designed to be extensible:
1. Create a class that extends `Skill` base class
2. Implement `activate()` method for skill activation
3. Implement `update(dt)` method for ongoing effects
4. Optionally implement `onRemove()` for cleanup
5. Register skill with `player.addSkill(new YourSkill(app, player))`

### Particle System
- **Type**: CPU-managed individual Entity objects (not GPU particles)
- **Burst**: 20 particles created at launch
- **Motion**: Random velocity directions, biased toward projectile direction
- **Fade**: Linear color fade from full opacity to transparent
- **Shrink**: Scale proportional to `lifeRatio = 1 - (life / maxLife)`
- **Slowdown**: Speed decreases with `currentSpeed = speed * (lifeRatio^2)`

## Important Technical Notes

### Entity Creation
- Projectile entity is created in `player.js` during initialization (line 55)
- Particle entities are created lazily during `activate()` in `projectile.js`
- All entities added to `app.root`, not as children (avoids render issues)

### Raycasting
- Uses camera's `screenToWorld` method
- Projects from nearClip plane to farClip plane
- Intersects with ground plane at y=-0.5
- Stores result in `this.intersectionPlayer` for skill use

### Material Management
- All materials must call `.update()` after setting properties
- Shadow materials need both `castShadows` and `receiveShadows` set to `true`
- StandardMaterial properties: `diffuse`, `emissive`, `map`, `blendType`, `depthWrite`

### Player State
- `this.entity`: Main player Entity
- `this.intersectionPlayer`: Current mouse raycast intersection point
- `this.skills[]`: Array of active skills
- `this.targetPos`: Movement target position (lerped toward)

### Common Patterns
1. **Skill Activation**: Check `canActivate()` before calling `activate()`
2. **Entity Cleanup**: Always remove from parent before calling `destroy()`
3. **Position Updates**: Use `setPosition(x, y, z)` not vector assignment
4. **Material Updates**: Call `material.update()` after any property change
