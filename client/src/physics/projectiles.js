import { Color, Entity, ShaderMaterial, StandardMaterial, BLEND_ADDITIVE, BLEND_NORMAL, CULLFACE_BACK, SEMANTIC_POSITION, SEMANTIC_NORMAL } from 'playcanvas';
import { spawnFireTrailSegment, spawnFireSpark, spawnFireImpactBurst, clearFireParticles } from './effects.js';

const DT = 0.01667;
const TRAIL_INTERVAL = 0.028; // seconds of flight time between trail segment spawns
const SPARK_INTERVAL = 0.07; // seconds of flight time between spark spawns

const FIRE_CORE_PALETTE = {
  1: {
    core: [3.0, 2.5, 1.7],
    edge: [2.4, 0.35, 0.12],
    aura: new Color(1, 0.35, 0.12),
    light: new Color(1, 0.4, 0.15)
  },
  2: {
    core: [2.1, 2.4, 3.0],
    edge: [0.25, 0.45, 2.4],
    aura: new Color(0.3, 0.5, 1),
    light: new Color(0.3, 0.5, 1)
  }
};

function corePalette(ownerId) {
  return FIRE_CORE_PALETTE[ownerId] || FIRE_CORE_PALETTE[1];
}

export function applyProjectilesLogic(physics, projectiles) {
  const serverProjIds = new Set(projectiles.map(p => p.id));

  for (const proj of projectiles) {
    let data = physics.projectileEntities.get(proj.id);
    if (!data) {
      const ownerId = proj.ownerId || 1;
      const { entity, lightEntity, mat, seed } = createFireballCore(physics, proj.id, ownerId);
      data = {
        entity,
        lightEntity,
        mat,
        seed,
        ownerId,
        spawnTime: proj.spawnTick * DT,
        startX: proj.startX,
        startY: proj.y,
        startZ: proj.startZ,
        dirX: proj.dirX,
        dirZ: proj.dirZ,
        speed: proj.speed,
        maxReach: proj.maxReach,
        lastTrailElapsed: -TRAIL_INTERVAL,
        lastSparkElapsed: -SPARK_INTERVAL
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
    const data = physics.projectileEntities.get(id);
    if (data) {
      const pos = data.entity.getPosition();
      spawnFireImpactBurst(physics, data.ownerId, pos.x, pos.y, pos.z);
    }
    destroyProjectile(physics, id);
  }
}

export function updateProjectiles(physics, cameraPos) {
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

    // Flicker / pulse on the shader core
    if (data.mat) {
      data.mat.setParameter('uTime', elapsed);
      if (cameraPos) {
        data.mat.setParameter('uCameraPos', [cameraPos.x, cameraPos.y, cameraPos.z]);
      }
    }

    // Spawn trail segments behind the fireball at fixed flight-time intervals
    if (elapsed - data.lastTrailElapsed >= TRAIL_INTERVAL) {
      data.lastTrailElapsed = elapsed;
      const backX = px - data.dirX * 0.12;
      const backZ = pz - data.dirZ * 0.12;
      spawnFireTrailSegment(physics, data.ownerId, backX, py, backZ);
    }

    // Spawn embers trickling off the fireball
    if (elapsed - data.lastSparkElapsed >= SPARK_INTERVAL) {
      data.lastSparkElapsed = elapsed;
      spawnFireSpark(physics, data.ownerId, px, py + 0.05, pz);
    }
  }
}

export function destroyProjectile(physics, id) {
  const data = physics.projectileEntities.get(id);
  if (data) {
    if (data.entity.parent) data.entity.parent.removeChild(data.entity);
    data.entity.destroy();
    if (data.mat) data.mat.destroy();
    physics.projectileEntities.delete(id);
  }
}

export function cleanupProjectiles(physics) {
  for (const [id] of physics.projectileEntities) {
    destroyProjectile(physics, id);
  }
  clearFireParticles(physics);
}

function createFireballCore(physics, id, ownerId) {
  const pal = corePalette(ownerId);
  const seed = Math.random() * 100;

  const entity = new Entity('proj' + id);
  entity.addComponent('render', { type: 'sphere' });
  const mat = createFireballShaderMaterial(pal.core, pal.edge, seed);
  entity.render.meshInstances[0].material = mat;
  entity.setLocalScale(0.18, 0.18, 0.18);

  // Soft additive aura layer behind the shader core for bloom spread
  const aura = new Entity('projAura' + id);
  aura.addComponent('render', { type: 'sphere' });
  const auraMat = new StandardMaterial();
  auraMat.diffuse = pal.aura;
  auraMat.emissive = pal.aura;
  auraMat.emissiveIntensity = 2.2;
  auraMat.opacity = 0.45;
  auraMat.blendType = BLEND_ADDITIVE;
  auraMat.alphaWrite = false;
  auraMat.useLighting = false;
  auraMat.update();
  aura.render.material = auraMat;
  aura.setLocalScale(1.8, 1.8, 1.8);
  entity.addChild(aura);

  // Intense point light for projectile glow, tinted per-player
  const lightEntity = new Entity('projLight' + id);
  lightEntity.addComponent('light', {
    type: 'omni',
    color: pal.light,
    intensity: 7,
    range: 1.2,
    shadow: false
  });
  lightEntity.setPosition(0, 0.15, 0);
  entity.addChild(lightEntity);

  physics.app.root.addChild(entity);
  return { entity, lightEntity, mat, seed };
}

function createFireballShaderMaterial(coreColor, edgeColor, seed) {
  const vshader = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;
    uniform mat3 matrix_normal;

    varying vec3 vNormalW;
    varying vec3 vPositionW;

    void main(void) {
      vec4 posW = matrix_model * vec4(aPosition, 1.0);
      vPositionW = posW.xyz;
      vNormalW = normalize(matrix_normal * aNormal);
      gl_Position = matrix_viewProjection * posW;
    }
  `;

  const fshader = `
    precision highp float;

    varying vec3 vNormalW;
    varying vec3 vPositionW;

    uniform vec3 uCameraPos;
    uniform float uTime;
    uniform float uSeed;
    uniform vec3 uColorCore;
    uniform vec3 uColorEdge;

    void main(void) {
      vec3 N = normalize(vNormalW);
      vec3 V = normalize(uCameraPos - vPositionW);
      float ndv = clamp(dot(N, V), 0.0, 1.0);
      float fresnel = pow(1.0 - ndv, 2.2);
      float hotspot = pow(ndv, 5.0);

      float flicker = 0.88 + 0.12 * sin(uTime * 26.0 + uSeed * 6.2831);
      float pulse = 0.93 + 0.07 * sin(uTime * 7.0 + uSeed * 3.0);

      vec3 col = mix(uColorEdge, uColorCore, hotspot);
      col += uColorCore * hotspot * 0.6 * flicker;
      col *= pulse;

      float alpha = clamp(0.82 + fresnel * 0.18, 0.0, 1.0);

      gl_FragColor = vec4(col, alpha);
    }
  `;

  const mat = new ShaderMaterial({
    uniqueName: 'fireballCore',
    attributes: { aPosition: SEMANTIC_POSITION, aNormal: SEMANTIC_NORMAL },
    vertexGLSL: vshader,
    fragmentGLSL: fshader,
  });
  mat.blendType = BLEND_NORMAL;
  mat.depthWrite = true;
  mat.cull = CULLFACE_BACK;
  mat.update();

  mat.setParameter('uTime', 0);
  mat.setParameter('uSeed', seed);
  mat.setParameter('uCameraPos', [0, 0, 0]);
  mat.setParameter('uColorCore', coreColor);
  mat.setParameter('uColorEdge', edgeColor);

  return mat;
}
