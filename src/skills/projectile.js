import { Skill } from '../skill.js';
import { Entity, Color, StandardMaterial, Vec3 } from 'playcanvas';

export class ProjectileSkill extends Skill {
  constructor(app, player) {
    super(app);
    this.player = player;

    this.maxCooldown = 0.2;
    this.projectileSpeed = 15;
    this.maxReach = 4;

    this.projectileEntity = null;
    this.trailParticles = [];
    this.maxTrailLength = 15;
  }

  _createProjectile() {
    const material = new StandardMaterial();
    material.diffuse = new Color(0, 1, 1);
    material.update();

    this.projectileEntity = new Entity('projectile');
    this.projectileEntity.addComponent('render', { type: 'box' });
    this.projectileEntity.setLocalScale(0.16, 0.16, 0.16);
    this.projectileEntity.render.material = material;
    this.app.root.addChild(this.projectileEntity);
  }

  _createTrailParticle() {
    const material = new StandardMaterial();
    material.diffuse = new Color(0, 1, 1);
    material.emissive = new Color(0, 0.5, 0.5);
    material.update();

    const particle = new Entity('trailParticle');
    particle.addComponent('render', { type: 'box' });
    particle.setLocalScale(0.04, 0.04, 0.04);
    particle.render.material = material;
    particle.enabled = false;
    this.app.root.addChild(particle);
    return particle;
  }

  activate(cameraComponent) {
    super.activate();
    if (!this.projectileEntity) {
      this._createProjectile();
    }

    const pos = this.player.entity.getPosition();
    let target;
    if (this.player.intersectionPlayer && this.player.intersectionPlayer.x !== undefined) {
      target = this.player.intersectionPlayer;
    } else {
      const camDir = cameraComponent.camera.node.forward;
      target = new Vec3(camDir.x * 10, pos.y, camDir.z * 10);
    }

    const forward = new Vec3(
      target.x - pos.x,
      0,
      target.z - pos.z
    ).normalize();
    const startPos = new Vec3(
      pos.x + forward.x * 0.3,
      pos.y,
      pos.z + forward.z * 0.3
    );

    // Pre-create trail particles
    while (this.trailParticles.length < this.maxTrailLength) {
      this.trailParticles.push(this._createTrailParticle());
    }

    this.projectileEntity.setPosition(startPos);
    this.projectileEntity.enabled = true;

    this.projectileStartPos = new Vec3(startPos.x, startPos.y, startPos.z);
    this.projectileDir = new Vec3(forward.x, forward.y, forward.z);
    this.projectileTraveled = 0;
    this.spawnPositions = [];
    this.spawnIndex = 0;

    for (const p of this.trailParticles) {
      p.enabled = false;
    }
  }

  update(dt) {
    super.update(dt);

    if (this.projectileEntity && this.projectileEntity.enabled) {
      this.projectileTraveled += this.projectileSpeed * dt;

      const px = this.projectileStartPos.x + this.projectileDir.x * this.projectileTraveled;
      const py = this.projectileStartPos.y;
      const pz = this.projectileStartPos.z + this.projectileDir.z * this.projectileTraveled;

      // Add new spawn position
      if (this.spawnPositions.length < this.maxTrailLength) {
        this.spawnPositions.push({ x: px, y: py, z: pz });
      }

      // Update trail particles
      for (let i = 0; i < this.spawnPositions.length; i++) {
        const p = this.trailParticles[i];
        if (!p) continue;
        p.enabled = true;

        const age = this.spawnPositions.length - i;
        const lifeRatio = Math.max(0, 1 - age / this.maxTrailLength);

        if (!p._vel) {
          p._vel = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
          };
        }

        if (!p._velocity) p._velocity = 1;
        p._velocity *= 0.96;

        const speed = lifeRatio * lifeRatio * 0.5 * p._velocity;
        p._vel.x += (Math.random() - 0.5) * 0.1;
        p._vel.y += (Math.random() - 0.5) * 0.1;
        p._vel.z += (Math.random() - 0.5) * 0.1;
        const fx = p._vel.x * speed;
        const fy = p._vel.y * speed;
        const fz = p._vel.z * speed;

        const nx = this.spawnPositions[i].x + fx;
        const ny = this.spawnPositions[i].y + fy;
        const nz = this.spawnPositions[i].z + fz;
        p.setPosition(nx, ny, nz);

        const alpha = lifeRatio * 0.8;
        const scale = 0.04 * lifeRatio;

        if (p.render.material) {
          p.render.material.diffuse = new Color(0, alpha, alpha);
          p.render.material.emissive = new Color(0, alpha * 0.4, alpha * 0.4);
          p.render.material.update();
        }
        p.setLocalScale(scale, scale, scale);
      }

      if (this.projectileTraveled >= this.maxReach) {
        this.projectileEntity.enabled = false;
        for (const p of this.trailParticles) p.enabled = false;
        this.spawnPositions = [];
        this.projectileTraveled = 0;
      } else {
        this.projectileEntity.setPosition(px, py, pz);
      }
    }
  }

  onRemove() {
    if (this.projectileEntity && this.projectileEntity.parent) {
      this.projectileEntity.parent.removeChild(this.projectileEntity);
    }
    if (this.projectileEntity) {
      this.projectileEntity.destroy();
    }
    this.projectileEntity = null;

    for (const p of this.trailParticles) {
      if (p.parent) p.parent.removeChild(p);
      delete p._vel;
      delete p._velocity;
      p.destroy();
    }
    this.trailParticles = [];
    this.spawnPositions = [];
  }
}
