import { Entity, Color, StandardMaterial, Vec3, Ray } from 'playcanvas';
import { ProjectileSkill } from './skills/projectile.js';

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
    this.intersectionPlayer = new Vec3();
    this.skills = [];

    this.entity = new Entity('player');
    this.entity.addComponent('render', { type: 'box' });

    const material = new StandardMaterial();
    material.diffuse = new Color(1, 0, 0);
    material.update();
    this.entity.render.material = material;
    this.entity.render.material.update();
    
    this.entity.setPosition(0, -0.20, 0);
    this.entity.setLocalScale(0.5, 0.5, 0.5);

    const stripMaterial = new StandardMaterial();
    stripMaterial.diffuse = new Color(0, 1, 0);
    stripMaterial.update();

    this.forwardStrip = new Entity('forwardStrip');
    this.forwardStrip.addComponent('render', { type: 'box' });
    this.forwardStrip.render.material = stripMaterial;
    this.forwardStrip.render.material.update();
    this.forwardStrip.setLocalScale(1.1, 1.1, 0.2);
    this.forwardStrip.setPosition(0, 0, -0.3);

    this.entity.addChild(this.forwardStrip);

    app.root.addChild(this.entity);

    // Create projectile entity during init
    const projectileMaterial = new StandardMaterial();
    projectileMaterial.diffuse = new Color(0, 1, 1);
    projectileMaterial.update();

    this.projectileEntity = new Entity('projectile');
    this.projectileEntity.addComponent('render', { type: 'box' });
    this.projectileEntity.setLocalScale(0.16, 0.16, 0.16);
    this.projectileEntity.render.material = projectileMaterial;
    this.projectileEntity.render.material.update();
    this.projectileEntity.enabled = false;
    app.root.addChild(this.projectileEntity);

    this.addSkill(new ProjectileSkill(app, this));

    this.keys = {};
    window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.tryActivateSkill();
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.raycastToPlane(e);
    });
  }

  addSkill(skill) {
    this.skills.push(skill);
  }

  removeSkill(skill) {
    const index = this.skills.indexOf(skill);
    if (index !== -1) {
      this.skills.splice(index, 1);
      skill.onRemove();
    }
  }

  tryActivateSkill() {
    for (const skill of this.skills) {
      if (skill.canActivate()) {
        skill.activate(this.projectileEntity, this.cameraComponent);
        break;
      }
    }
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
      this.intersectionPlayer.copy(this.intersection);
    }
  }

  update(dt) {
    if (!this.targetPos) {
      this.targetPos = this.entity.getPosition().clone();
    }

    const pos = this.entity.getPosition();
    const lookTarget = new Vec3(this.intersectionPlayer.x, pos.y, this.intersectionPlayer.z);

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

    for (const skill of this.skills) {
      skill.update(dt);
    }
  }
}
