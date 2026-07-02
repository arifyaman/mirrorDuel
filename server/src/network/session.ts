import { RoomManager } from '../room/roomManager.js';
import { encodeRoomCreated, encodeStateSnapshot, MSG_STATE_SNAPSHOT, MSG_ROOM_CREATED, MSG_DISCONNECT } from './protocol.js';

export class Session {
  public id: string;
  private _connected = true;
  public player: any = null;
  private pendingName: string | null = null;

  constructor(
    id: string,
    private readonly sendRaw: (data: Uint8Array) => void,
  ) {
    this.id = id;
  }

  get connected(): boolean { return this._connected; }

  sendMsg(type: number, data: Uint8Array) {
    if (!this._connected) return;
    const full = new Uint8Array(data.length + 1);
    full[0] = type;
    full.set(data, 1);
    this.sendRaw(full);
  }

  setPendingName(name: string) {
    this.pendingName = name;
  }

  consumePendingName(): string | null {
    const name = this.pendingName;
    this.pendingName = null;
    return name;
  }

  handleMessage(type: number, payload: Uint8Array, roomManager: RoomManager) {
    roomManager.handleMessage(this, type, payload);
  }

  sendSnapshot(snapshot: any) {
    const data = encodeStateSnapshot(
      snapshot.tick,
      snapshot.players,
      snapshot.projectiles,
    );
    this.sendMsg(MSG_STATE_SNAPSHOT, data);
  }

  sendRoomCreated(result: { roomId: number; myPlayerId: number; opponentName: string }) {
    const data = encodeRoomCreated(result.roomId, result.myPlayerId, result.opponentName);
    this.sendMsg(MSG_ROOM_CREATED, data);
  }

  sendDisconnect() {
    this.sendMsg(MSG_DISCONNECT, new Uint8Array(0));
    this._connected = false;
  }
}
