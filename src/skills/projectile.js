import { Skill } from '../skill.js';
import { Entity, Color, StandardMaterial, Vec3 } from 'playcanvas';

export class ProjectileSkill extends Skill {
  constructor(app, player) {
    super(app);
    this.player = player;

    this.maxCooldown = .2;
    this.projectileSpeed = 15;
    this.maxReach = 4;

    this.projectileEntity = null;
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

    this.projectileEntity.setPosition(startPos);
    this.projectileEntity.enabled = true;
    this.projectileStartPos = startPos.clone();
    this.projectileDir = forward.clone();
    this.projectileTraveled = 0;
  }

  update(dt) {
    super.update(dt);

    if (this.projectileEntity && this.projectileEntity.enabled) {
      this.projectileTraveled += this.projectileSpeed * dt;

      if (this.projectileTraveled >= this.maxReach) {
        this.projectileEntity.enabled = false;
        this.projectileTraveled = 0;
      } else {
        this.projectileEntity.setPosition(
          this.projectileStartPos.x + this.projectileDir.x * this.projectileTraveled,
          this.projectileStartPos.y,
          this.projectileStartPos.z + this.projectileDir.z * this.projectileTraveled
        );
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
  }
}
