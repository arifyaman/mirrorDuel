# mirrorDuel - Game Mechanics & Technical Documentation

## Overview
A 3D arena-style 1v1 multiplayer game built with PlayCanvas (client) and Go WebTransport/QUIC server. Players move around a 20x20 arena with camera-relative movement and skill-based projectile attacks.

## Game Mechanics

### Player Movement
- **Controls**: WASD keys for movement, mouse for aiming
- **Movement Direction**: Camera-relative
  - W = forward (toward camera), S = backward
  - A = left strafe, D = right strafe
- **Player Orientation**: Player entity looks toward mouse cursor position on ground plane
- **Speed Modulation**: Speed varies based on alignment between movement direction and facing direction
  - Moving forward (aligned): 100% speed
  - Moving sideways/strafing: 75% speed
  - Formula: `speedMultiplier = 0.75 + 0.25 * alignment` where alignment is dot product of moveDir and playerForward

### Projectile Skill
- **Activation**: R key (flag 0x01) (flag 0x01)
- **Cooldown**: 3 seconds
- **Projectile Properties**:
  - Travel distance: 8 units
  - Speed: 13.5 units/sec
  - Travel time: ~0.59 seconds
- **Direction**: Towards mouse cursor position on ground plane (y=-0.5)

### Dash Skill
- **Activation**: Spacebar (flag 0x02)
- **Cooldown**: 7 seconds (separate from fire cooldown)
- **Distance**: 4 units in facing direction
- **Duration**: ~0.333 seconds (20/60) with ease-out curve
- **Curve**: Piecewise ease-out — constant speed until `EaseOutStart` (configurable, default 0.2), then ease-out quad deceleration
- **Movement**: Player can still aim/rotate and queue WASD movement while dashing (updates angle + TargetX/Z for post-dash continuation)
- **Trail Visual**: Ghostly after-images — player-colored semi-transparent boxes at each position along path, drifting upward+outward with velocity decay, shrinking and fading over 600ms
- **Evasion**: Player dodges all projectiles while dashing (checked before damage in collision loop, after shield block)
- **Server authoritative**: Dash start, interpolation, and end all computed on server; client receives snapshots

### Shield Skill
- **Activation**: F key (flag 0x04)
- **Cooldown**: 7 seconds
- **Active Duration**: 1 second (shield visual is present)
- **Effect**: Blocks incoming projectiles within 100° front-facing cone while active (server-authoritative, projectile destroyed on contact)
- **Visual**: Voronoi crack-pattern sphere with 100° front-facing cone, opening animation (0.3s ease-out), fully open, then closing animation (0.3s ease-in)
- **Shield blocks projectiles**: Server checks `ShieldActive` and dot product (facing vs direction to projectile) ≥ cos(50°) before dealing damage; blocked projectiles are destroyed with no damage dealt

### Slash Skill
- **Activation**: Mousedown (flag 0x08)
- **Cooldown**: 0.5 seconds
- **Damage**: 4.2 (instant)
- **Hit Range**: 0.95 units radius
- **Cone Angle**: 85° front-facing
- **VFX**: Crescent arc mesh with additive shader (glow, streaks, sweep reveal, fade), spawns 0.3 units forward of player
- **Server-authoritative**: Hit detection, cooldown, dash dodge, shield block all on server
- **VFX notification**: Server embeds `EVENT_SLASH` in STATE_SNAPSHOT events section (type 1, payload: attacker ID, position, angle) — client spawns VFX directly from embedded event, never misses an animation
- **Mirror mechanic**: Slash activation reduces opponent's slash cooldown by 50%

### Knockback & Hurt Bounce
- **Knockback**: Server applies positional displacement on damage (both projectile and slash hits)
  - Direction: away from damage source (projectile hit = away from projectile; slash hit = away from attacker)
  - Magnitude: `damage * 0.08` — projectile (20 dmg) = 1.6u total, slash (4.2 dmg) = 0.34u total
  - Implementation: `applyKnockback(dirX, dirZ, magnitude)` pushes both `TargetX/Z` (50% via lerp) and `X/Z` (50% instant)
  - Floor clamped to ±10 units
