// Message type IDs
export const MSG_JOIN_ROOM = 1;
export const MSG_PLAYER_INPUT = 2;
export const MSG_STATE_SNAPSHOT = 16;
export const MSG_ROOM_CREATED = 17;
export const MSG_DISCONNECT = 255;

export const TICK_MS = 16.67;

export interface PlayerInput {
  tick: number;
  moveX: number;
  moveZ: number;
  mouseX: number;
  mouseY: number;
  flags: number;
}

export interface PlayerState {
  id: number;
  name: string;
  x: number;
  y: number;
  z: number;
  angle: number;
  cooldown: number;
}

export interface ProjectileState {
  id: number;
  x: number;
  y: number;
  z: number;
  traveled: number;
  dirX: number;
  dirZ: number;
}

export interface StateSnapshot {
  tick: number;
  players: PlayerState[];
  projectiles: ProjectileState[];
}

export interface RoomCreated {
  roomId: number;
  myPlayerId: number;
  opponentName: string;
}
