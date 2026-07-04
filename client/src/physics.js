import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

const DT = 0.01667;

export class Physics {
  constructor(app) {
    this.simTime = 0;
    this.playerEntities = new Map();
    this.indicatorEntities = new Map();
    this.playerLights = new Map();
    this.projectileEntities = new Map();
    this.app = app;
  }

  applySnapshot(players, projectiles) {
    this.applyPlayers(players);
    this.applyProjectiles(projectiles);
  }

  applyPlayers(players) {
    const colors = {
      1: { diffuse: new Color(1, 0.2, 0.2), emissive: new Color(1, 0.1, 0.05), light: new Color(1, 0.3, 0.2) },
      2: { diffuse: new Color(0.2, 0.2, 1), emissive: new Color(0.05, 0.05, 1), light: new Color(0.2, 0.3, 1) }
    };

    for (const p of players) {
      let entity = this.playerEntities.get(p.id);
      if (!entity) {
        const col = colors[p.id] || { diffuse: new Color(0.5, 0.5, 0.5), emissive: new Color(0.2, 0.2, 0.2), light: new Color(0.5, 0.5, 0.5) };
        entity = this.createGlowingPlayer(p.id, col.diffuse, col.emissive, col.light);
        entity.enabled = false;
      }

      // Bright pulsing emissive for player
      const mat = entity.render.material;
      mat.emissiveIntensity = 1.5;
      mat.update();

      // Edge overlay even brighter
      const edges = entity.children.find(c => c.name.startsWith('edges'));
      if (edges && edges.render) {
        edges.render.material.emissiveIntensity = 2.0;
        edges.render.material.update();
      }

      entity.setPosition(p.x, p.y, p.z);
      const angleDeg = (typeof p.angle === 'number' && !isNaN(p.angle)) ? (p.angle + Math.PI) * (180 / Math.PI) : 0;
      entity.setEulerAngles(0, angleDeg, 0);
      entity.enabled = true;

      // Update point light position
      const light = this.playerLights.get(p.id);
      if (light) {
        light.setPosition(p.x, p.y + 0.8, p.z);
      }

      const indicator = this.indicatorEntities.get(p.id);
      if (indicator) {
        indicator.enabled = true;
        const indMat = indicator.render.material;
        indMat.emissive = new Color(0.0, 1.0, 0.4);
        indMat.emissiveIntensity = 1.5;
        indMat.update();
      }
    }
  }

  applyProjectiles(projectives) {
    const serverProjIds = new Set(projectives.map(p => p.id));

    for (const proj of projectives) {
      let data = this.projectileEntities.get(proj.id);
      if (!data) {
        const { entity, lightEntity } = this.createGlowingProjectile(proj.id);
        data = {
          entity,
          lightEntity,
          spawnTime: proj.spawnTick * DT,
          startX: proj.startX,
          startY: proj.y,
          startZ: proj.startZ,
          dirX: proj.dirX,
          dirZ: proj.dirZ,
          speed: proj.speed,
          maxReach: proj.maxReach
        };
        this.projectileEntities.set(proj.id, data);
      }
      data.entity.setPosition(data.startX, data.startY, data.startZ);
      data.entity.enabled = true;
    }

    const toRemove = [];
    for (const [id] of this.projectileEntities) {
      if (!serverProjIds.has(id)) {
        toRemove.push(id);
      }
    }
    for (const id of toRemove) {
      this.destroyProjectile(id);
    }
  }