- **Hurt Bounce**: Client-side vertical bounce visual on health drop
  - Triggers when client detects health decrease in snapshot
  - Physics: initial upward velocity 4.0, gravity 15.0 — peak ~0.53u, settles in ~0.27s
  - Applied as Y offset in `applyPlayers()`, independent of server position

### Mirror Cooldown Mechanic
- When ANY skill activates (fire, dash, shield, OR slash), ALL cooldowns on the opponent are reduced by 50%
- Fire activation reduces opponent's fire cooldown by 50%
- Dash activation reduces opponent's dash cooldown by 50%
- Shield activation reduces opponent's shield cooldown by 50%
- Slash activation reduces opponent's slash cooldown by 50%
- Each skill only mirrors the same skill on the opponent (not cross-skill)

### HUD
- **4 Skill Indicators**: Triangle layout (bottom-right), each with custom SVG icon and cooldown ring
  - Fire (Skill 1): Crosshair icon, red ring, 3s cooldown, **R** key
  - Dash (Skill 2): Lightning bolt icon, gold ring, 7s cooldown, **Space** key
  - Shield (Skill 3): Shield icon with cross, blue ring, 7s cooldown, **F** key
  - Slash (Skill 4): Scythe icon, cyan ring, 0.5s cooldown, **Mousedown**
- **Cooldown Display**: Animated ring (per-skill max values [3, 7, 7, 0.5]), text shows time remaining or skill name when available
- **Key Labels**: R/Space/F/M shown above each skill icon
- **Health Bars**: 3D world-space bars above each player, hidden when dead

### Scene Elements
- **Floor**: Gray box (20x0.05x20) at y=-0.5, diffuse color (0.12, 0.12, 0.18)
- **Grid**: Green grid lines at each integer position within bounds
- **Player**: Red/Blue box (0.5 scale) at y=-0.20
- **Forward Indicator**: Green strip on player showing forward direction
- **Boundary Walls**: Semi-transparent red walls at arena edges
- **Lighting**:
  - Directional light (sun): white (0.9, 0.9, 1.0), intensity 2.5, 2048 shadow resolution, 30 unit distance
  - Point lights per player and projectile for glow effects
  - Ambient fill + TAA with bloom (intensity 0.1)
- **Camera**: Follows player midpoint (2+ players) or single player with 0.4 lerp factor
  - Dynamic zoom: pulls back when players are >10 units apart
  - LookAt fixed at origin, camera offset `{x:0, y:10, z:16}` with scaled distance

## Project Structure

```
mirrorDuel/
├── .gitignore
├── client/                         # PlayCanvas game client
│   ├── index.html                  # Entry point: scene setup, game loop, network
│   ├── package.json                # playcanvas 2.20.3, vite 8.1.1
│   ├── vite.config.js              # Vite config with WebTransport proxy
│   └── src/
│       ├── network/
│       │   ├── webtransport.js     # WebTransport client, input queue, length-prefixed framing
│       │   └── protocol.js         # Binary encode/decode for client↔server
│       ├── scene.js                # Floor, camera, lights, walls, post-processing
│       ├── physics.js              # Player/projectile entity creation and rendering
│       ├── input.js                # WASD keys, mouse tracking, raycasting
│       ├── game.js                 # Main game loop, network callbacks, camera follow logic
│       ├── network.js              # Network session tracking
│       ├── ui.js                   # 3D health bars, 4-skill cooldown HUD with SVG icons and screen flash
│       └── game-title.js           # Title screen animation
└── server/
    ├── cmd/server/             # Entry: WebTransport server, HTTP health check, game loop
    ├── internal/
    │   ├── room/               # GameSession, Player, projectile logic, matchmaking
    │   ├── network/            # Session, length-prefixed binary protocol encode/decode
    │   └── config/             # Server configuration (FloorSize:20, Speed:13.5, MaxReach:8)
    └── tls/                    # Self-signed TLS certificates for WebTransport
```

