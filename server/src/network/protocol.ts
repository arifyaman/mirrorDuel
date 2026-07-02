// Protocol constants
export const MSG_JOIN_ROOM = 1;
export const MSG_PLAYER_INPUT = 2;
export const MSG_STATE_SNAPSHOT = 16;
export const MSG_ROOM_CREATED = 17;
export const MSG_DISCONNECT = 255;

export const INPUT_SIZE = 13;

// ---- ENCODING ----

export function encodeJoinRoom(name: string): Uint8Array {
  const raw = new TextEncoder().encode(name);
  const buf = new Uint8Array(1 + raw.length);
  buf[0] = raw.length;
  buf.set(raw, 1);
  return buf;
}

export function encodePlayerInput(tick: number, moveX: number, moveZ: number, mouseX: number, mouseY: number, flags: number): Uint8Array {
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

export function encodeStateSnapshot(tick: number, players: any[], projectiles: any[]): Uint8Array {
  console.log('[Server] Encoding snapshot tick', tick, 'with', players.length, 'players');
  for (const p of players) console.log('[Server]   Player', p.id, ':', { x: p.x, y: p.y, z: p.z, angle: p.angle });
  const playerCount = players.length;
  const projCount = projectiles.length;
  const SNAPSHOT_PLAYER_SIZE = 21;
  const SNAPSHOT_PROJECTILE_SIZE = 31;
  const size = 2 + 1 + playerCount * SNAPSHOT_PLAYER_SIZE + 1 + projCount * SNAPSHOT_PROJECTILE_SIZE;
  const buf = new Uint8Array(size);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  let off = 0;
  dv.setUint16(off, tick, true); off += 2;
  dv.setUint8(off, playerCount); off += 1;

  for (const p of players) {
    dv.setUint8(off, p.id); off += 1;
    dv.setFloat32(off, p.x, true); off += 4;
    dv.setFloat32(off, p.y, true); off += 4;
    dv.setFloat32(off, p.z, true); off += 4;
    dv.setFloat32(off, p.angle, true); off += 4;
    dv.setFloat32(off, p.cooldown, true); off += 4;
  }

  dv.setUint8(off, projCount); off += 1;

  for (const p of projectiles) {
    dv.setUint8(off, p.id); off += 1;
    dv.setUint16(off, p.spawnTick, true); off += 2;
    dv.setFloat32(off, p.startX, true); off += 4;
    dv.setFloat32(off, p.y, true); off += 4;
    dv.setFloat32(off, p.startZ, true); off += 4;
    dv.setFloat32(off, p.dirX, true); off += 4;
    dv.setFloat32(off, p.dirZ, true); off += 4;
    dv.setFloat32(off, p.speed, true); off += 4;
    dv.setFloat32(off, p.maxReach, true); off += 4;
  }

  return buf;
}

export function encodeRoomCreated(roomId: number, myPlayerId: number, opponentName: string): Uint8Array {
  const raw = new TextEncoder().encode(opponentName);
  const size = 4 + raw.length; // 2 (roomId) + 1 (myPlayerId) + 1 (nameLen) + name
  const buf = new Uint8Array(size);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  dv.setUint16(0, roomId, true);
  dv.setUint8(2, myPlayerId);
  dv.setUint8(3, raw.length);
  if (raw.length > 0) buf.set(raw, 4);
  return buf;
}

// ---- DECODING ----

export function decodePlayerInput(data: Uint8Array): { tick: number; moveX: number; moveZ: number; mouseX: number; mouseY: number; flags: number } | null {
  if (data.length < INPUT_SIZE) return null;
  const dv = new DataView(data.buffer, data.byteOffset, Math.max(data.byteLength, INPUT_SIZE));
  return {
    tick: dv.getUint16(0, true),
    moveX: dv.getInt8(2),
    moveZ: dv.getInt8(3),
    mouseX: dv.getFloat32(4, true),
    mouseY: dv.getFloat32(8, true),
    flags: dv.getUint8(12),
  };
}

export function decodeJoinRoom(data: Uint8Array): string {
  if (data.length < 1) return '';
  const nameLen = data[0];
  return new TextDecoder().decode(data.slice(1, 1 + nameLen));
}

export function parseMessage(data: Uint8Array): { type: number; payload: Uint8Array } | null {
  if (data.length < 2) return null;
  return { type: data[0], payload: data.slice(1) };
}
