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
import { PerkManager } from './perks.js';
import { createGroundTurret } from './physics/players.js';

const DT = 0.01667;
const COOLDOWN_CIRCUMFERENCE = 2 * Math.PI * 32;
const COOLDOWN_MAX = 0.14;
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
    this.perks = new PerkManager();
    this.physics.perks = this.perks;
    this.input = new Input(this.canvas, this.network);
    this.input.setCamera(this.scene.cameraComponent);
    this.input.init();
    this.myCooldown = 0;
    this.myDashCooldown = 0;
    this.myShieldCooldown = 0;
    this.mySlashCooldown = 0;
    this._seenProjIds = new Set();
    this._wasReloading = false;
    this._prevWave = 1;
    this._prevWaveState = 0;
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
      this.myHealth = myPlayer.health;
      this.myCooldown = Math.max(0, myPlayer.cooldown);
      this.myDashCooldown = Math.max(0, myPlayer.dashCooldown);
      this.myShieldCooldown = Math.max(0, myPlayer.shieldCooldown);
      this.mySlashCooldown = Math.max(0, myPlayer.slashCooldown);
      this._myPlayerPos.x = myPlayer.x;
      this._myPlayerPos.z = myPlayer.z;
      this._myPlayerAngle = myPlayer.angle;

      // Detect reload sound triggers
      if (myPlayer.cooldown > 0.3 && !this._wasReloading) {
        this._wasReloading = true;
        this.audio.playReloadStart(PITCH_BY_PLAYER[myPlayer.id] || 1);
      } else if (myPlayer.cooldown <= 0.05 && this._wasReloading) {
        this._wasReloading = false;
        this.audio.playReloadFinish(PITCH_BY_PLAYER[myPlayer.id] || 1);
      }
    }

    // Detect skill activations: dash & shield cooldown jumps from 0 to >0
    for (const p of players) {
      const prev = this._prevCooldowns[p.id] || { fire: 0, dash: 0, shield: 0 };
      const pitchMult = PITCH_BY_PLAYER[p.id] || 1;
      if (prev.dash <= 0 && p.dashCooldown > 0) {
        this.audio.playDash(pitchMult);
      }
      if (prev.shield <= 0 && p.shieldCooldown > 0) {
        this.audio.playShieldActivate(pitchMult);
      }
      this._prevCooldowns[p.id] = { fire: p.cooldown, dash: p.dashCooldown, shield: p.shieldCooldown };
    }

    // Play gunshot audio for every newly spawned bullet projectile!
    if (projectiles) {
      for (const proj of projectiles) {
        if (!this._seenProjIds.has(proj.id)) {
          this._seenProjIds.add(proj.id);
          if (this._seenProjIds.size > 200) {
            const first = this._seenProjIds.values().next().value;
            this._seenProjIds.delete(first);
          }
          const pitchMult = PITCH_BY_PLAYER[proj.ownerId] || 1;
          this.audio.playFire(pitchMult);
          if (proj.ownerId === this.network.myPlayerId && this.gameTitle) {
            this.gameTitle.triggerJump();
          }
        }
      }
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
          if (p.id >= 100) {
            // Zombie killed
            this.physics.createExplosion(p.x, p.y, p.z, '#00e676');
            this.audio.playHit(false);
          } else {
            // Human player downed
            const explosionColor = p.id === 1 ? '#ff4444' : '#4488ff';
            this.physics.createExplosion(p.x, p.y, p.z, explosionColor);
            if (isMe) {
              this.ui.showWaveBanner('YOU DIED!', 'WAITING FOR SQUAD TO CLEAR WAVE...', '#ff1744');
              this.audio.playDeath();
            }
          }
        }
      }
      // Clear death labels if a dead player is alive again (room reset or wave revive)
      if (prev !== undefined && prev <= 0 && p.health > 0) {
        this.ui.clearDeathLabels();
      }
      this._prevHealth[p.id] = p.health;
    }

    // Camera target: only track human players (id < 100), never track zombies!
    const humanPlayers = players.filter(p => p.id < 100 && p.health > 0);
    if (humanPlayers.length >= 2) {
      let cx = 0, cz = 0;
      for (const p of humanPlayers) {
        cx += p.x;
        cz += p.z;
      }
      this._cameraTarget.x = cx / humanPlayers.length;
      this._cameraTarget.z = cz / humanPlayers.length;
      this.scene.setPlayerPositions(humanPlayers.map(p => ({ x: p.x, z: p.z })));
    } else {
      this._cameraTarget.x = this._myPlayerPos.x;
      this._cameraTarget.z = this._myPlayerPos.z;
      this.scene.setPlayerPositions([{ x: this._myPlayerPos.x, z: this._myPlayerPos.z }]);
    }

    this.physics.myPlayerId = this.network.myPlayerId;
    this.physics.applySnapshot(players, projectiles);
    const names = {};
    if (this.network.myPlayerId) {
      names[this.network.myPlayerId] = this.myNickname || 'You';
      const opponentId = this.network.myPlayerId === 1 ? 2 : 1;
      if (this.network.opponentName) names[opponentId] = this.network.opponentName;
    }
    this.ui.update(players, [this.myCooldown, this.myDashCooldown, this.myShieldCooldown], [0.14, 7, 7], this.network.myPlayerId, names);

    // Process game events from snapshot
    if (events) {
      for (const evt of events) {
        if (evt.type === 1) { // EVENT_SLASH
          this.onSlashEvent(evt.playerId, evt.x, evt.z, evt.angle);
        } else if (evt.type === 2) { // EVENT_PERFECT_BLOCK
          this.onPerfectBlockEvent(evt.playerId, evt.x, evt.z, evt.angle);
        } else if (evt.type === 3) { // EVENT_SHIELD_BLOCK
          this.onShieldBlockEvent(evt.playerId, evt.x, evt.z, evt.angle);
        } else if (evt.type === 4) { // EVENT_EXPLOSION
          this.physics.createExplosion(evt.x, 0.25, evt.z, '#ff3d00');
          this.audio.playBoomExplosion();
        } else if (evt.type === 5) { // EVENT_TURRET_FIRE
          if (!this.physics.groundTurret) {
            this.physics.groundTurret = createGroundTurret(this.physics, evt.tx, evt.tz);
          }
          if (this.physics.groundTurret) {
            this.physics.groundTurret.head.setEulerAngles(0, (evt.angle + Math.PI) * (180 / Math.PI), 0);
          }
          this.physics.createExplosion(evt.zx, 0.25, evt.zz, '#00e5ff');
          this.audio.playTurretFire();
        } else if (evt.type === 6) { // EVENT_PLAYER_PERKS
          this.physics.playerPerks.set(evt.playerId, evt.perkMask);
        } else if (evt.type === 10) { // EVENT_WAVE_UPDATE
          this.ui.updateWave(evt.wave, evt.state, evt.timeLeft, evt.aliveZombies, evt.totalKills);
          if (evt.state === 1 && this._prevWaveState === 0) {
            this.ui.showWaveBanner(`🏆 WAVE ${evt.wave} CLEARED!`, 'CHOOSE YOUR REWARD!', '#00e676');
            this.audio.playWaveClear();

            // Open 3-perk holographic upgrade selection modal!
            const choices = this.perks.getRandomChoices(3);
            setTimeout(() => {
              this.audio.playUpgradeOpen();
              this.ui.showUpgradeModal(choices, (selectedPerk) => {
                this.perks.add(selectedPerk.id);
                this.audio.playUpgradeSelect();

                // If sentry_turret selected, immediately place ground turret at current location
                if (selectedPerk.id === 'sentry_turret' && !this.physics.groundTurret) {
                  this.physics.groundTurret = createGroundTurret(this.physics, this._myPlayerPos.x, this._myPlayerPos.z);
                }

                // Send perk selection to server
                const PERK_MAP = {
                  'dual_wield': 1,
                  'sentry_turret': 2,
                  'explosive_rounds': 3,
                  'piercing_plasma': 4,
                  'nano_armor': 5,
                  'cyber_dash': 6
                };
                if (this.networkClient) {
                  this.networkClient.sendSelectPerk(PERK_MAP[selectedPerk.id] || 1);
                }

                this.ui.showWaveBanner(`⚡ ${selectedPerk.title} EQUIPPED!`, selectedPerk.subtitle, selectedPerk.rarityColor);
              });
            }, 600);
          } else if (evt.state === 0 && this._prevWaveState === 1) {
            this.ui.closeUpgradeModal();
            this.ui.showWaveBanner(`⚠️ WAVE ${evt.wave} STARTING!`, 'ELIMINATE ALL THREATS!', '#ff3d00');
            this.audio.playWaveStart();
          }
          this._prevWave = evt.wave;
          this._prevWaveState = evt.state;
        } else if (evt.type === 11) { // EVENT_SQUAD_WIPED
          this.ui.closeUpgradeModal();
          this.ui.showWaveBanner('💀 SQUAD WIPED!', `SURVIVED TO WAVE ${evt.wave} • RESTARTING IN 3s...`, '#ff1744');
          this.audio.playDeath();
          this.perks.reset(this.physics);
          this._prevWaveState = 0;
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
    const dead = typeof this.myHealth === 'number' && this.myHealth <= 0;
    const paused = (this.helpModal && this.helpModal.isOpen) || (this.nicknameModal && this.nicknameModal.isOpen);
    const moveX = dead || paused ? 0 : (this.input.keys['d'] ? 1 : 0) - (this.input.keys['a'] ? 1 : 0);
    const moveZ = dead || paused ? 0 : (this.input.keys['w'] ? 1 : 0) - (this.input.keys['s'] ? 1 : 0);
    let flags = 0;
    if (!dead && !paused) {
      if (this.input.fire) flags |= 0x01;
      if (this.input.dash) flags |= 0x02;
      if (this.input.shield) flags |= 0x04;
      if (this.input.inputSlash) flags |= 0x08;
      if (this.input.reload) flags |= 0x10;
    }
    this.networkClient.update(dt, moveX, moveZ, this.input.mouseX, this.input.mouseY, flags);
    this.updatePingDisplay();
  }

  updatePingDisplay() {
    const pingEl = document.getElementById('ping');
    if (pingEl) {
      const ping = this.networkClient.ping;
      if (this.networkClient.state !== 'connected' || ping === null) {
        pingEl.textContent = '--';
        pingEl.style.color = '#888';
      } else {
        pingEl.textContent = `${Math.round(ping)}ms`;
        pingEl.style.color = ping <= 60 ? '#0f0' : ping <= 120 ? '#ff0' : '#f00';
      }
    }

    const oppPingEl = document.getElementById('opponent-ping');
    if (oppPingEl) {
      const oppPing = this.networkClient.opponentPing;
      if (this.networkClient.state !== 'connected' || oppPing === null) {
        oppPingEl.textContent = '';
      } else {
        oppPingEl.textContent = `opp: ${Math.round(oppPing)}ms`;
        oppPingEl.style.color = oppPing <= 60 ? '#0f0' : oppPing <= 120 ? '#ff0' : '#f00';
      }
    }
  }
}