## Client Architecture

### `index.html`
- **Scene**: Floor with grid, camera, directional light, TAA with bloom
- **Render Pipeline**: TAA (jitter=1), ACES tone mapping, bloom (0.1)
- **Input**: Key tracking (WASD, R for fire, Space for dash, F for shield), mousedown for slash, mouse raycasting to ground plane
- **Game Loop**: Sends inputs to server, receives snapshots, updates HUD
- **Rendering**: Receives server snapshots, creates/updates player and projectile entities

### `src/network/webtransport.js`
- **WebTransport Client**: Connects via QUIC, sends JOIN_ROOM on connect
- **Length-Prefixed Framing**: `[length: u32 LE][msgType: u8][payload]`
- **Read Buffer**: Accumulates data across reads, parses complete messages (handles coalesced/partial reads)
- **Input Queue**: Batches frames, sends every 16ms
- **Auto-reconnect**: 2-second retry on disconnect

### `src/input.js`
- **Slash Input**: mousedown/mouseup sets `inputSlash` flag (0x08) for slash skill activation

### `src/game.js`
- **Slash VFX**: `onSlashEvent()` processes slash events embedded in STATE_SNAPSHOT snapshots and spawns crescent VFX at the reported position/angle

### `src/network/protocol.js`
- **Binary Encoding**: `encodePlayerInput()` - 13 bytes (tick:2, moveX:1, moveZ:1, mouseX:4, mouseY:4, flags:1)
  - flags: `0x01` = fire, `0x02` = dash, `0x04` = shield, `0x08` = slash
- **Binary Decoding**: `decodeStateSnapshot()` - variable length, players + projectiles + events
  - Player: 37 bytes (1 u8 + 9 f32) — includes shieldCooldown, slashCooldown
  - Events: `[eventCount: u8][events...]` — each event: `[eventType: u8][payload: varies]`
- **Message Types**: JOIN_ROOM(1), PLAYER_INPUT(2), STATE_SNAPSHOT(16), ROOM_CREATED(17), DISCONNECT(255)
- **Event Types**: EVENT_SLASH(1) — `[playerId: u8][x: f32][z: f32][angle: f32]` (13 bytes)

### Entity System
- **Player Entities**: Created dynamically from server state
- **Red/Blue**: Player 1 = red, Player 2 = blue
- **Indicator**: Green strip showing forward direction (opponent only)
- **Projectile Entities**: Spawn at start position, compute position from tick delta
- **Slash VFX**: Crescent mesh with additive shader, sweep reveal animation, fade out — triggered by server events embedded in STATE_SNAPSHOT, never misses an animation
- **Entity Cleanup**: `applyPlayers()` destroys entities for player IDs absent from snapshot (mirrors `applyProjectiles()` pattern); disconnecting opponents disappear naturally

## Server Architecture

### `cmd/server/main.go`
- **WebTransport Server**: Port 4433 (QUIC), path `/wt`
- **HTTP Server**: Port 8081, health check `{"status":"ok","players":N}`
- **Game Loop**: 60Hz (16.67ms), processes inputs + updates rooms
- **TLS**: Self-signed certificate from `tls/localhost.pem`

### `internal/room/game_session.go`
- **GameSession**: Manages 1v1 room, tick loop, projectile state
- **Player**: Buffered inputs, movement (camera-relative + speed modulation), angle (from mouse), cooldown, dash state
- **Movement**: `targetX/Z` with smooth lerp: `alpha = 1 - exp(-8 * dt)`
- **Speed Modulation**: `speedMult = 0.75 + 0.25 * alignment` (dot product of moveDir and playerForward)
- **Projectile**: Created on R key, tracked by traveled distance, removed when reaching maxReach
- **Slash**: Instant hit detection (85° cone, 0.95 radius), mirror cooldown reduction
- **Mirror Cooldowns**: Each skill activation reduces only the same skill on opponent by 50% (fire→fire, dash→dash, shield→shield, slash→slash)
- **Room Reset**: When 2nd player joins, `Reset()` places both players at spawn positions (P1: -2/-0.2, P2: 2/-0.2) with full health, zero cooldowns, cleared projectiles; P1 faces +X (π/2), P2 faces -X (-π/2)

