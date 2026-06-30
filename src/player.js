import { Entity, Color, StandardMaterial, Vec3, Ray } from 'playcanvas';

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

    if (this.keys['w']) this.targetPos.z -= this.speed * dt;
    if (this.keys['s']) this.targetPos.z += this.speed * dt;
    if (this.keys['a']) this.targetPos.x -= this.speed * dt;
    if (this.keys['d']) this.targetPos.x += this.speed * dt;

    const pos = this.entity.getPosition();
    const alpha = 1 - Math.exp(-this.lerpFactor * dt);
    pos.x += (this.targetPos.x - pos.x) * alpha;
    pos.y += (this.targetPos.y - pos.y) * alpha;
    pos.z += (this.targetPos.z - pos.z) * alpha;
    this.entity.setPosition(pos);

    const lookTarget = new Vec3(this.intersection.x, pos.y, this.intersection.z);
    this.entity.lookAt(lookTarget);
  }
}
