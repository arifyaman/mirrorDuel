import { Session } from '../network/session.js';
import { GameSession } from './gameRoom.js';
import { GameConfig } from '../config/index.js';
import { decodePlayerInput, decodeJoinRoom, encodeStateSnapshot, encodeRoomCreated, MSG_STATE_SNAPSHOT, MSG_ROOM_CREATED, MSG_PLAYER_INPUT, MSG_JOIN_ROOM } from '../network/protocol.js';

interface RoomCallbacks {
  onSessionCreated(session: Session): void;
  onSessionDisconnect(session: Session): void;
}

export class RoomManager {
  private rooms: GameSession[] = [];
  private nextRoomId = 1;
  private tickAccumulator = 0;
  private callbacks: RoomCallbacks;
  private readonly config: GameConfig;

  constructor(config: GameConfig, callbacks: RoomCallbacks) {
    this.config = config;
    this.callbacks = callbacks;
  }

  handleMessage(session: Session, type: number, payload: Uint8Array) {
    switch (type) {
      case MSG_JOIN_ROOM:
        this.handleJoinRoom(session, payload);
        break;
      case MSG_PLAYER_INPUT:
        this.handlePlayerInput(session, payload);
        break;
    }
  }

  private handleJoinRoom(session: Session, payload: Uint8Array) {
    const name = decodeJoinRoom(payload);
    const result = this.join(session, name);
    if (result) {
      session.sendRoomCreated(result);
      // Also send current snapshot
      for (const room of this.rooms) {
        if (room.players.has(session.player!.id)) {
          const snap = room.getSnapshot();
          for (const [, rSession] of room.sessions) {
            (rSession as Session).sendSnapshot(snap);
          }
        }
      }
    }
  }

  private handlePlayerInput(session: Session, payload: Uint8Array) {
    const input = decodePlayerInput(payload);
    if (!input) return;

    const player = session.player;
    if (!player) return;

    player.queueInput(input);

    // Skill activation
    if ((input.flags & 0x01) !== 0) {
      for (const room of this.rooms) {
        if (room.players.has(player.id)) {
          room.activateProjectile(player, input.mouseX, input.mouseY);
          break;
        }
      }
    }
  }

  join(session: Session, playerName: string) {
    let room: GameSession | null = null;
    for (const r of this.rooms) {
      if (r.players.size < 2) {
        room = r;
        break;
      }
    }

    if (!room) {
      room = new GameSession(this.nextRoomId++, this.config);
      this.rooms.push(room);
    }

    const playerId = room.players.size + 1;
    const player = room.addPlayer(playerId, playerName);
    session.player = player;
    room.sessions.set(playerId, session);

    const opponent = room.players.get(playerId === 1 ? 2 : 1);

    return {
      roomId: room.roomId,
      myPlayerId: playerId,
      opponentName: opponent?.name || '',
    };
  }

  update(dt: number) {
    this.tickAccumulator += dt * 1000;
    while (this.tickAccumulator >= 16.67) {
      this.tickAccumulator -= 16.67;
      this.tickStep();
    }
  }

  private tickStep() {
    for (const room of this.rooms) {
      room.tickStep();
    }
    this.broadcast();
  }

  private broadcast() {
    for (const room of this.rooms) {
      if (room.players.size === 0) continue;
      const snap = room.getSnapshot();
      for (const [, rSession] of room.sessions) {
        (rSession as Session).sendSnapshot(snap);
      }
    }
  }

  handleDisconnect(session: Session) {
    const player = session.player;
    if (!player) return;

    for (let i = this.rooms.length - 1; i >= 0; i--) {
      const room = this.rooms[i];
      if (room.players.has(player.id)) {
        room.players.delete(player.id);
        room.sessions.delete(player.id);

        for (const [pid, rSession] of room.sessions) {
          (rSession as Session).sendDisconnect();
        }

        if (room.players.size === 0) {
          this.rooms.splice(i, 1);
        }

        this.callbacks.onSessionDisconnect(session);
        break;
      }
    }
  }

  cleanup() {
    this.rooms = [];
  }
}
