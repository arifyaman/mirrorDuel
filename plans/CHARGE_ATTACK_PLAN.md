# Charge Attack Mechanic — Implementation Plan

## Overview

Change Fire (R key) from instant-release to charge-up mechanic:

- **1st press** → starts charging (notified to both players via server event)
- **2nd press** → releases charged projectile (damage/speed/scale with charge time)
- **X key** → cancels charge (no cooldown, no heal)
- **Max charge** → visual indicator for both players

---

## Config Values

| Field | Value | Description |
|-------|-------|-------------|
| `ChargeMinTime` | 0.2s | Minimum charge time before release is allowed |
| `ChargeMaxTime` | 2.0s | Time to reach full charge (100% stats) |
| `ChargeMinDamage` | 20 | Unarged damage (same as current) |
| `ChargeMaxDamage` | 40 | Fully charged damage |
| `ChargeMinSpeed` | 13.5 | Uncharged projectile speed |
| `ChargeMaxSpeed` | 20.0 | Fully charged projectile speed |
| `ChargeMinReach` | 13.0 | Uncharged max travel distance |
| `ChargeMaxReach` | 18.0 | Fully charged max travel distance |

---

## Protocol Changes

### Input Flags (no format change, 13 bytes)

| Flag | Value | Meaning |
|------|-------|---------|
| 0x01 | `flags & 0x01` | **Fire toggle**: if idle → start charging; if charging → release |
| 0x10 | `flags & 0x10` | **Cancel charge** |

### Snapshot Player Encoding (37 → 42 bytes)

| Field | Type | Size | Description |
|-------|------|------|-------------|
| id | u8 | 1 | Player ID |
| x | f32 | 4 | Position X |
| y | f32 | 4 | Position Y |
| z | f32 | 4 | Position Z |
| angle | f32 | 4 | Facing angle |
| cooldown | f32 | 4 | Fire cooldown remaining |
| health | f32 | 4 | Current health |
| dashCooldown | f32 | 4 | Dash cooldown remaining |
| shieldCooldown | f32 | 4 | Shield cooldown remaining |
| slashCooldown | f32 | 4 | Slash cooldown remaining |
| **isCharging** | **u8** | **1** | **0 = not charging, 1 = charging** (NEW) |
| **chargeLevel** | **f32** | **4** | **0.0–1.0 charge progress** (NEW) |

### New Event Types

| Type | Value | Payload (13 bytes) |
|------|-------|---------------------|
| `EventChargeStart` | 3 | `[playerId: u8][x: f32][z: f32][angle: f32]` |
| `EventChargeMax` | 4 | `[playerId: u8][x: f32][z: f32][angle: f32]` |

---

## Interaction Matrix