### `internal/room/room_manager.go`
- **Matchmaking**: Joins existing room (<2 players) or creates new one
- **Player ID**: Picks first free slot from {1, 2} (not `len+1`), so either player leaving and rejoining works correctly
- **Input Processing**: Queues inputs, triggers skill activation
- **Broadcast**: Sends STATE_SNAPSHOT every tick to all players in room; events (slash VFX, etc.) are embedded in the snapshot
- **Disconnect**: Removes player from room, keeps room open for replacement (only deletes empty rooms)

### `internal/network/protocol.go`
- **Length-Prefixed Framing**: `encodeFrame(msgType, data)` → `[length: u32 LE][msgType: u8][payload]`
- **Encoding**: `encodeStateSnapshot()` - 37 bytes per player, 31 bytes per projectile; events embedded in snapshot tail
- **Decoding**: `decodePlayerInput()` - validates 13-byte input
- **Read Loop**: Handles multiple coalesced messages per read

### `internal/network/session.go`
- **Session**: Wraps WebTransport stream, manages connection state
- **SendMsg**: Length-prefixed write to QUIC stream
- **Read Loop**: Accumulates data, parses messages in loop

### `internal/config/config.go`
- **Config**: FloorSize(20), PlayerSpeed(5), LerpFactor(8), SpeedStrafe(0.75), TurnSpeed(π*5.5), KnockbackScale(0.08)
- **Projectile**: Cooldown(3), Speed(13.5), MaxReach(8), MaxParticles(18), BurstSpeed(8), BurstDuration(1.5)
- **Dash**: Cooldown(7), Distance(4), Duration(0.333), EaseOutStart(0.2)
- **Slash**: Cooldown(0.5), Damage(4.2), HitRadius(0.95), ConeAngle(85)
- **All durations in seconds** (no tick-based values)

## Network Protocol

### Length-Prefixed Frame Format
```
[length: u32 LE][msgType: u8][payload: variable bytes]
```
- `length` covers msgType byte + payload (1 + payload size)
- Handles QUIC stream coalescing and partial reads

### Client → Server
| Type | Name | Size | Format |
|------|------|------|--------|
| 1 | JOIN_ROOM | variable | `[nameLen: 1][name: bytes]` |
| 2 | PLAYER_INPUT | 13 | `[tick: u16][moveX: i8][moveZ: i8][mouseX: f32][mouseY: f32][flags: u8]` |

`flags`: `0x01` = fire, `0x02` = dash, `0x04` = shield, `0x08` = slash

### Server → Client
| Type | Name | Size | Format |
|------|------|------|--------|
| 16 | STATE_SNAPSHOT | variable | `[tick: u16][playerCount: u8][players...][projCount: u8][projectiles...][eventCount: u8][events...]` |
| 17 | ROOM_CREATED | variable | `[roomId: u16][myPlayerId: u8][opponentNameLen: u8][name: bytes]` |
| 255 | DISCONNECT | 0 | (empty) |

### StateSnapshot Details
- **Player**: `[id: u8][x: f32][y: f32][z: f32][angle: f32][cooldown: f32][health: f32][dashCooldown: f32][shieldCooldown: f32][slashCooldown: f32]` (37 bytes, 9 floats)
- **Projectile**: `[id: u8][spawnTick: u16][startX: f32][y: f32][startZ: f32][dirX: f32][dirZ: f32][speed: f32][maxReach: f32]` (31 bytes)
- **Event**: `[eventType: u8][payload: varies]` — event sub-types: EVENT_SLASH(1) = `[playerId: u8][x: f32][z: f32][angle: f32]` (13 bytes)

