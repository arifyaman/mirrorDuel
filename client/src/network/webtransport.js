import { encodeJoinRoom, encodePlayerInput, MSG_JOIN_ROOM, MSG_PLAYER_INPUT, MSG_STATE_SNAPSHOT, MSG_ROOM_CREATED, MSG_DISCONNECT, decodeStateSnapshot, decodeRoomCreated } from './protocol.js';

export class NetworkClient {
  constructor(serverUrl = 'localhost:4433') {
    this.serverUrl = serverUrl;
    this.wt = null;
    this.stream = null;
    this.writer = null;
    this.reader = null;
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

  async connect(nickname = null) {
    if (this.state === 'connected') return;
    this.setStatus('connecting');

    const host = this.serverUrl.includes(':') ? this.serverUrl : `${this.serverUrl}:4433`;

    try {
      this.wt = new WebTransport(`https://${host}/wt`);
      await this.wt.ready;

      this.stream = await this.wt.createBidirectionalStream();
      this.reader = this.stream.readable.getReader();
      this.writer = this.stream.writable.getWriter();

      this.readLoop();
      const name = nickname || 'Player' + Math.floor(Math.random() * 1000);
      await this.sendJoin(name);
      this.setStatus('connected');
    } catch (err) {
      console.error('[WT] Connection error:', err.message);
      if (this.state === 'connected') {
        this.setStatus('reconnecting');
        this.reconnect();
      } else {
        this.setStatus('disconnected');
      }
    }
  }

  async readLoop() {
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;

        const type = value[0];
        const payload = value.slice(1);

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
      }
    } catch (err) {
      console.error('[WT] Read error:', err);
    }
  }

  disconnect() {
    if (this.writer) { this.writer.close().catch(() => {}); }
    if (this.wt) { this.wt.close().catch(() => {}); }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.setStatus('disconnected');
  }

  reconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      await this.connect();
    }, 2000);
  }

  async sendJoin(name) {
    if (!this.writer) return;
    const data = encodeJoinRoom(name);
    const msg = new Uint8Array(1 + data.length);
    msg[0] = MSG_JOIN_ROOM;
    msg.set(data, 1);
    await this.writer.write(msg);
  }

  handleSnapshot(payload) {
    const snapshot = decodeStateSnapshot(payload);
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
    if (this.state !== 'connected' || !this.writer) return;
    this.tick++;
    this.inputQueue.push({ moveX, moveZ, mouseX, mouseY, flags });
    this.sendTimer += dt;
    if (this.sendTimer >= 0.016) {
      this.sendTimer = 0;
      this.flushInputs();
    }
  }

  async flushInputs() {
    if (!this.writer || this.state !== 'connected') return;
    if (this.inputQueue.length === 0) return;
    const latest = this.inputQueue[this.inputQueue.length - 1];
    this.inputQueue = [];
    const data = encodePlayerInput(this.tick, latest.moveX, latest.moveZ, latest.mouseX, latest.mouseY, latest.flags);
    const msg = new Uint8Array(1 + data.length);
    msg[0] = MSG_PLAYER_INPUT;
    msg.set(data, 1);
    try {
      await this.writer.write(msg);
    } catch (err) {
      console.error('[WT] Write error:', err);
      this.setStatus('disconnected');
    }
  }
}
