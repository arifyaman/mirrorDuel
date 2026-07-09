import { Color, Entity, StandardMaterial } from 'playcanvas';

const DT = 0.01667;

export function applyProjectilesLogic(physics, projectiles) {
  const serverProjIds = new Set(projectiles.map(p => p.id));

  for (const proj of projectiles) {
    let data = physics.projectileEntities.get(proj.id);
    if (!data) {
      const { entity, lightEntity } = createGlowingProjectile(physics, proj.id);
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
      physics.projectileEntities.set(proj.id, data);
    }
    data.entity.setPosition(data.startX, data.startY, data.startZ);
    data.entity.enabled = true;
  }

  const toRemove = [];
  for (const [id] of physics.projectileEntities) {
    if (!serverProjIds.has(id)) {
      toRemove.push(id);
    }
  }
  for (const id of toRemove) {
    destroyProjectile(physics, id);
  }
}

export function updateProjectiles(physics) {
  for (const data of physics.projectileEntities.values()) {
    const elapsed = physics.simTime - data.spawnTime;
    if (elapsed < 0) continue;
    const traveled = elapsed * data.speed;
    if (traveled >= data.maxReach) continue;
    const px = data.startX + data.dirX * elapsed * data.speed;
    const py = data.startY;
    const pz = data.startZ + data.dirZ * elapsed * data.speed;
    data.entity.setPosition(px, py, pz);
    data.lightEntity.setPosition(px, py + 0.15, pz);
  }
}

export function destroyProjectile(physics, id) {
  const data = physics.projectileEntities.get(id);
  if (data) {
    if (data.entity.parent) data.entity.parent.removeChild(data.entity);
    data.entity.destroy();
    physics.projectileEntities.delete(id);
  }
}

export function cleanupProjectiles(physics) {
  for (const [id] of physics.projectileEntities) {
    destroyProjectile(physics, id);
  }
}

function createGlowingProjectile(physics, id) {
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
    type: 'omni',
    color: new Color(0.3, 1.0, 1.0),
    intensity: 5,
    range: 0.8,
    shadow: false
  });
  lightEntity.setPosition(0, 0.15, 0);
  entity.addChild(lightEntity);

  physics.app.root.addChild(entity);
  return { entity, lightEntity };
}
