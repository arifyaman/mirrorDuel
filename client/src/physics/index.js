import { applyPlayersLogic, destroyPlayerEntity, cleanupPlayerEntities } from './players.js';
import { applyProjectilesLogic, updateProjectiles, destroyProjectile, cleanupProjectiles } from './projectiles.js';
import { updateAllShields, shieldHit, destroyShield } from './shields.js';
import { createExplosion, createDashGhost, spawnCrescentSlash, updateExplosions, updateDashTrails, updateSlashes, updateHurtBounces } from './effects.js';

const DT = 0.01667;

export class Physics {
  constructor(app) {
    this.simTime = 0;
    this.playerEntities = new Map();
    this.indicatorEntities = new Map();
    this.playerLights = new Map();
    this.projectileEntities = new Map();
    this._explosions = [];
    this._playerFlash = new Map();
    this._playerPerfectFlash = new Map();
    this._dashTrails = [];
    this._prevPlayerPos = new Map();
    this._playerShields = new Map();
    this._slashes = [];
    this._hurtBounces = new Map();
    this.app = app;
  }

  applySnapshot(players, projectiles) {
    applyPlayersLogic(this, players);
    applyProjectilesLogic(this, projectiles);
  }

  destroyPlayerEntity(id) {
    destroyPlayerEntity(this, id);
  }

  destroyProjectile(id) {
    destroyProjectile(this, id);
  }

  cleanupPlayerEntities() {
    cleanupPlayerEntities(this);
  }

  updateProjectiles() {
    updateProjectiles(this);
  }

  updateExplosions() {
    updateExplosions(this);
  }

  updateDashTrails() {
    updateDashTrails(this);
  }

  updateSlashes(dt) {
    updateSlashes(this, dt);
  }

  updateHurtBounces(dt) {
    updateHurtBounces(this, dt);
  }

  updateAllShields(dt, cameraPos) {
    updateAllShields(this, dt, cameraPos);
  }

  flashPlayer(id) {
    this._playerFlash.set(id, performance.now());
  }

  perfectBlockFlash(id) {
    this._playerPerfectFlash.set(id, performance.now());
  }

  bouncePlayer(id) {
    this._hurtBounces.set(id, { offset: 0, velocity: 4.0 });
  }

  shieldHit(playerId) {
    shieldHit(this, playerId);
  }

  createExplosion(x, y, z, hexColor) {
    createExplosion(this, x, y, z, hexColor);
  }

  createDashGhost(playerId, x, y, z, angle) {
    createDashGhost(this, playerId, x, y, z, angle);
  }

  spawnCrescentSlash(options) {
    spawnCrescentSlash(this, options);
  }
}