  createGlowingPlayer(id, color, emissiveColor, lightColor) {
    const entity = new Entity('player' + id);
    entity.addComponent('render', { type: 'box' });
    const material = new StandardMaterial();
    material.diffuse = color;
    material.emissive = emissiveColor;
    material.emissiveIntensity = 1.5;
    material.roughness = 0.2;
    material.metalness = 0.8;
    material.castShadows = true;
    material.receiveShadows = true;
    material.update();
    entity.render.material = material;
    entity.setLocalScale(0.5, 0.5, 0.5);

    // Outer glow layer (slightly larger, brighter)
    const glow = new Entity('glow' + id);
    const glowRender = glow.addComponent('render', { type: 'box' });
    const glowMat = new StandardMaterial();
    glowMat.diffuse = emissiveColor;
    glowMat.emissive = emissiveColor;
    glowMat.emissiveIntensity = 3.0;
    glowMat.opacity = 0.6;
    glowMat.blendType = 2;
    glowMat.alphaWrite = false;
    glowMat.update();
    glowRender.material = glowMat;
    glow.setLocalScale(0.65, 0.65, 0.65);

    entity.addChild(glow);

    // Inner bright edge (wireframe-like overlay)
    const edges = new Entity('edges' + id);
    const edgeRender = edges.addComponent('render', { type: 'box' });
    const edgeMat = new StandardMaterial();
    edgeMat.diffuse = emissiveColor;
    edgeMat.emissive = emissiveColor;
    edgeMat.emissiveIntensity = 2.0;
    edgeMat.update();
    edgeRender.material = edgeMat;
    edges.setLocalScale(0.52, 0.52, 0.52);

    entity.addChild(edges);

    // Green forward indicator (bright glowing)
    const indicator = new Entity('indicator' + id);
    indicator.addComponent('render', { type: 'box' });
    const indMat = new StandardMaterial();
    indMat.diffuse = new Color(0.0, 1.0, 0.3);
    indMat.emissive = new Color(0.0, 1.0, 0.4);
    indMat.emissiveIntensity = 1.5;
    indMat.update();
    indicator.render.material = indMat;
    indicator.setLocalScale(1.1, 1.1, 0.2);
    indicator.setPosition(0, 0, -0.3);
    indicator.enabled = false;

    entity.addChild(indicator);

    // Real point light that illuminates the floor
    const lightEntity = new Entity('pointLight' + id);
    lightEntity.addComponent('light', {
      type: 'point',
      color: lightColor,
      intensity: 3.0,
      range: 6,
      shadow: false
    });
    lightEntity.setPosition(0, 0.8, 0);
    entity.addChild(lightEntity);

    this.app.root.addChild(entity);
    this.playerEntities.set(id, entity);
    this.indicatorEntities.set(id, indicator);
    this.playerLights.set(id, lightEntity);
    return entity;
  }

  createGlowingProjectile(id) {
    const entity = new Entity('proj' + id);
    entity.addComponent('render', { type: 'sphere' });
    const mat = new StandardMaterial();
    mat.diffuse = new Color(0.2, 1, 1);
    mat.emissive = new Color(0.0, 0.8, 0.8);
    mat.emissiveIntensity = 1.2;
    mat.roughness = 0.2;
    mat.metalness = 0.8;
    mat.update();
    entity.render.material = mat;
    entity.setLocalScale(0.16, 0.16, 0.16);

    // Intense point light for projectile glow
    const lightEntity = new Entity('projLight' + id);
    lightEntity.addComponent('light', {
      type: 'point',
      color: new Color(0.3, 1.0, 1.0),
      intensity: 25,
      range: 0.8,
      shadow: false
    });
    lightEntity.setPosition(0, 0.15, 0);
    entity.addChild(lightEntity);

    this.app.root.addChild(entity);
    return { entity, lightEntity };
  }

  destroyProjectile(id) {
    const data = this.projectileEntities.get(id);
    if (data) {
      if (data.entity.parent) data.entity.parent.removeChild(data.entity);
      data.entity.destroy();
      this.projectileEntities.delete(id);
    }
  }

  cleanupPlayerEntities() {
    for (const [, entity] of this.playerEntities) {
      if (entity.parent) entity.parent.removeChild(entity);
      entity.destroy();
    }
    this.playerEntities.clear();
    this.indicatorEntities.clear();
    this.playerLights.clear();
    for (const [id] of this.projectileEntities) {
      this.destroyProjectile(id);
    }
  }

  updateProjectiles() {
    for (const data of this.projectileEntities.values()) {
      const elapsed = this.simTime - data.spawnTime;
      if (elapsed < 0) continue;
      const traveled = elapsed * data.speed;
      if (traveled >= data.maxReach) continue;
      const px = data.startX + data.dirX * elapsed * data.speed;
      const py = data.startY;
      const pz = data.startZ + data.dirZ * elapsed * data.speed;
      data.entity.setPosition(px, py, pz);
      if (data.lightEntity) {
        data.lightEntity.setPosition(px, py + 0.15, pz);
      }
    }
  }
}
