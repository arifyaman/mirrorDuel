// Message types (must match server)
export const MSG_JOIN_ROOM = 1;
export const MSG_PLAYER_INPUT = 2;
export const MSG_PING = 3;
export const MSG_STATE_SNAPSHOT = 16;
export const MSG_ROOM_CREATED = 17;
export const MSG_PONG = 18;
export const MSG_SELECT_PERK = 19;
export const MSG_DISCONNECT = 255;

// Game event sub-types embedded in STATE_SNAPSHOT
export const EVENT_SLASH = 1;
export const EVENT_PERFECT_BLOCK = 2;
export const EVENT_SHIELD_BLOCK = 3;
export const EVENT_EXPLOSION = 4;
export const EVENT_TURRET_FIRE = 5;
export const EVENT_PLAYER_PERKS = 6;
export const EVENT_WAVE_UPDATE = 10;
export const EVENT_SQUAD_WIPED = 11;

export const INPUT_SIZE = 13;

export function encodeSelectPerk(perkId) {
  const buf = new Uint8Array(2);
  buf[0] = MSG_SELECT_PERK;
  buf[1] = perkId;
  return buf;
}

export function encodeJoinRoom(name) {
  const raw = new TextEncoder().encode(name);
  const buf = new Uint8Array(1 + raw.length);
  buf[0] = raw.length;
  buf.set(raw, 1);
  return buf;
}

// PING payload is the client's own local timestamp (performance.now()),
// echoed back by the server as part of PONG. RTT is measured purely with
// the client's own clock, so no client/server clock sync is needed.
// A second field carries the client's own last-measured RTT (ms), which the
// server stores and later reports back to the *opponent* in their PONG;
// -1 if not yet known.
export function encodePing(timestamp, lastPing = -1) {
  const buf = new Uint8Array(12);
  const dv = new DataView(buf.buffer);
  dv.setFloat64(0, timestamp, true);
  dv.setFloat32(8, lastPing, true);
  return buf;
}

// PONG payload: [timestamp: f64][opponentPingMs: f32 (optional)] — timestamp
// is our own echoed PING send time (for our RTT calc); opponentPingMs (if
// present) is our opponent's last self-reported RTT, piggybacked on this
// same round trip instead of a separate message. -1 = opponent ping unknown.
export function decodePong(data) {
  if (data.length < 8) return null;
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const sentAt = dv.getFloat64(0, true);
  const opponentPing = data.length >= 12 ? dv.getFloat32(8, true) : null;
  return { sentAt, opponentPing };
}

export function encodePlayerInput(tick, moveX, moveZ, mouseX, mouseY, flags) {
  const buf = new Uint8Array(INPUT_SIZE);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  dv.setUint16(0, tick, true);
  dv.setInt8(2, moveX);
  dv.setInt8(3, moveZ);
  dv.setFloat32(4, mouseX, true);
  dv.setFloat32(8, mouseY, true);
  dv.setUint8(12, flags);
  return buf;
}

