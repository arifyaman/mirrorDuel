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
    this.burstParticles = [];
    this.maxBurstParticles = 20;
    this.burstSpeed = 8;
    this.burstDuration = 1.5;
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

  _createBurstParticle() {
    const material = new StandardMaterial();
    material.diffuse = new Color(0, 1, 1);
    material.emissive = new Color(0, 0.5, 0.5);
    material.update();

    const particle = new Entity('burstParticle');
    particle.addComponent('render', { type: 'box' });
    particle.setLocalScale(0.05, 0.05, 0.05);
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

    // Pre-create burst particles
    while (this.burstParticles.length < this.maxBurstParticles) {
      this.burstParticles.push(this._createBurstParticle());
    }

    this.projectileEntity.setPosition(startPos);
    this.projectileEntity.enabled = true;

    this.projectileStartPos = new Vec3(startPos.x, startPos.y, startPos.z);
    this.projectileDir = new Vec3(forward.x, forward.y, forward.z);
    this.projectileTraveled = 0;

    // Reset and set all particles to spawn from the same point
      for (let i = 0; i < this.burstParticles.length; i++) {
        const p = this.burstParticles[i];
        p.enabled = true;
        p.setPosition(startPos.x, startPos.y, startPos.z);

        // Bias velocity toward projectile direction with randomness
        const spread = 0.2;
        const rx = (Math.random() - 0.5) * 2;
        const ry = (Math.random() - 0.5) * 2;
        const rz = (Math.random() - 0.5) * 2;

        p._vel = {
          x: this.projectileDir.x * (1 - spread) + rx * spread,
          y: this.projectileDir.y * (1 - spread) + ry * spread,
          z: this.projectileDir.z * (1 - spread) + rz * spread
        };

        // Normalize velocity to get pure direction
        const len = Math.sqrt(p._vel.x * p._vel.x + p._vel.y * p._vel.y + p._vel.z * p._vel.z);
        if (len > 0) {
          p._vel.x /= len;
          p._vel.y /= len;
          p._vel.z /= len;
        }

        // Each particle has slightly different speed and life
        p._speed = this.burstSpeed * (0.5 + Math.random() * 0.5);
        p._life = 0;
        p._maxLife = this.burstDuration * (0.5 + Math.random() * 0.5);

        p.render.material.diffuse = new Color(0, 0.8, 0.8);
        p.render.material.emissive = new Color(0, 0.4, 0.4);
        p.render.material.update();
        p.setLocalScale(0.05, 0.05, 0.05);
      }
  }

  update(dt) {
    super.update(dt);

    // Update burst particles (runs even when projectile is dead)
    for (let i = 0; i < this.burstParticles.length; i++) {
      const p = this.burstParticles[i];
      p._life = (p._life || 0) + dt;

      if (p._life >= p._maxLife) {
        p.enabled = false;
        continue;
      }

      const lifeRatio = 1 - p._life / p._maxLife;

      // Slow down over time
      const currentSpeed = p._speed * (lifeRatio * lifeRatio);

      // Move particle
      const pos = p.getPosition();
      const nx = pos.x + p._vel.x * currentSpeed * dt;
      const ny = pos.y + p._vel.y * currentSpeed * dt;
      const nz = pos.z + p._vel.z * currentSpeed * dt;
      p.setPosition(nx, ny, nz);

      // Fade and shrink
      const alpha = lifeRatio * 0.8;
      const scale = 0.05 * lifeRatio;

      if (p.render.material) {
        p.render.material.diffuse = new Color(0, alpha, alpha);
        p.render.material.emissive = new Color(0, alpha * 0.4, alpha * 0.4);
        p.render.material.update();
      }
      p.setLocalScale(scale, scale, scale);
    }

    // Update projectile
    if (this.projectileEntity && this.projectileEntity.enabled) {
      this.projectileTraveled += this.projectileSpeed * dt;

      const px = this.projectileStartPos.x + this.projectileDir.x * this.projectileTraveled;
      const py = this.projectileStartPos.y;
      const pz = this.projectileStartPos.z + this.projectileDir.z * this.projectileTraveled;

      if (this.projectileTraveled >= this.maxReach) {
        this.projectileEntity.enabled = false;
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

    for (const p of this.burstParticles) {
      if (p.parent) p.parent.removeChild(p);
      p.destroy();
    }
    this.burstParticles = [];
  }
}
