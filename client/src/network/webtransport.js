import { encodeJoinRoom, encodePlayerInput, MSG_JOIN_ROOM, MSG_PLAYER_INPUT, MSG_STATE_SNAPSHOT, MSG_ROOM_CREATED, MSG_DISCONNECT, decodeStateSnapshot, decodeRoomCreated } from './protocol.js';

function pemToDer(pem) {
  const b64 = pem.replace(/-----BEGIN CERTIFICATE-----/g, '')
                 .replace(/-----END CERTIFICATE-----/g, '')
                 .replace(/\s/g, '');
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}

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
    this.spkiHashBuffer = null;
  }

  // Auto-fetch cert from server and compute SPKI hash
  async init() {
    try {
      const resp = await fetch('http://localhost:8081/cert-pem');
      const pem = await resp.text();
      const spki = this.extractSpki(pem);
      if (spki) {
        this.spkiHashBuffer = await crypto.subtle.digest('SHA-256', spki);
      }
    } catch (e) {
      console.warn('[WT] Could not init cert:', e.message);
    }
  }

  // Extract SPKI (SubjectPublicKeyInfo) from PEM
  // We parse the PEM to get DER, then extract the EC public key DER
  extractSpki(pem) {
    try {
      const der = pemToDer(pem);
      // X.509 cert structure:
      // 30 [outer SEQUENCE]
      //   30 [tbsCertificate SEQUENCE]
      //     ... (version, serial, sig alg, issuer, validity, subject)
      //     30 [SubjectPublicKeyInfo SEQUENCE]  <-- this is the SPKI
      //       30 [AlgorithmIdentifier SEQUENCE]
      //       03 [BIT STRING - the public key]

      let o = 0;

      // Skip outer SEQUENCE
      if (der[o] !== 0x30) return null;
      o += 1 + this.asn1LenLen(der, o + 1);

      // Skip tbsCertificate SEQUENCE
      if (der[o] !== 0x30) return null;
      const tbsStart = o;
      o += 1 + this.asn1LenLen(der, o + 1);

      // Skip version (explicit tag [0])
      if (der[o] === 0xA0) {
        o += 1 + this.asn1LenLen(der, o + 1) + this.asn1Len(der, o + 1);
      }

      // Skip serialNumber
      o += this.asn1Skip(der, o);

      // Skip signature algorithm
      o += this.asn1Skip(der, o);

      // Skip issuer
      o += this.asn1Skip(der, o);

      // Skip validity
      o += this.asn1Skip(der, o);

      // Skip subject
      o += this.asn1Skip(der, o);

      // Now at SubjectPublicKeyInfo (SPKI)
      const spkiStart = o;
      const spkiTotalLen = this.asn1Len(der, o + 1);
      const spkiLenBytes = this.asn1LenLen(der, o + 1);
      const spkiEnd = o + 1 + spkiLenBytes + spkiTotalLen;

      return der.subarray(spkiStart, spkiEnd);
    } catch (e) {
      return null;
    }
  }

  asn1Len(data, offset) {
    const b = data[offset];
    if (b < 0x80) return b;
    const numBytes = b & 0x7F;
    let len = 0;
    for (let i = 0; i < numBytes; i++) {
      len = (len << 8) | data[offset + 1 + i];
    }
    return len;
  }

  asn1LenLen(data, offset) {
    const b = data[offset];
    if (b < 0x80) return 1;
    return 1 + (b & 0x7F);
  }

  asn1Skip(data, offset) {
    const tag = data[offset];
    const lenStart = offset + 1;
    const lenBytes = this.asn1LenLen(data, lenStart);
    const len = this.asn1Len(data, lenStart);
    return 1 + lenBytes + len;
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

    // Build options
    const opts = {};
    if (this.spkiHashBuffer) {
      opts.serverCertificateHashes = [
        { algorithm: 'sha-256', value: this.spkiHashBuffer }
      ];
    }

    try {
      this.wt = new WebTransport(`https://${host}/wt`, opts);
      await this.wt.ready;

      this.stream = await this.wt.createBidirectionalStream();
      this.reader = this.stream.readable.getReader();
      this.writer = this.stream.writable.getWriter();

      this.readLoop();
      await this.sendJoin(nickname);
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
