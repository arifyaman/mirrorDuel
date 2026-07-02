# mirrorDuel - Game Mechanics & Technical Documentation

## Overview
A 3D arena-style 1v1 multiplayer game built with PlayCanvas (client) and Node.js WebSocket server. Players move around a floor plane with camera-relative movement and skill-based projectile attacks.

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
- **Activation**: Left mouse click
- **Cooldown**: 0.2 seconds
- **Projectile Properties**:
  - Travel distance: 4 units
  - Speed: 7.5 units/sec
  - Travel time: ~0.53 seconds
- **Direction**: Towards mouse cursor position on ground plane (y=-0.5)

### Scene Elements
- **Floor**: Gray box (10x0.1x10) at y=-0.5, diffuse color (0.75, 0.75, 0.75)
- **Player**: Red/Blue box (0.5 scale) at y=-0.20
- **Forward Indicator**: Green strip on player showing forward direction
- **Lighting**:
  - Directional light (sun): warm white (1, 0.95, 0.8), intensity 2, soft shadows
  - Shadows: 2048 resolution, 20 unit distance, normal offset bias 0.02
- **Camera**: Static position (0, 10, 10), looking at origin
- **Background**: Clear color (0.1, 0.2, 0.3) - dark blue

## Project Structure

```
mirrorDuel/
├── .gitignore
├── tsconfig.base.json              # Shared TypeScript config
├── client/                         # PlayCanvas game client
│   ├── index.html                  # Entry point: scene setup, game loop, network
│   ├── package.json                # playcanvas 2.20.3, vite 8.1.1
│   ├── vite.config.js              # Vite config with WebSocket proxy
│   └── src/
│       ├── network/
│       │   ├── client.js           # WebSocket client, input queue, reconnect logic
│       │   └── protocol.js         # Binary encode/decode for client↔server
│       └── config.yaml             # Client-side skill configuration
└── server/                         # Node.js game server
    ├── tsconfig.json               # TypeScript config
    ├── package.json                # ws, tsx, typescript
    └── src/
        ├── server.ts               # Entry: WebSocket server, HTTP health check, game loop
        ├── room/
        │   ├── gameRoom.ts         # GameSession, Player, projectile logic, 60Hz tick
        │   └── roomManager.ts      # 1v1 matchmaking, input handling, state broadcast
        ├── network/
        │   ├── session.ts          # Per-player session, message dispatch
        │   └── protocol.ts         # Binary encode/decode (server-side)
        ├── config/
        │   └── index.ts            # GameConfig interface + defaults
        └── shared/
            └── protocol.ts         # Shared TypeScript types (PlayerInput, StateSnapshot, etc.)
```

## Client Architecture

### `index.html`
- **Scene**: Floor, camera, directional light, TAA with bloom
- **Render Pipeline**: TAA (jitter=1), ACES tone mapping, subtle bloom (0.02)
- **Input**: Key tracking (WASD), mouse raycasting to ground plane
- **Game Loop**: Sends inputs to server via network client
- **Rendering**: Receives server snapshots, creates/updates player entities

### `src/network/client.js`
- **WebSocket Client**: Connects to server, sends JOIN_ROOM on connect
- **Input Queue**: Batches frames, sends every 16ms
- **Auto-reconnect**: 2-second retry on disconnect
- **Message Handlers**: STATE_SNAPSHOT, ROOM_CREATED, DISCONNECT

### `src/network/protocol.js`
- **Binary Encoding**: `encodePlayerInput()` - 13 bytes (tick:2, moveX:1, moveZ:1, mouseX:4, mouseY:4, flags:1)
- **Binary Decoding**: `decodeStateSnapshot()` - variable length, players + projectiles
- **Message Types**: JOIN_ROOM(1), PLAYER_INPUT(2), STATE_SNAPSHOT(16), ROOM_CREATED(17), DISCONNECT(255)

### Entity System
- **Player Entities**: Created dynamically when server sends player IDs
- **Red/Blue**: Player 1 = red, Player 2 = blue
- **Indicator**: Green strip showing forward direction (opponent only)
- **Cleanup**: Destroyed on disconnect

