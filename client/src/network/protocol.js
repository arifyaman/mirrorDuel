// Message types (must match server)
export const MSG_JOIN_ROOM = 1;
export const MSG_PLAYER_INPUT = 2;
export const MSG_STATE_SNAPSHOT = 16;
export const MSG_ROOM_CREATED = 17;
export const MSG_DISCONNECT = 255;

// Game event sub-types embedded in STATE_SNAPSHOT
export const EVENT_SLASH = 1;
export const EVENT_PERFECT_BLOCK = 2;
export const EVENT_SHIELD_BLOCK = 3;

export const INPUT_SIZE = 13;

export function encodeJoinRoom(name) {
  const raw = new TextEncoder().encode(name);
  const buf = new Uint8Array(1 + raw.length);
  buf[0] = raw.length;
  buf.set(raw, 1);
  return buf;
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
      }
    }
  }

  return { tick, players, projectiles, events };
}

export function decodeRoomCreated(data) {
  if (data.length < 3) return null;
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const roomId = dv.getUint16(0, true);
  const myPlayerId = dv.getUint8(2);
  const nameLen = dv.getUint8(3);
  const opponentName = new TextDecoder().decode(data.slice(4, 4 + nameLen));
  return { roomId, myPlayerId, opponentName };
}