export function decodeStateSnapshot(data) {
  if (data.length < 4) return null;
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let off = 0;
  const tick = dv.getUint16(off, true); off += 2;
  const playerCount = dv.getUint8(off); off += 1;

const players = [];
    for (let i = 0; i < playerCount; i++) {
      const id = dv.getUint8(off); off += 1;
      const x = dv.getFloat32(off, true); off += 4;
      const y = dv.getFloat32(off, true); off += 4;
      const z = dv.getFloat32(off, true); off += 4;
      const angle = dv.getFloat32(off, true); off += 4;
      const cooldown = dv.getFloat32(off, true); off += 4;
      const health = dv.getFloat32(off, true); off += 4;
      const dashCooldown = dv.getFloat32(off, true); off += 4;
      const shieldCooldown = dv.getFloat32(off, true); off += 4;
      const slashCooldown = dv.getFloat32(off, true); off += 4;
      players.push({ id, x, y, z, angle, cooldown, health, dashCooldown, shieldCooldown, slashCooldown });
    }

  const projCount = dv.getUint8(off); off += 1;
  const projectiles = [];
  for (let i = 0; i < projCount; i++) {
    const id = dv.getUint8(off); off += 1;
    const spawnTick = dv.getUint16(off, true); off += 2;
    const startX = dv.getFloat32(off, true); off += 4;
    const y = dv.getFloat32(off, true); off += 4;
    const startZ = dv.getFloat32(off, true); off += 4;
    const dirX = dv.getFloat32(off, true); off += 4;
    const dirZ = dv.getFloat32(off, true); off += 4;
    const speed = dv.getFloat32(off, true); off += 4;
    const maxReach = dv.getFloat32(off, true); off += 4;
    const ownerId = dv.getUint8(off); off += 1;
    projectiles.push({ id, spawnTick, startX, y, startZ, dirX, dirZ, speed, maxReach, ownerId });
  }

  // Parse events section
  const events = [];
  if (off < data.length) {
    const eventCount = dv.getUint8(off); off += 1;
    for (let i = 0; i < eventCount; i++) {
      const eventType = dv.getUint8(off); off += 1;
      if (eventType === EVENT_SLASH) {
        const playerId = dv.getUint8(off); off += 1;
        const x = dv.getFloat32(off, true); off += 4;
        const z = dv.getFloat32(off, true); off += 4;
        const angle = dv.getFloat32(off, true); off += 4;
        events.push({ type: eventType, playerId, x, z, angle });
      } else if (eventType === EVENT_PERFECT_BLOCK) {
        const playerId = dv.getUint8(off); off += 1;
        const x = dv.getFloat32(off, true); off += 4;
        const z = dv.getFloat32(off, true); off += 4;
        const angle = dv.getFloat32(off, true); off += 4;
        events.push({ type: eventType, playerId, x, z, angle });
      } else if (eventType === EVENT_SHIELD_BLOCK) {
        const playerId = dv.getUint8(off); off += 1;
        const x = dv.getFloat32(off, true); off += 4;
        const z = dv.getFloat32(off, true); off += 4;
        const angle = dv.getFloat32(off, true); off += 4;
        events.push({ type: eventType, playerId, x, z, angle });
      } else if (eventType === EVENT_EXPLOSION) {
        const x = dv.getFloat32(off, true); off += 4;
        const z = dv.getFloat32(off, true); off += 4;
        events.push({ type: eventType, x, z });
      } else if (eventType === EVENT_TURRET_FIRE) {
        const tx = dv.getFloat32(off, true); off += 4;
        const tz = dv.getFloat32(off, true); off += 4;
        const angle = dv.getFloat32(off, true); off += 4;
        const zx = dv.getFloat32(off, true); off += 4;
        const zz = dv.getFloat32(off, true); off += 4;
        events.push({ type: eventType, tx, tz, angle, zx, zz });
      } else if (eventType === EVENT_PLAYER_PERKS) {
        const playerId = dv.getUint8(off); off += 1;
        const perkMask = dv.getUint8(off); off += 1;
        events.push({ type: eventType, playerId, perkMask });
      } else if (eventType === 10) { // EVENT_WAVE_UPDATE
        const wave = dv.getUint8(off); off += 1;
        const state = dv.getUint8(off); off += 1;
        const timeLeft = dv.getUint16(off, true) / 10.0; off += 2;
        const aliveZombies = dv.getUint8(off); off += 1;
        const totalKills = dv.getUint16(off, true); off += 2;
        events.push({ type: eventType, wave, state, timeLeft, aliveZombies, totalKills });
      } else if (eventType === 11) { // EVENT_SQUAD_WIPED
        const wave = dv.getUint8(off); off += 1;
        events.push({ type: eventType, wave });
      }
    }
  }

  return { tick, players, projectiles, events };
}

export function decodeRoomCreated(data) {
  if (data.length < 4) return null;
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const roomId = dv.getUint16(0, true);
  const myPlayerId = dv.getUint8(2);
  const nameLen = dv.getUint8(3);
  let off = 4;
  const opponentName = new TextDecoder().decode(data.slice(off, off + nameLen));
  off += nameLen;

  // Obstacle grid, appended after the name (may be absent on older servers).
  let obstacleGrid = null;
  let gridWidth = 0;
  let gridHeight = 0;
  if (off + 2 <= data.length) {
    gridWidth = dv.getUint8(off); off += 1;
    gridHeight = dv.getUint8(off); off += 1;
    const bitmaskLen = Math.ceil((gridWidth * gridHeight) / 8);
    if (off + bitmaskLen <= data.length) {
      const bitmask = data.slice(off, off + bitmaskLen);
      obstacleGrid = new Array(gridWidth * gridHeight);
      for (let i = 0; i < obstacleGrid.length; i++) {
        obstacleGrid[i] = (bitmask[i >> 3] & (1 << (i & 7))) !== 0;
      }
      off += bitmaskLen;
    }
  }

  return { roomId, myPlayerId, opponentName, gridWidth, gridHeight, obstacleGrid };
}
