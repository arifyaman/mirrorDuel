import { Entity, Color, StandardMaterial, Vec3, Ray } from 'playcanvas';
import { ProjectileSkill } from './skills/projectile.js';
import { parseYaml } from './config.js';
import { SkillHud } from './ui/skillHud.js';

let cachedConfig = null;

async function loadConfig() {
  if (cachedConfig) return cachedConfig;
  try {
    const res = await fetch('src/config.yaml');
    const text = await res.text();
    cachedConfig = parseYaml(text);
  } catch (e) {
    console.warn('Failed to load config.yaml:', e);
    cachedConfig = {};
  }
  return cachedConfig;
}

export class Player {
 constructor(app, canvas, cameraComponent) {
    this.app = app;
    this.canvas = canvas;
    this.cameraComponent = cameraComponent;
    this.speed = 5;
    this.lerpFactor = 8;
    this.targetPos = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.skills = [];
    this.skillHud = new SkillHud(this);

    this.entity = new Entity('player');
    this.entity.addComponent('render', { type: 'box' });

    const material = new StandardMaterial();
    material.diffuse = new Color(1, 0, 0);
    material.castShadows = true;
    material.receiveShadows = true;
    material.update();
    this.entity.render.material = material;
    this.entity.render.material.update();
    
    this.entity.setPosition(0, -0.20, 0);
    this.entity.setLocalScale(0.5, 0.5, 0.5);

    const stripMaterial = new StandardMaterial();
    stripMaterial.diffuse = new Color(0, 1, 0);
    stripMaterial.castShadows = true;
    stripMaterial.receiveShadows = true;
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
    projectileMaterial.castShadows = true;
    projectileMaterial.receiveShadows = true;
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

  }

  async addSkill(skill) {
    this.skills.push(skill);
    if (skill instanceof ProjectileSkill) {
      const config = await loadConfig();
      const proj = config.skills?.projectile;
      if (proj) {
        skill.maxCooldown = proj.cooldown ?? skill.maxCooldown;
        skill.projectileSpeed = proj.projectileSpeed ?? skill.projectileSpeed;
        skill.maxReach = proj.maxReach ?? skill.maxReach;
        skill.maxBurstParticles = proj.maxBurstParticles ?? skill.maxBurstParticles;
        skill.burstSpeed = proj.burstSpeed ?? skill.burstSpeed;
        skill.burstDuration = proj.burstDuration ?? skill.burstDuration;
      }
    }
    this.skillHud.init();
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
        skill.activate();
        break;
      }
    }
  }

  update(dt) {
    if (!this.targetPos) {
      this.targetPos = this.entity.getPosition().clone();
    }

    const pos = this.entity.getPosition();
    const lookTarget = new Vec3(this.mouseX, pos.y, this.mouseY);
    this.intersection.copy(lookTarget);

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

      this.targetPos.x += moveDir.x * this.speed * dt;
      this.targetPos.z += moveDir.z * this.speed * dt;
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

    this.skillHud.update(dt);
  }
}
