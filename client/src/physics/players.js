import { Color, Entity, StandardMaterial, BLEND_ADDITIVE } from 'playcanvas';
import { createShieldEntity, destroyShield } from './shields.js';
import { createDashGhost } from './effects.js';
import { cleanupProjectiles } from './projectiles.js';

export function applyPlayersLogic(physics, players) {
  const colors = {
    1: { diffuse: new Color(1, 0.2, 0.2), emissive: new Color(1, 0.1, 0.05), light: new Color(1, 0.3, 0.2), lightIntensity: 3.0 },
    2: { diffuse: new Color(0.2, 0.2, 1), emissive: new Color(0.05, 0.05, 1), light: new Color(0.2, 0.3, 1), lightIntensity: 5.0 }
  };

  for (const p of players) {
    let entity = physics.playerEntities.get(p.id);
    if (!entity) {
      const col = colors[p.id] || { diffuse: new Color(0.5, 0.5, 0.5), emissive: new Color(0.2, 0.2, 0.2), light: new Color(0.5, 0.5, 0.5) };
      entity = createGlowingPlayer(physics, p.id, col.diffuse, col.emissive, col.light, col.lightIntensity);
      entity.enabled = false;
    }

    // Player hit flash
    const mat = entity.render.material;
    const flashStart = physics._playerFlash.get(p.id);
    const perfectFlashStart = physics._playerPerfectFlash.get(p.id);
    if (perfectFlashStart && (performance.now() - perfectFlashStart) < 400) {
      mat.emissive.set(0.2, 1.0, 0.8);
      mat.emissiveIntensity = 8.0;
    } else if (flashStart && (performance.now() - flashStart) < 250) {
      mat.emissiveIntensity = 5.0;
    } else {
      mat.emissiveIntensity = 1.5;
      const col = p.id === 1 ? [1, 0.2, 0.2] : [0.2, 0.2, 1];
      mat.emissive.set(col[0], col[1], col[2]);
      physics._playerFlash.delete(p.id);
      physics._playerPerfectFlash.delete(p.id);
    }
    mat.update();

    // Edge overlay even brighter
    const edges = entity.children.find(c => c.name.startsWith('edges'));
    if (edges && edges.render) {
      edges.render.material.emissiveIntensity = 2.0;
      edges.render.material.update();
    }

    entity.setPosition(p.x, p.y, p.z);

    const bounce = physics._hurtBounces.get(p.id);
    if (bounce) {
      entity.setPosition(p.x, p.y + bounce.offset, p.z);
    }
    const angleDeg = (typeof p.angle === 'number' && !isNaN(p.angle)) ? (p.angle + Math.PI) * (180 / Math.PI) : 0;
    entity.setEulerAngles(0, angleDeg, 0);
    entity.enabled = p.health > 0;

    // Update point light position
    const light = physics.playerLights.get(p.id);
    if (light) {
      light.setPosition(p.x, p.y + 0.8, p.z);
    }

    const indicator = physics.indicatorEntities.get(p.id);
    if (indicator) {
      indicator.enabled = true;
      const indMat = indicator.render.material;
      indMat.emissive = new Color(0.0, 1.0, 0.4);
      indMat.emissiveIntensity = 1.5;
      indMat.update();
    }

    // Dash ghost trail
    const prevPos = physics._prevPlayerPos.get(p.id);
    if (prevPos) {
      const dx = p.x - prevPos.x;
      const dz = p.z - prevPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > 0.28) {
        createDashGhost(physics, p.id, prevPos.x, prevPos.y, prevPos.z, p.angle);
      }
    }
    physics._prevPlayerPos.set(p.id, { x: p.x, y: p.y, z: p.z });

    // Shield visual per player
    const shieldColor = p.id === 1 ? [1.0, 0.3, 0.3] : [0.1, 0.5, 1.0];
    const activeWin = 7 - (p.shieldCooldown || 0);
    const shieldActive = p.health > 0 && p.shieldCooldown > 0 && activeWin < 1.0;
    let sd = physics._playerShields.get(p.id);

    if (shieldActive) {
      if (!sd) {
        sd = createShieldEntity(physics, p.id, shieldColor);
        physics._playerShields.set(p.id, sd);
      }
      sd.active = true;
      sd.shieldCooldown = p.shieldCooldown || 0;
      sd.playerAngle = p.angle || 0;
      sd.playerPos = { x: p.x, y: p.y, z: p.z };
    } else if (sd) {
      sd.active = false;
    }
  }

  // Destroy entities for players no longer in snapshot
  const activeIds = new Set(players.map(p => p.id));
  for (const [id] of physics.playerEntities) {
    if (!activeIds.has(id)) {
      destroyPlayerEntity(physics, id);
    }
  }
}

export function destroyPlayerEntity(physics, id) {
  const entity = physics.playerEntities.get(id);
  if (entity) {
    if (entity.parent) entity.parent.removeChild(entity);
    entity.destroy();
    physics.playerEntities.delete(id);
  }
  const indicator = physics.indicatorEntities.get(id);
  if (indicator) {
    if (indicator.parent) indicator.parent.removeChild(indicator);
    physics.indicatorEntities.delete(id);
  }
  const light = physics.playerLights.get(id);
  if (light) {
    if (light.parent) light.parent.removeChild(light);
    physics.playerLights.delete(id);
  }
  destroyShield(physics, id);
  physics._prevPlayerPos.delete(id);
  physics._playerFlash.delete(id);
}

export function cleanupPlayerEntities(physics) {
  for (const [, entity] of physics.playerEntities) {
    if (entity.parent) entity.parent.removeChild(entity);
    entity.destroy();
  }
  physics.playerEntities.clear();
  physics.indicatorEntities.clear();
  physics.playerLights.clear();
  cleanupProjectiles(physics);
}

function createGlowingPlayer(physics, id, color, emissiveColor, lightColor, lightIntensity) {
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
    type: 'omni',
    color: lightColor,
    intensity: lightIntensity || 3.0,
    range: 6,
    shadow: false
  });
  lightEntity.setPosition(0, 0.8, 0);
  entity.addChild(lightEntity);

  physics.app.root.addChild(entity);
  physics.playerEntities.set(id, entity);
  physics.indicatorEntities.set(id, indicator);
  physics.playerLights.set(id, lightEntity);
  return entity;
}
