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
import { Physics } from './physics/index.js';
import { Input } from './input.js';
import { UI } from './ui.js';
import { GameTitle } from './game-title.js';
import { HelpModal } from './help-modal.js';
import { NicknameModal } from './nickname-modal.js';
import { AudioEngine } from './audio.js';
import { AudioButton } from './audio-button.js';

const DT = 0.01667;
const COOLDOWN_CIRCUMFERENCE = 2 * Math.PI * 32;
const COOLDOWN_MAX = 3;
const PITCH_BY_PLAYER = { 1: 1.0, 2: 0.92 };

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

    this.audio = new AudioEngine(this.app);
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
    this.mySlashCooldown = 0;
    this._prevCooldowns = {};
    this._prevHealth = {};
    this._myPlayerPos = { x: 0, z: 0 };
    this._myPlayerAngle = 0;
    this._cameraTarget = { x: 0, z: 0 };
    this.gameTitle = new GameTitle();
    this.helpModal = new HelpModal(this.audio);
    this.nicknameModal = new NicknameModal(this.audio);
    this.myNickname = null;
    this.audioButton = new AudioButton(this.audio);
    this.ui = new UI(this.app, COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX, this.scene.cameraComponent);
  }

  start() {
    this.app.on('start', () => this._onAppStarted());
    this.networkClient.onStatus(state => this.onStatus(state));
    this.networkClient.onDisconnect(() => this.network.onDisconnect());
    this.networkClient.onJoin((roomId, myPlayerId, opponentName, obstacleGrid, gridWidth, gridHeight) => {
      this.network.onJoin(myPlayerId, opponentName);
      if (obstacleGrid) {
        this.scene.createObstacles(obstacleGrid, gridWidth, gridHeight);
      }
    });
    this.networkClient.onSnap((tick, players, projectiles, events) => this.onSnap(tick, players, projectiles, events));

    this.app.on('update', (dt) => this.update(dt));
    this.app.start();

    this.nicknameModal.show((name) => {
      this.myNickname = name;
      this.networkClient.connect(name);
    });
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

  onSnap(tick, players, projectiles, events) {
    const serverTime = tick * DT;
    this.physics.simTime += (serverTime - this.physics.simTime) * 0.1;

    const myPlayer = players.find(p => p.id === this.network.myPlayerId);
    if (myPlayer) {
      this.myCooldown = Math.max(0, myPlayer.cooldown);
      this.myDashCooldown = Math.max(0, myPlayer.dashCooldown);
      this.myShieldCooldown = Math.max(0, myPlayer.shieldCooldown);
      this.mySlashCooldown = Math.max(0, myPlayer.slashCooldown);
      this._myPlayerPos.x = myPlayer.x;
      this._myPlayerPos.z = myPlayer.z;
      this._myPlayerAngle = myPlayer.angle;
    }

    // Detect skill activations: cooldown jumps from 0 to >0, for every player
    for (const p of players) {
      const prev = this._prevCooldowns[p.id] || { fire: 0, dash: 0, shield: 0 };
      const pitchMult = PITCH_BY_PLAYER[p.id] || 1;
      if (prev.fire <= 0 && p.cooldown > 0) {
        this.audio.playFire(pitchMult);
        if (p.id === this.network.myPlayerId && this.gameTitle) this.gameTitle.triggerJump();
      }
      if (prev.dash <= 0 && p.dashCooldown > 0) {
        this.audio.playDash(pitchMult);
      }
      if (prev.shield <= 0 && p.shieldCooldown > 0) {
        this.audio.playShieldActivate(pitchMult);
      }
      this._prevCooldowns[p.id] = { fire: p.cooldown, dash: p.dashCooldown, shield: p.shieldCooldown };
    }

    // Detect hits: health drop on any player
    for (const p of players) {
      const prev = this._prevHealth[p.id];
      if (prev !== undefined && p.health < prev) {
        const dmg = prev - p.health;
        const isMe = p.id === this.network.myPlayerId;
        const who = isMe ? 'ME' : `P${p.id}`;
        console.log(`[CLIENT HIT] ${who} took ${dmg} damage (${p.health} HP remaining)`);
        this.physics.flashPlayer(p.id);
        this.physics.bouncePlayer(p.id);
        this.audio.playHit(isMe);
        if (isMe) this.ui.showHitIndicator();
        if (p.health <= 0 && prev > 0) {
          const explosionColor = p.id === 1 ? '#ff4444' : '#4488ff';
          this.physics.createExplosion(p.x, p.y, p.z, explosionColor);
          this.ui.showDeathLabel(isMe);
          this.audio.playDeath();
          console.log(`[DEATH] ${who} died!`);
        }
      }
      // Clear death labels if a dead player is alive again (room reset)
      if (prev !== undefined && prev <= 0 && p.health > 0) {
        this.ui.clearDeathLabels();
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
    const names = {};
    if (this.network.myPlayerId) {
      names[this.network.myPlayerId] = this.myNickname || 'You';
      const opponentId = this.network.myPlayerId === 1 ? 2 : 1;
      if (this.network.opponentName) names[opponentId] = this.network.opponentName;
    }
    this.ui.update(players, [this.myCooldown, this.myDashCooldown, this.myShieldCooldown], [3, 7, 7], this.network.myPlayerId, names);

    // Process game events from snapshot
    if (events) {
      for (const evt of events) {
        if (evt.type === 1) { // EVENT_SLASH
          this.onSlashEvent(evt.playerId, evt.x, evt.z, evt.angle);
        } else if (evt.type === 2) { // EVENT_PERFECT_BLOCK
          this.onPerfectBlockEvent(evt.playerId, evt.x, evt.z, evt.angle);
        } else if (evt.type === 3) { // EVENT_SHIELD_BLOCK
          this.onShieldBlockEvent(evt.playerId, evt.x, evt.z, evt.angle);
        }
      }
    }
  }

  recreateHUD() {
    this.ui.destroy();
    this.ui = new UI(this.app, COOLDOWN_CIRCUMFERENCE, COOLDOWN_MAX, this.scene.cameraComponent);
  }

  onSlashEvent(playerId, x, z, angle) {
    const spawnDist = 0.3;
    const px = x + Math.sin(angle) * spawnDist;
    const pz = z + Math.cos(angle) * spawnDist;
    const pos = new Vec3(px, -0.25, pz);
    this.physics.spawnCrescentSlash({
      position: pos,
      facingAngle: angle,
      coreColor: playerId === 1 ? [1, 0.2, 0.2] : [0.2, 0.2, 1]
    });
    this.audio.playSlash(PITCH_BY_PLAYER[playerId] || 1);
  }

  onPerfectBlockEvent(playerId, x, z, angle) {
    this.physics.perfectBlockFlash(playerId, x, z);
    this.audio.playPerfectBlock(PITCH_BY_PLAYER[playerId] || 1);
  }

  onShieldBlockEvent(playerId, x, z, angle) {
    this.audio.playShieldBlock(PITCH_BY_PLAYER[playerId] || 1);
  }

  update(dt) {
    this.physics.simTime += dt;
    this.physics.updateExplosions();
    this.physics.updateDashTrails();
    this.physics.updateSlashes(dt);
    this.physics.updateHurtBounces(dt);
    this.physics.updateFireTrail();
    this.physics.updateFireSparks();
    this.physics.updateFireImpacts();
    if (this.gameTitle) this.gameTitle.update();
    if (this.scene) {
      this.scene.cameraTargetMid.x = this._cameraTarget.x;
      this.scene.cameraTargetMid.z = this._cameraTarget.z;
      this.scene.updateCamera(dt);
      const camPos = this.scene.cameraComponent.entity.getPosition();
      this.physics.updateAllShields(dt, { x: camPos.x, y: camPos.y, z: camPos.z });
      this.physics.updateProjectiles({ x: camPos.x, y: camPos.y, z: camPos.z });
    } else {
      this.physics.updateProjectiles();
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
    if (this.mySlashCooldown > 0) {
      this.mySlashCooldown = Math.max(0, this.mySlashCooldown - dt);
    }
    const myId = this.network.myPlayerId;
    const dead = this._prevHealth[myId] !== undefined && this._prevHealth[myId] <= 0;
    const paused = (this.helpModal && this.helpModal.isOpen) || (this.nicknameModal && this.nicknameModal.isOpen);
    const moveX = dead || paused ? 0 : (this.input.keys['d'] ? 1 : 0) - (this.input.keys['a'] ? 1 : 0);
    const moveZ = dead || paused ? 0 : (this.input.keys['w'] ? 1 : 0) - (this.input.keys['s'] ? 1 : 0);
    let flags = 0;
    if (!dead && !paused) {
      if (this.input.fire) flags |= 0x01;
      if (this.input.dash) flags |= 0x02;
      if (this.input.shield) flags |= 0x04;
      if (this.input.inputSlash) flags |= 0x08;
    }
    this.networkClient.update(dt, moveX, moveZ, this.input.mouseX, this.input.mouseY, flags);
    this.updatePingDisplay();
  }

  updatePingDisplay() {
    const pingEl = document.getElementById('ping');
    if (!pingEl) return;
    const ping = this.networkClient.ping;
    if (this.networkClient.state !== 'connected' || ping === null) {
      pingEl.textContent = '--';
      pingEl.style.color = '#888';
      return;
    }
    pingEl.textContent = `${Math.round(ping)}ms`;
    pingEl.style.color = ping <= 60 ? '#0f0' : ping <= 120 ? '#ff0' : '#f00';
  }
}
