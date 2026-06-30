import { Entity, Color, StandardMaterial, Vec3, Ray, Quat, BlendFactor } from 'playcanvas';

class Projectile {
  constructor(app, start, direction) {
    this.app = app;
    this.life = 0;
    this.maxLife = 0.4;
    this.speed = 10;
    this.traveled = 0;
    this.maxDistance = 3;
    this.alive = true;

    this.entity = new Entity('projectile');
    this.entity.addComponent('render', { type: 'sphere', segmentAxis: 'y' });
    this.entity.setLocalScale(0.08, 0.08, 0.08);

    const mat = new StandardMaterial();
    mat.emissive = new Color(1, 0.8, 0.2);
    mat.emissiveIntensity = 2;
    mat.diffuse = new Color(1, 0.5, 0);
    mat.update();
    this.entity.render.material = mat;

    this.entity.setPosition(start);
    this.direction = direction;
    this.app.root.addChild(this.entity);

    this.particles = [];
  }

  update(dt) {
    if (!this.alive) return;

    const move = this.speed * dt;
    this.entity.setPosition(
      this.entity.getPosition().x + this.direction.x * move,
      this.entity.getPosition().y + this.direction.y * move,
      this.entity.getPosition().z + this.direction.z * move
    );
    this.traveled += move;
    this.life += dt;

    const scale = 1 - this.life / this.maxLife;
    this.entity.setLocalScale(0.08 * scale, 0.08 * scale, 0.08 * scale);

    if (this.particles.length > 0) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          p.entity.destroy();
          this.particles.splice(i, 1);
        } else {
          const alpha = p.life / p.maxLife;
          p.material.opacity = alpha;
          p.scale = alpha;
        }
      }
    }

    if (this.traveled >= this.maxDistance || this.life >= this.maxLife) {
      this.explode();
      this.alive = false;
    }
  }

  spawnParticle() {
    const pos = this.entity.getPosition();
    const particle = new Entity();
    particle.addComponent('render', { type: 'sphere' });
    particle.setLocalScale(0.03, 0.03, 0.03);

    const mat = new StandardMaterial();
    mat.blend = true;
    mat.opacity = 1;
    mat.emissive = new Color(1, 0.6 + Math.random() * 0.4, 0);
    mat.emissiveIntensity = 1.5;
    mat.update();
    particle.render.material = mat;

    particle.setPosition(
      pos.x + (Math.random() - 0.5) * 0.1,
      pos.y + (Math.random() - 0.5) * 0.1,
      pos.z + (Math.random() - 0.5) * 0.1
    );

    particle.life = 0.3;
    particle.maxLife = 0.3;
    particle.material = mat;
    particle.scale = 1;

    this.app.root.addChild(particle);
    this.particles.push(particle);
  }

  explode() {
    for (let i = 0; i < 8; i++) {
      this.spawnParticle();
    }
    this.entity.destroy();
  }

  destroy() {
    this.entity.destroy();
    this.particles.forEach(p => p.destroy());
  }
}

export class Player {
  constructor(app, canvas, cameraComponent) {
    this.app = app;
    this.canvas = canvas;
    this.cameraComponent = cameraComponent;
    this.speed = 5;
    this.lerpFactor = 8;
    this.targetPos = null;
    this.ray = new Ray();
    this.intersection = new Vec3();

    this.entity = new Entity('player');
    this.entity.addComponent('render', { type: 'box' });

    const material = new StandardMaterial();
    material.diffuse = new Color(1, 0, 0);
    material.update();
    this.entity.render.material = material;
    
    this.entity.setPosition(0, -0.20, 0);
    this.entity.setLocalScale(0.5, 0.5, 0.5);

    app.root.addChild(this.entity);

    this.keys = {};
    window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);

    this.projectiles = [];

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.shoot();
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.raycastToPlane(e);
    });
  }

  raycastToPlane(e) {
    const camera = this.cameraComponent.camera;
    const rect = this.canvas.getBoundingClientRect();
    const from = new Vec3();
    const to = new Vec3();
    camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top, camera.nearClip, rect.width, rect.height, from);
    camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top, camera.farClip, rect.width, rect.height, to);

    this.ray.origin.copy(from);
    this.ray.direction.sub(to, from).normalize();

    const planeY = -0.5;
    if (Math.abs(this.ray.direction.y) > 0.001) {
      const t = (planeY - this.ray.origin.y) / this.ray.direction.y;
      this.intersection.copy(this.ray.origin).addScaled(this.ray.direction, t);
      console.log('Ray cast intersection:', this.intersection);
    }
  }

 update(dt) {
    if (!this.targetPos) {
      this.targetPos = this.entity.getPosition().clone();
    }

    const pos = this.entity.getPosition();
    const lookTarget = new Vec3(this.intersection.x, pos.y, this.intersection.z);

    const cameraEntity = this.cameraComponent.camera.node;
    const cameraForward = cameraEntity.forward.clone();
    cameraForward.y = 0;
    cameraForward.normalize();
    
    const cameraRight = new Vec3(-cameraForward.z, 0, cameraForward.x);
    cameraRight.normalize();

    const moveX = (this.keys['d'] ? 1 : 0) - (this.keys['a'] ? 1 : 0);
    const moveZ = (this.keys['w'] ? 1 : 0) - (this.keys['s'] ? 1 : 0);

    if (moveX !== 0 || moveZ !== 0) {
      const moveDir = new Vec3(
        cameraForward.x * moveZ + cameraRight.x * moveX,
        0,
        cameraForward.z * moveZ + cameraRight.z * moveX
      ).normalize();

      const playerForward = new Vec3(lookTarget.x - pos.x, 0, lookTarget.z - pos.z).normalize();
      const alignment = moveDir.x * playerForward.x + moveDir.z * playerForward.z;
      const speedMultiplier = 0.75 + 0.25 * alignment;

      this.targetPos.x += moveDir.x * this.speed * speedMultiplier * dt;
      this.targetPos.z += moveDir.z * this.speed * speedMultiplier * dt;
    }

    const alpha = 1 - Math.exp(-this.lerpFactor * dt);
    pos.x += (this.targetPos.x - pos.x) * alpha;
    pos.y += (this.targetPos.y - pos.y) * alpha;
    pos.z += (this.targetPos.z - pos.z) * alpha;
    this.entity.setPosition(pos);

    this.entity.lookAt(lookTarget);

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      p.spawnParticle();
      if (!p.alive) {
        p.destroy();
        this.projectiles.splice(i, 1);
      }
    }
  }

  shoot() {
    const pos = this.entity.getPosition();
    const forward = new Vec3(0, 0, -1);
    forward.applyQuaternion(this.entity.getWorldQuat());
    forward.y = 0.2;
    forward.normalize();

    const startPos = new Vec3(
      pos.x + forward.x * 0.3,
      pos.y + 0.1,
      pos.z + forward.z * 0.3
    );

    const proj = new Projectile(this.app, startPos, forward);
    this.projectiles.push(proj);
  }
}