## Git & Deployment

### Push Policy
AI agents must **never** `git push` after committing unless explicitly asked by the user. Commits are staged and committed locally; pushing requires user instruction.

### Pre-Push Hook (`.githooks/pre-push`)
On `git push`, the pre-push hook automatically runs `server/deploy.sh` which:
1. Builds the Go server binary (`go build`)
2. Stops the running service (so binary can be overwritten)
3. Copies binary + `.env.production` to VPS (`/home/debian/apps/mirrorDuel/server`)
4. Builds the client (`cd ../client && npm run build`)
5. Deploys client build to VPS (`/home/debian/apps/mirrorDuel/ui`)
6. Reloads nginx
7. Updates systemd service (logs to `server.log`, not journald)
8. Restarts `mirrorduel` service

No confirmation or interactivity checks — deploy runs on every push.

### Project Structure (additions)
```
mirrorDuel/
├── .githooks/
│   └── pre-push              # Auto-deploy hook (builds + deploys server & client)
├── server/
│   └── deploy.sh             # Deploy script (binary, client, systemd, nginx)
```

## Development Workflow

### Run Server (Go + WebTransport/QUIC)
```bash
cd server && go build -o main ./cmd/server/ && ./main
```
- WebTransport: `https://localhost:4433/wt`
- Health: `http://localhost:8081/health`

### Run Client
```bash
cd client && npm run dev
```
- Browser: `http://localhost:5174`

### Test 1v1
1. Start server
2. Open two browser windows at `http://localhost:5174`
3. First player connects, second player joins automatically
4. Both players see each other move and fight

## Environment Configuration

Both client and server use `.env` files for configurable endpoints and ports.

### Client `.env` (VITE_* vars)
| File | Loaded when | Purpose |
|------|-------------|---------|
| `.env.development` | `npm run dev` | Local dev server URL |
| `.env.production` | `npm run build` | Production server URL |

- **VITE_SERVER_URL**: WebTransport server address (`host:port`), default `localhost:4433`

### Server `.env` (env vars)
Set these via environment variables or copy to `.env`:
| Variable | Default | Description |
|----------|---------|-------------|
| `QUIC_PORT` | `4433` | WebTransport/QUIC listen port |
| `HTTP_PORT` | `8081` | HTTP health check port |
| `CERT_FILE` | `tls/localhost.pem` | TLS certificate path |
| `KEY_FILE` | `tls/localhost-key.pem` | TLS private key path |

Run with custom config:
```bash
QUIC_PORT=4433 HTTP_PORT=8081 ./main
# or export vars from .env
export $(grep -v '^#' .env.development | xargs) && ./main
```

## Technical Notes

### Camera System
- Follows player midpoint when 2+ players, otherwise tracks single player
- Smooth lerp with `cameraFollowFactor = 0.4` (player moves 10 units → camera moves ~4 units)
- Dynamic zoom: camera height/distance scale by `1 + max(0, dist - 10) * 0.08` when players >10 units apart
- LookAt always fixed at origin (0, 0, 0)

### Movement System
- Server tracks `targetX/Z` (immediate) and `x/Z` (smooth lerp)
- Camera-relative: W = -Z, S = +Z, A = -X, D = +X (in world space)
- Speed modulation based on player facing angle
- Floor bounds clamping: ±10 units (FloorSize=20)

### Entity Management
- Player entities created dynamically from server state
- All entities added to `app.root` (not children)
- Materials must call `.update()` after property changes
- Shadow materials need `castShadows` and `receiveShadows` set

### Protocol Design
- Length-prefixed framing handles QUIC stream coalescing and partial reads
- Binary format for minimal bandwidth
- Server-authoritative: client sends inputs, not positions
- Latest input used (intermediate inputs discarded)
- State broadcast every tick (60Hz) to all players in room
