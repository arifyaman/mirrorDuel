import {
  Application,
  Color,
  Entity,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO,
  StandardMaterial,
  Vec3,
  CameraFrame,
  TONEMAP_ACES
} from 'playcanvas';
import { NetworkClient } from './network/webtransport.js';
import { Scene } from './scene.js';
import { Network } from './network.js';
import { Physics } from './physics.js';
import { Input } from './input.js';
import { CooldownHUD } from './hud.js';

const DT = 0.01667;
const COOLDOWN_CIRCUMFERENCE = 2 * Math.PI * 32;
const COOLDOWN_MAX = 4;

export class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('webglcontextlost', e => e.preventDefault());
    document.body.appendChild(this.canvas);

    this.app = new Application(this.canvas, {
      graphicsDeviceOptions: { antialias: false }
    });
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    window.addEventListener('resize', () => this.app.resizeCanvas());
    this.app.automaticallyManageScenes = false;

    this.scene = new Scene(this.app);
    this.networkClient = new NetworkClient('localhost:4433');
    this.network = new Network(this.networkClient, this);
    this.physics = new Physics(this.app);
    this.input = new Input(this.canvas, this.network);
    this.input.setCamera(this.scene.cameraComponent);
    this.input.init();
    this.hud = new CooldownHUD(COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX);
    this.myCooldown = 0;
  }

  start() {
    this.networkClient.connect();
    this.networkClient.onStatus(state => this.onStatus(state));
    this.networkClient.onDisconnect(() => this.network.onDisconnect());
    this.networkClient.onJoin((roomId, myPlayerId) => this.network.onJoin(myPlayerId));
    this.networkClient.onSnap((tick, players, projectiles) => this.onSnap(tick, players, projectiles));

    this.app.on('update', (dt) => this.update(dt));
    this.app.start();
  }

  onStatus(state) {
    const statusEl = document.getElementById('status');
    const labels = { disconnected: 'Disconnected', connecting: 'Connecting...', connected: 'Connected', reconnecting: 'Reconnecting...' };
    statusEl.textContent = labels[state] || state;
    statusEl.style.color = state === 'connected' ? '#0f0' : state === 'connecting' || state === 'reconnecting' ? '#ff0' : '#f00';
  }

  onSnap(tick, players, projectiles) {
    const serverTime = tick * DT;
    this.physics.simTime += (serverTime - this.physics.simTime) * 0.1;
    const myPlayer = players.find(p => p.id === this.network.myPlayerId);
    if (myPlayer) {
      this.myCooldown = Math.max(0, myPlayer.cooldown);
    }
    this.physics.applySnapshot(players, projectiles);
  }

  recreateHUD() {
    if (this.hud) this.hud.destroy();
    this.hud = new CooldownHUD(COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX);
  }

  update(dt) {
    this.physics.simTime += dt;
    this.physics.updateProjectiles();
    if (this.myCooldown > 0) {
      this.myCooldown = Math.max(0, this.myCooldown - dt);
    }
    this.hud.update(this.myCooldown, COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX);
    const moveX = (this.input.keys['d'] ? 1 : 0) - (this.input.keys['a'] ? 1 : 0);
    const moveZ = (this.input.keys['w'] ? 1 : 0) - (this.input.keys['s'] ? 1 : 0);
    const flags = this.input.mouseDown ? 0x01 : 0;
    this.networkClient.update(dt, moveX, moveZ, this.input.mouseX, this.input.mouseY, flags);
  }
}
