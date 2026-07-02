import { WebSocketServer, WebSocket } from 'ws';
import { RoomManager } from './room/roomManager.js';
import { Session } from './network/session.js';
import { parseMessage } from './network/protocol.js';
import { loadConfig } from './config/index.js';

const PORT = 5173;
const config = loadConfig();

const roomManager = new RoomManager(config, {
  onSessionCreated: (session) => {
    console.log(`[Session] ${session.id} created`);
  },
  onSessionDisconnect: (session) => {
    console.log(`[Session] ${session.id} disconnected`);
  },
});

const wss = new WebSocketServer({ port: PORT, path: '/ws' });
console.log(`[Server] Listening on ws://localhost:${PORT}/ws`);
console.log(`[Server] Floor size: ${config.floorSize}, Player speed: ${config.playerSpeed}`);
console.log(`[Server] Config: cooldown=${config.skills.projectile.cooldown}, speed=${config.skills.projectile.projectileSpeed}`);

const sessions = new Map<string, Session>();

let nextId = 0;
wss.on('connection', (ws: WebSocket) => {
  const sessionId = `s${++nextId}`;
  const session = new Session(sessionId, (data) => ws.send(data, { binary: true }));
  sessions.set(sessionId, session);

  console.log(`[WS] ${sessionId} connected`);

  ws.on('message', (data: Uint8Array) => {
    const msg = parseMessage(data);
    if (!msg) return;
    session.handleMessage(msg.type, msg.payload, roomManager);
  });

  ws.on('close', () => {
    console.log(`[WS] ${sessionId} closed`);
    roomManager.handleDisconnect(session);
    sessions.delete(sessionId);
  });

  ws.on('error', (err) => {
    console.error(`[WS] ${sessionId} error:`, err.message);
    roomManager.handleDisconnect(session);
    sessions.delete(sessionId);
  });
});

// Game loop: 60Hz
setInterval(() => {
  roomManager.update(0.01667);
}, 16);

// Health check endpoint
import { createServer } from 'node:http';
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', version: '0.1.0', players: sessions.size }));
});
httpServer.listen(PORT - 1, () => {
  console.log(`[Server] HTTP health check: http://localhost:${PORT - 1}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down...');
  wss.close();
  httpServer.close();
  roomManager.cleanup();
  process.exit(0);
});