| Interaction | Behavior |
|-------------|----------|
| Charge + Dash | Cancel charge, dash executes |
| Charge + Shield | Cancel charge, shield activates |
| Charge + Slash | Cancel charge, slash executes |
| Charge + Hit (projectile/slash) | Continue charging (knockback doesn't interrupt) |
| Charge + Death | Cancel charge |
| Charge + Disconnect | Clear charge state |
| Release + Cooldown > 0 | Blocked (can't fire during cooldown) |
| Cancel | No cooldown applied, no heal |

---

## VFX Design

### Charge Glow (per-player, driven by snapshot `isCharging` + `chargeLevel`)

| Charge Level | Pulse Rate | Emissive Intensity | Scale |
|--------------|------------|-------------------|-------|
| 0.0–0.3 | 2 Hz | 1.0–2.0 | 1.0 |
| 0.3–0.7 | 4 Hz | 1.0–4.0 | 1.02 |
| 0.7–1.0 | 6 Hz | 1.0–6.0 | 1.05 |
| 1.0 (max) | constant | 8.0 | 1.08 |

**Formula:** `emissiveIntensity = 1.0 + chargeLevel * 7.0 * (0.5 + 0.5 * sin(time * pulseRate))`

### Event Flashes

- **EventChargeStart** → brief emissive flash (100ms, intensity 5)
- **EventChargeMax** → bright pulse flash (200ms, intensity 10)

---

## Chunks

### Chunk 1: Server Config + Data Structures

**Goal:** Add all charge-related config and player state to server

**Files:**
- `server/internal/config/config.go`
- `server/internal/room/types.go`

**Changes:**
1. `config.go` — add 8 charge config fields to `Config` struct:
   ```go
   ChargeMinTime    float32 `json:"chargeMinTime"`
   ChargeMaxTime    float32 `json:"chargeMaxTime"`
   ChargeMinDamage  float32 `json:"chargeMinDamage"`
   ChargeMaxDamage  float32 `json:"chargeMaxDamage"`
   ChargeMinSpeed   float32 `json:"chargeMinSpeed"`
   ChargeMaxSpeed   float32 `json:"chargeMaxSpeed"`
   ChargeMinReach   float32 `json:"chargeMinReach"`
   ChargeMaxReach   float32 `json:"chargeMaxReach"`
   ```
2. `config.go` — set defaults in `DefaultConfig()`:
   ```go
   ChargeMinTime:    0.2,
   ChargeMaxTime:    2.0,
   ChargeMinDamage:  20,
   ChargeMaxDamage:  40,
   ChargeMinSpeed:   13.5,
   ChargeMaxSpeed:   20.0,
   ChargeMinReach:   13.0,
   ChargeMaxReach:   18.0,
   ```
3. `types.go` — add fields to `Player` struct:
   ```go
   IsCharging      bool
   ChargeStartTick int
   ChargeLevel     float32 // 0.0–1.0
   ```

**Test:** `go build ./cmd/server/` compiles without errors.

---

### Chunk 2: Server Charge Logic + Events

**Goal:** Implement charge toggle/cancel in tick loop, emit events

**Files:**
- `server/internal/room/types.go`
- `server/internal/room/game_session.go`

**Changes:**
1. `types.go` — add methods to `Player`:
   ```go
   func (p *Player) StartCharge(tick int) {
       p.IsCharging = true
       p.ChargeStartTick = tick
       p.ChargeLevel = 0
   }

   func (p *Player) ReleaseCharge(tick int, cfg *config.Config) (damage, speed, maxReach float32) {
       chargeTime := float32(tick-p.ChargeStartTick) * cfg.TickInterval
       if chargeTime < cfg.ChargeMinTime {
           chargeTime = cfg.ChargeMinTime
       }
       if chargeTime > cfg.ChargeMaxTime {
           chargeTime = cfg.ChargeMaxTime
       }
       t := (chargeTime - cfg.ChargeMinTime) / (cfg.ChargeMaxTime - cfg.ChargeMinTime)
       damage = cfg.ChargeMinDamage + t*(cfg.ChargeMaxDamage-cfg.ChargeMinDamage)
       speed = cfg.ChargeMinSpeed + t*(cfg.ChargeMaxSpeed-cfg.ChargeMinSpeed)
       maxReach = cfg.ChargeMinReach + t*(cfg.ChargeMaxReach-cfg.ChargeMinReach)
       p.IsCharging = false
       p.ChargeLevel = 0
       return
   }

   func (p *Player) CancelCharge() {
       p.IsCharging = false
       p.ChargeLevel = 0
   }
   ```
2. `types.go` — update `ProcessInputs()`:
   ```go
   // Fire toggle (0x01)
   if last.Flags&0x01 != 0 && !p.IsDashing && p.Cooldown <= 0 && p.Health > 0 {
       if !p.IsCharging {
           p.StartCharge(tick)
       } else {
           p.JustFired = true
       }
   }

   // Cancel charge (0x10)
   if last.Flags&0x10 != 0 && p.IsCharging {
       p.CancelCharge()
   }

   // Cancel charge if dashing/shielding/slashing
   if (last.Flags&0x02 != 0 || last.Flags&0x04 != 0 || last.Flags&0x08 != 0) && p.IsCharging {
       p.CancelCharge()
   }
   ```
3. `game_session.go` — update `TickStep()`:
   ```go
   // Compute charge levels
   for i := range s.Players {
       p := &s.Players[i]
       if p.Health <= 0 {
           if p.IsCharging {
               p.CancelCharge()
           }
           continue
       }
       if p.IsCharging {
           elapsed := float32(tick-p.ChargeStartTick) * cfg.TickInterval
           p.ChargeLevel = clampFloat(elapsed/cfg.ChargeMaxTime, 0, 1)

           // Emit EventChargeMax when reaching 100%
           if p.ChargeLevel >= 1.0 && !p.ChargeMaxReached {
               s.pendingEvents = append(s.pendingEvents, GameEvent{
                   Type:    EventChargeMax,
                   Payload: EncodeChargePayload(uint8(p.ID), p.X, p.Z, p.Angle),
               })
               p.ChargeMaxReached = true
           }
       } else {
           p.ChargeMaxReached = false
       }
   }

   // Handle release (existing firedPlayers loop)
   // Replace projectile creation with:
   if p.JustFired && p.IsCharging {
       damage, speed, maxReach := p.ReleaseCharge(tick, cfg)
       // Emit EventChargeStart (for release flash? No — only on start)
       // Create projectile with damage, speed, maxReach
       proj := Projectile{
           // ... existing fields ...
           Speed:    speed,
           MaxReach: maxReach,
           Damage:   damage,
       }
       s.Projectiles = append(s.Projectiles, proj)
       p.Cooldown = cfg.Cooldown
       // Mirror cooldown, heal, etc. (existing)
   }
   ```
4. `game_session.go` — emit `EventChargeStart` when charging starts:
   ```go
   // In ProcessInputs or TickStep, after StartCharge:
   s.pendingEvents = append(s.pendingEvents, GameEvent{
       Type:    EventChargeStart,
       Payload: EncodeChargePayload(uint8(p.ID), p.X, p.Z, p.Angle),
   })
   ```
5. `types.go` — add `ChargeMaxReached bool` to Player struct (to emit EventChargeMax only once)

**Test:** Run server, connect two test clients, verify server logs show:
```
[charge] Player 1 started charging
[charge] Player 1 charge max reached
[charge] Player 1 released (level: 0.75, dmg: 35, speed: 18.25, reach: 16.5)
```

---

### Chunk 3: Protocol Encoding (Wire Format)

**Goal:** Encode charge state and new events in snapshots

**Files:**
- `server/internal/network/protocol.go`

**Changes:**
1. Add event type constants:
   ```go
   const (
       EventChargeStart = 3
       EventChargeMax   = 4
   )
   ```
2. Add encode function for charge events:
   ```go
   func EncodeChargePayload(playerID uint8, x, z, angle float32) []byte {
       buf := make([]byte, 13)
       buf[0] = playerID
       binary.LittleEndian.PutUint32(buf[1:5], math.Float32bits(x))
       binary.LittleEndian.PutUint32(buf[5:9], math.Float32bits(z))
       binary.LittleEndian.PutUint32(buf[9:13], math.Float32bits(angle))
       return buf
   }
   ```
3. Update `EncodePlayer()` to include `isCharging` and `chargeLevel`:
   ```go
   func EncodePlayer(p *room.Player) []byte {
       buf := make([]byte, 42) // was 37
       // ... existing 37 bytes ...
       off := 37
       if p.IsCharging {
           buf[off] = 1
       } else {
           buf[off] = 0
       }
       off++
       binary.LittleEndian.PutUint32(buf[off:off+4], math.Float32bits(p.ChargeLevel))
       return buf
   }
   ```
4. Update `DecodePlayer()` in test/protocol code to handle 42 bytes (if any)

**Test:** Run server, capture raw snapshot bytes, verify:
- Player data is 42 bytes (was 37)
- isCharging byte is 0 or 1
- chargeLevel is valid float32 between 0.0 and 1.0

---

### Chunk 4: Client Input Changes

**Goal:** Client sends 0x01 toggle + 0x10 cancel

**Files:**
- `client/src/input.js`
- `client/src/game.js`

**Changes:**
1. `input.js` — add X key and one-shot flags:
   ```js
   // In keydown handler:
   if (e.key.toLowerCase() === 'x') this.cancelCharge = true;

   // In keyup handler:
   // (no change needed for x)

   // Add to constructor:
   this.firePressed = false;
   this.cancelCharge = false;
   ```
2. `input.js` — change R to one-shot:
   ```js
   // In keydown handler:
   if (e.key.toLowerCase() === 'r') {
       this.fire = true;
       this.firePressed = true;
   }

   // In keyup handler:
   if (e.key.toLowerCase() === 'r') this.fire = false;
   ```
3. `game.js` — update flag assembly:
   ```js
   let flags = 0;
   if (!dead) {
       if (this.input.firePressed) flags |= 0x01;
       if (this.input.dash) flags |= 0x02;
       if (this.input.shield) flags |= 0x04;
       if (this.input.inputSlash) flags |= 0x08;
       if (this.input.cancelCharge) flags |= 0x10;
   }
   // Clear one-shot flags after use
   this.input.firePressed = false;
   this.input.cancelCharge = false;
   ```

**Test:** Run client + server:
- Press R → server logs "started charging"
- Press R again → server logs "released"
- Press X while charging → server logs "cancelled"
- Verify no double-fires from held R key

---

### Chunk 5: Client Decoding + Charge State

**Goal:** Client decodes charge state from snapshot and new events

**Files:**
- `client/src/network/protocol.js`

**Changes:**
1. Add event type constants:
   ```js
   export const EVENT_CHARGE_START = 3;
   export const EVENT_CHARGE_MAX = 4;
   ```
2. Update `decodeStateSnapshot()` — player decoding:
   ```js
   // After existing 37 bytes, read new fields:
   const isCharging = data[off] === 1;
   off++;
   const chargeLevel = dv.getFloat32(off, true);
   off += 4;

   players.push({
       // ... existing fields ...
       isCharging,
       chargeLevel
   });
   ```
3. Update `decodeStateSnapshot()` — event decoding:
   ```js
   } else if (eventType === EVENT_CHARGE_START || eventType === EVENT_CHARGE_MAX) {
       const playerId = data[off]; off += 1;
       const x = dv.getFloat32(off, true); off += 4;
       const z = dv.getFloat32(off, true); off += 4;
       const angle = dv.getFloat32(off, true); off += 4;
       events.push({ type: eventType, playerId, x, z, angle });
   }
   ```

**Test:** Run client + server, open browser console, verify:
- `snapshot.players` shows `isCharging: true` and `chargeLevel: 0.X` while charging
- Events array contains `type: 3` on charge start, `type: 4` on max charge

---

### Chunk 6: Client Charge VFX

**Goal:** Show pulsing glow indicators for both players

**Files:**
- `client/src/physics/players.js`
- `client/src/physics/effects.js`

**Changes:**
1. `players.js` — update `applyPlayersLogic()` to handle charge glow:
   ```js
   // After setting player position, check charging state
   if (player.isCharging) {
       const t = performance.now() / 1000;
       const level = player.chargeLevel;
       const pulseRate = 2 + level * 4; // 2–6 Hz
       const pulse = Math.sin(t * pulseRate * Math.PI * 2) * 0.5 + 0.5;
       const intensity = 1.0 + level * 7.0 * pulse;
       entity.material.emissive.set(
           entity.material.emissive.r * intensity,
           entity.material.emissive.g * intensity,
           entity.material.emissive.b * intensity
       );
       entity.material.emissiveIntensity = intensity;
       const s = 1.0 + level * 0.08;
       entity.setLocalScale(s, s, s);
   } else {
       // Reset to normal (existing logic handles this)
       entity.material.emissiveIntensity = 1.0;
       entity.setLocalScale(1, 1, 1);
   }
   ```
2. `effects.js` — add charge flash effects:
   ```js
   export function spawnChargeStartFlash(physics, playerId, x, z) {
       // Brief emissive flash (100ms)
       const entity = physics._playerEntities?.get(playerId);
       if (!entity) return;
       entity.material.emissiveIntensity = 5.0;
       setTimeout(() => {
           entity.material.emissiveIntensity = 1.0;
       }, 100);
   }

   export function spawnChargeMaxFlash(physics, playerId, x, z) {
       // Bright pulse flash (200ms)
       const entity = physics._playerEntities?.get(playerId);
       if (!entity) return;
       entity.material.emissiveIntensity = 10.0;
       setTimeout(() => {
           entity.material.emissiveIntensity = 1.0;
       }, 200);
   }
   ```
3. `game.js` — handle charge events:
   ```js
   if (evt.type === 3) { // EVENT_CHARGE_START
       this.physics.spawnChargeStartFlash(evt.playerId, evt.x, evt.z);
   } else if (evt.type === 4) { // EVENT_CHARGE_MAX
       this.physics.spawnChargeMaxFlash(evt.playerId, evt.x, evt.z);
   }
   ```

**Test:** Two browser windows, one charges → both see pulsing glow, max charge triggers bright flash.

---

### Chunk 7: Edge Cases + Polish

**Goal:** Handle cancel, death, dash/shield/slash during charge

**Files:**
- `server/internal/room/types.go`
- `server/internal/room/game_session.go`

**Changes:**
1. `types.go` — cancel charge on dash/shield/slash (already in Chunk 2):
   ```go
   if (last.Flags&0x02 != 0 || last.Flags&0x04 != 0 || last.Flags&0x08 != 0) && p.IsCharging {
       p.CancelCharge()
   }
   ```
2. `types.go` — cancel charge on death (already in Chunk 2):
   ```go
   if p.Health <= 0 && p.IsCharging {
       p.CancelCharge()
   }
   ```
3. `game_session.go` — clear charge on disconnect/room reset:
   ```go
   // In Reset():
   for i := range s.Players {
       s.Players[i].IsCharging = false
       s.Players[i].ChargeLevel = 0
       s.Players[i].ChargeMaxReached = false
   }
   ```
4. `game_session.go` — clear charge on player disconnect:
   ```go
   // In RemovePlayer():
   if p.IsCharging {
       p.CancelCharge()
   }
   ```

**Test:** Verify:
- Dash during charge → charge cancelled, dash executes
- Shield during charge → charge cancelled, shield activates
- Slash during charge → charge cancelled, slash executes
- Death during charge → charge cleared, no orphaned state
- Disconnect during charge → room resets cleanly
- No double-fires or phantom projectiles

---

## Dependency Graph

```
Chunk 1 → Chunk 2 → Chunk 3 → Chunk 4 → Chunk 5 → Chunk 6 → Chunk 7
```

Each chunk builds on the previous but can be tested independently after implementation.

---

## Estimated Scope

| Chunk | Lines | Complexity |
|-------|-------|------------|
| 1 | ~30 | Low |
| 2 | ~70 | Medium |
| 3 | ~35 | Low |
| 4 | ~30 | Low |
| 5 | ~40 | Low |
| 6 | ~80 | Medium |
| 7 | ~30 | Low |
| **Total** | **~315** | |
