import { encodeJoinRoom, encodePlayerInput, MSG_JOIN_ROOM, MSG_PLAYER_INPUT, MSG_STATE_SNAPSHOT, MSG_ROOM_CREATED, MSG_DISCONNECT, decodeStateSnapshot, decodeRoomCreated } from './protocol.js';

export class NetworkClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.state = 'disconnected';
    this.tick = 0;
    this.snapHandler = null;
    this.joinHandler = null;
    this.disconnectHandler = null;
    this.statusHandler = null;
    this.reconnectTimer = null;
    this.inputQueue = [];
    this.sendTimer = 0;
  }

  setStatus(state) {
    this.state = state;
    if (this.statusHandler) this.statusHandler(state);
  }

  onSnap(cb) { this.snapHandler = cb; }
  onJoin(cb) { this.joinHandler = cb; }
  onDisconnect(cb) { this.disconnectHandler = cb; }
  onStatus(cb) { this.statusHandler = cb; }

  connect() {
    if (this.state === 'connected') return;
    this.setStatus('connecting');
    this.ws = new WebSocket(this.serverUrl);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      console.log('[Network] Connected');
      this.setStatus('connected');
      this.sendJoin();
    };

    this.ws.onmessage = (ev) => {
      const data = new Uint8Array(ev.data);
      const type = data[0];
      const payload = data.slice(1);
      console.log('[Network] onmessage: type=', type, 'payloadLen=', payload.length);

      switch (type) {
        case MSG_STATE_SNAPSHOT:
          this.handleSnapshot(payload);
          break;
        case MSG_ROOM_CREATED:
          this.handleRoomCreated(payload);
          break;
        case MSG_DISCONNECT:
          this.setStatus('disconnected');
          if (this.disconnectHandler) this.disconnectHandler('Server disconnected');
          break;
      }
    };

    this.ws.onclose = () => {
      console.log('[Network] Disconnected');
      if (this.state === 'connected') {
        this.setStatus('reconnecting');
        this.reconnect();
      } else {
        this.setStatus('disconnected');
      }
    };

    this.ws.onerror = (err) => {
      console.error('[Network] Error:', err);
      this.setStatus('disconnected');
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.setStatus('disconnected');
  }

  reconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      console.log('[Network] Reconnecting...');
      this.connect();
    }, 2000);
  }

  sendJoin() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const name = 'Player' + Math.floor(Math.random() * 1000);
    const data = encodeJoinRoom(name);
    const msg = new Uint8Array(1 + data.length);
    msg[0] = MSG_JOIN_ROOM;
    msg.set(data, 1);
    this.ws.send(msg);
  }

  handleSnapshot(payload) {
    console.log('[Network] Received snapshot, payload length:', payload.length);
    const snapshot = decodeStateSnapshot(payload);
    console.log('[Network] Decoded snapshot:', snapshot);
    if (snapshot && this.snapHandler) {
      this.snapHandler(snapshot.tick, snapshot.players, snapshot.projectiles);
    }
  }

  handleRoomCreated(payload) {
    const result = decodeRoomCreated(payload);
    if (result && this.joinHandler) {
      this.joinHandler(result.roomId, result.myPlayerId, result.opponentName);
    }
  }

  update(dt, moveX, moveZ, mouseX, mouseY, flags) {
    if (this.state !== 'connected' || !this.ws) return;
    this.tick++;
    this.inputQueue.push({ moveX, moveZ, mouseX, mouseY, flags });
    this.sendTimer += dt;
    if (this.sendTimer >= 0.016) {
      this.sendTimer = 0;
      this.flushInputs();
    }
  }

  flushInputs() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (this.inputQueue.length === 0) return;
    const latest = this.inputQueue[this.inputQueue.length - 1];
    this.inputQueue = [];
    const data = encodePlayerInput(this.tick, latest.moveX, latest.moveZ, latest.mouseX, latest.mouseY, latest.flags);
    const msg = new Uint8Array(1 + data.length);
    msg[0] = MSG_PLAYER_INPUT;
    msg.set(data, 1);
    this.ws.send(msg);
  }
}
