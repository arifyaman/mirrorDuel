import { GameConfig } from '../config/index.js';

export class GameSession {
  readonly roomId: number;
  private _tick = 0;
  private readonly config: GameConfig;

  players: Map<number, Player> = new Map();
  projectiles: Projectile[] = [];
  sessions: Map<number, any> = new Map();

  constructor(roomId: number, config: GameConfig) {
    this.roomId = roomId;
    this.config = config;
  }

  get tick(): number {
    return this._tick;
  }

  tickStep() {
    this._tick++;

    // Process buffered inputs for all players
    for (const player of this.players.values()) {
      player.processInputs(0.01667);
    }

    // Update projectiles
    const maxReach = this.config.skills.projectile.maxReach;
    const speed = this.config.skills.projectile.projectileSpeed;
    for (const proj of this.projectiles) {
      proj.traveled += speed * 0.01667;
    }
    this.projectiles = this.projectiles.filter(p => p.traveled < maxReach);
  }

  getSnapshot() {
    const players = Array.from(this.players.values()).map(p => {
      const snap = {
        id: p.id,
        name: p.name,
        x: p.x,
        y: p.y,
        z: p.z,
        angle: p.angle,
        cooldown: p.cooldown,
      };
      console.log(`[Server] Player ${p.id} snapshot:`, snap);
      return snap;
    });

    const projectiles = this.projectiles.map(p => ({
      id: p.id,
      x: p.x,
      y: p.y,
      z: p.z,
      traveled: p.traveled,
      dirX: p.dirX,
      dirZ: p.dirZ,
    }));

    return { tick: this._tick, players, projectiles };
  }

  addPlayer(id: number, name: string): Player {
    const spawnX = id === 1 ? -2 : 2;
    const player = new Player(id, name, spawnX, -0.2, 0, this.config);
    player.z = -0.2;
    this.players.set(id, player);
    return player;
  }

  activateProjectile(player: Player, mouseX: number, mouseY: number): void {
    if (player.cooldown > 0) return;

    const config = this.config.skills.projectile;
    player.cooldown = config.cooldown;

    const dx = mouseX - player.x;
    const dz = mouseY - player.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.01) return;

    const dirX = dx / len;
    const dirZ = dz / len;

    this.projectiles.push({
      id: nextProjectileId++,
      x: player.x + dirX * 0.3,
      y: player.y,
      z: player.z + dirZ * 0.3,
      traveled: 0,
      dirX,
      dirZ,
      playerOwner: player.id,
    });
  }
}

let nextProjectileId = 1;

export class Player {
  readonly id: number;
  name = '';
  x: number;
  y: number;
  z: number = -0.5;
  targetX: number;
  targetZ: number;
  angle: number;
  cooldown: number;
  private readonly config: GameConfig;
  private bufferedInputs: Array<{ moveX: number; moveZ: number; mouseX: number; mouseZ: number; flags: number }> = [];

  constructor(id: number, name: string, x: number, y: number, angle: number, config: GameConfig) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = y;
    this.targetX = x;
    this.targetZ = y;
    this.angle = angle;
    this.config = config;
    this.cooldown = 0;
  }

  queueInput(input: { moveX: number; moveZ: number; mouseX: number; mouseZ: number; flags: number; tick: number }) {
    this.bufferedInputs.push(input);
  }

  processInputs(dt: number) {
    if (this.bufferedInputs.length === 0) return;

    const lastInput = this.bufferedInputs[this.bufferedInputs.length - 1];
    const moveX = lastInput.moveX;
    const moveZ = lastInput.moveZ;

    const halfFloor = this.config.floorSize / 2;
    const speed = this.config.playerSpeed;

    // Update target position with camera-relative movement + speed modulation
    if (moveX !== 0 || moveZ !== 0) {
      // Camera-relative: W=-Z, S=+Z, A=-X, D=+X
      const moveDirX = moveX;
      const moveDirZ = -moveZ;

      // Player forward direction (from angle)
      const playerForwardX = -Math.sin(this.angle);
      const playerForwardZ = -Math.cos(this.angle);

      // Normalized move direction
      const moveLen = Math.sqrt(moveDirX * moveDirX + moveDirZ * moveDirZ);
      const normMoveX = moveDirX / moveLen;
      const normMoveZ = moveDirZ / moveLen;

      // Alignment (dot product of move dir and player forward)
      const alignment = normMoveX * playerForwardX + normMoveZ * playerForwardZ;
      const speedMult = 0.75 + 0.25 * alignment;

      this.targetX += normMoveX * speed * speedMult * dt;
      this.targetZ += normMoveZ * speed * speedMult * dt;
    }

    // Clamp target to floor bounds
    this.targetX = Math.max(-halfFloor, Math.min(halfFloor, this.targetX));
    this.targetZ = Math.max(-halfFloor, Math.min(halfFloor, this.targetZ));

    // Smooth lerp toward target position
    const lerpFactor = this.config.lerpFactor || 8;
    const alpha = 1 - Math.exp(-lerpFactor * dt);
    this.x += (this.targetX - this.x) * alpha;
    this.z += (this.targetZ - this.z) * alpha;

    const mdx = lastInput.mouseX - this.x;
    const mdz = lastInput.mouseY - this.z;
    const dist = Math.sqrt(mdx * mdx + mdz * mdz);
    if (dist > 0.01) {
      this.angle = Math.atan2(mdx, mdz);
    }

    if (this.cooldown > 0) {
      this.cooldown -= dt;
      if (this.cooldown < 0) this.cooldown = 0;
    }

    this.bufferedInputs = [];
  }
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  z: number;
  traveled: number;
  dirX: number;
  dirZ: number;
  playerOwner: number;
}