## Server Architecture

### `server.ts`
- **WebSocket Server**: Port 5173, path `/ws`
- **HTTP Server**: Port 5172, health check endpoint `{"status":"ok","players":N}`
- **Game Loop**: 60Hz (16.67ms), processes inputs + updates rooms
- **Session Management**: UUID-based session IDs, disconnect cleanup

### `room/gameRoom.ts`
- **GameSession**: Manages 1v1 room, tick loop, projectile state
- **Player**: Buffered inputs, movement (camera-relative + speed modulation), angle (from mouse), cooldown
- **Movement**: `targetX/Z` with smooth lerp: `alpha = 1 - Math.exp(-8 * dt)`
- **Speed Modulation**: `speedMult = 0.75 + 0.25 * alignment` (dot product of moveDir and playerForward)
- **Projectile**: Created on click, tracked by `traveled` distance, removed when reaching maxReach

### `room/roomManager.ts`
- **Matchmaking**: Joins existing room (<2 players) or creates new one
- **Input Processing**: Queues inputs, triggers skill activation
- **Broadcast**: Sends STATE_SNAPSHOT every tick to all players in room
- **Disconnect**: Cleans up room, notifies opponent

### `network/protocol.ts`
- **Encoding**: `encodeStateSnapshot()` - 47 bytes per player, 33 bytes per projectile
- **Decoding**: `decodePlayerInput()` - validates 13-byte input
- **Message Parsing**: First byte = message type, rest = payload

### `config/index.ts`
- **GameConfig**: floorSize(10), playerSpeed(5), lerpFactor(8), speedStrafeFactor(0.75)
- **Skills**: cooldown(0.2), projectileSpeed(7.5), maxReach(4), maxBurstParticles(18), burstSpeed(8), burstDuration(1.5)

## Network Protocol

### Message Format
```
[messageType: 1 byte][payload: variable bytes]
```

### Client → Server
| Type | Name | Size | Format |
|------|------|------|--------|
| 1 | JOIN_ROOM | variable | `[nameLen: 1][name: bytes]` |
| 2 | PLAYER_INPUT | 13 | `[tick: u16][moveX: i8][moveZ: i8][mouseX: f32][mouseY: f32][flags: u8]` |

### Server → Client
| Type | Name | Size | Format |
|------|------|------|--------|
| 16 | STATE_SNAPSHOT | variable | `[tick: u16][playerCount: u8][players...][projCount: u8][projectiles...]` |
| 17 | ROOM_CREATED | variable | `[roomId: u16][myPlayerId: u8][opponentNameLen: u8][name: bytes]` |
| 255 | DISCONNECT | 0 | (empty) |

### StateSnapshot Details
- **Player**: `[id: u8][x: f32][y: f32][z: f32][angle: f32][cooldown: f32]` (21 bytes)
- **Projectile**: `[id: u8][x: f32][y: f32][z: f32][traveled: f32][dirX: f32][dirZ: f32]` (27 bytes)

## Development Workflow

### Run Server
```bash
cd server && npx tsx src/server.ts
```
- WebSocket: `ws://localhost:5173/ws`
- Health: `http://localhost:5172`

### Run Client
```bash
cd client && npm run dev
```
- Browser: `http://localhost:5174`
- Vite proxies `/ws` to server automatically

### Test 1v1
1. Start server
2. Open two browser windows at `http://localhost:5174`
3. First player connects, second player joins automatically
4. Both players see each other move

## Technical Notes

### Movement System
- Server tracks `targetX/Z` (immediate) and `x/Z` (smooth lerp)
- Camera-relative: W = -Z, S = +Z, A = -X, D = +X (in world space)
- Speed modulation based on player facing angle
- Floor bounds clamping: ±5 units

### Entity Management
- Player entities created dynamically from server state
- All entities added to `app.root` (not children)
- Materials must call `.update()` after property changes
- Shadow materials need `castShadows` and `receiveShadows` set

### Protocol Design
- Binary format for minimal bandwidth
- Server-authoritative: client sends inputs, not positions
- Latest input used (intermediate inputs discarded)
- State broadcast every tick (60Hz) to all players in room
