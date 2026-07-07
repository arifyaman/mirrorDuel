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
import { UI } from './ui.js';
import { GameTitle } from './game-title.js';

const DT = 0.01667;
const COOLDOWN_CIRCUMFERENCE = 2 * Math.PI * 32;
const COOLDOWN_MAX = 3;

export class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('webglcontextlost', e => e.preventDefault());
    document.body.appendChild(this.canvas);

    // Load cool font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    this.app = new Application(this.canvas, {
      graphicsDeviceOptions: { antialias: false }
    });
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    window.addEventListener('resize', () => this.app.resizeCanvas());
    this.app.automaticallyManageScenes = false;

    this.scene = new Scene(this.app);
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'localhost:4433';
    this.networkClient = new NetworkClient(serverUrl);
    this.network = new Network(this.networkClient, this);
    this.physics = new Physics(this.app);
    this.input = new Input(this.canvas, this.network);
    this.input.setCamera(this.scene.cameraComponent);
    this.input.init();
    this.myCooldown = 0;
    this.myDashCooldown = 0;
    this.myShieldCooldown = 0;
    this._prevMyCooldown = 0;
    this._prevHealth = {};
    this._myPlayerPos = { x: 0, z: 0 };
    this._myPlayerAngle = 0;
    this._cameraTarget = { x: 0, z: 0 };
    this.gameTitle = new GameTitle();
    this.ui = new UI(this.app, COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX);
  }

  start() {
    this.app.on('start', () => this._onAppStarted());
    this.networkClient.connect();
    this.networkClient.onStatus(state => this.onStatus(state));
    this.networkClient.onDisconnect(() => this.network.onDisconnect());
    this.networkClient.onJoin((roomId, myPlayerId) => {
      this.network.onJoin(myPlayerId);
    });
    this.networkClient.onSnap((tick, players, projectiles) => this.onSnap(tick, players, projectiles));

    this.app.on('update', (dt) => this.update(dt));
    this.app.start();
  }

  _onAppStarted() {
    this.scene.applyPostProcessing();
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
      this.myDashCooldown = Math.max(0, myPlayer.dashCooldown);
      this.myShieldCooldown = Math.max(0, myPlayer.shieldCooldown);
      this._myPlayerPos.x = myPlayer.x;
      this._myPlayerPos.z = myPlayer.z;
      this._myPlayerAngle = myPlayer.angle;
    }

    // Detect spell fire: cooldown jumps from 0 to >0
    if (myPlayer && this._prevMyCooldown <= 0 && myPlayer.cooldown > 0) {
      if (this.gameTitle) this.gameTitle.triggerJump();
    }
    this._prevMyCooldown = this.myCooldown;

    // Detect hits: health drop on any player
    for (const p of players) {
      const prev = this._prevHealth[p.id];
      if (prev !== undefined && p.health < prev) {
        const dmg = prev - p.health;
        const isMe = p.id === this.network.myPlayerId;
        const who = isMe ? 'ME' : `P${p.id}`;
        console.log(`[CLIENT HIT] ${who} took ${dmg} damage (${p.health} HP remaining)`);
        this.physics.flashPlayer(p.id);
        if (isMe) this.ui.showHitIndicator();
        if (p.health <= 0 && prev > 0) {
          const explosionColor = p.id === 1 ? '#ff4444' : '#4488ff';
          this.physics.createExplosion(p.x, p.y, p.z, explosionColor);
          console.log(`[DEATH] ${who} died!`);
        }
      }
      this._prevHealth[p.id] = p.health;
    }

    // Camera target: midpoint between players if 2+, else single player
    if (players.length >= 2) {
      let cx = 0, cz = 0;
      for (const p of players) {
        cx += p.x;
        cz += p.z;
      }
      this._cameraTarget.x = cx / players.length;
      this._cameraTarget.z = cz / players.length;
    } else {
      this._cameraTarget.x = this._myPlayerPos.x;
      this._cameraTarget.z = this._myPlayerPos.z;
    }

    // Pass player positions to scene for zoom calculation
    this.scene.setPlayerPositions(players.map(p => ({ x: p.x, z: p.z })));

    this.physics.applySnapshot(players, projectiles);
    this.ui.update(players, [this.myCooldown, this.myDashCooldown, this.myShieldCooldown], [3, 7, 7]);
  }

  recreateHUD() {
    this.ui.destroy();
    this.ui = new UI(this.app, COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX);
  }

  update(dt) {
    this.physics.simTime += dt;
    this.physics.updateProjectiles();
    this.physics.updateExplosions();
    this.physics.updateDashTrails();
    if (this.gameTitle) this.gameTitle.update();
    if (this.scene) {
      this.scene.cameraTargetMid.x = this._cameraTarget.x;
      this.scene.cameraTargetMid.z = this._cameraTarget.z;
      this.scene.updateCamera(dt);
      const camPos = this.scene.cameraComponent.entity.getPosition();
      this.physics.updateAllShields(dt, { x: camPos.x, y: camPos.y, z: camPos.z });
    }
    if (this.myCooldown > 0) {
      this.myCooldown = Math.max(0, this.myCooldown - dt);
    }
    if (this.myDashCooldown > 0) {
      this.myDashCooldown = Math.max(0, this.myDashCooldown - dt);
    }
    if (this.myShieldCooldown > 0) {
      this.myShieldCooldown = Math.max(0, this.myShieldCooldown - dt);
    }
    const myId = this.network.myPlayerId;
    const dead = this._prevHealth[myId] !== undefined && this._prevHealth[myId] <= 0;
    const moveX = dead ? 0 : (this.input.keys['d'] ? 1 : 0) - (this.input.keys['a'] ? 1 : 0);
    const moveZ = dead ? 0 : (this.input.keys['w'] ? 1 : 0) - (this.input.keys['s'] ? 1 : 0);
    let flags = 0;
    if (!dead) {
      if (this.input.fire) flags |= 0x01;
      if (this.input.dash) flags |= 0x02;
      if (this.input.shield) flags |= 0x04;
    }
    this.networkClient.update(dt, moveX, moveZ, this.input.mouseX, this.input.mouseY, flags);
  }
}
