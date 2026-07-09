import { Entity, ShaderMaterial, BLEND_NORMAL, CULLFACE_NONE, SEMANTIC_POSITION, SEMANTIC_NORMAL } from 'playcanvas';

export function createShieldEntity(physics, id, color) {
  const vshader = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;
    uniform mat3 matrix_normal;

    varying vec3 vNormalW;
    varying vec3 vPositionW;
    varying vec3 vNormalObj;

    void main(void) {
        vec4 posW = matrix_model * vec4(aPosition, 1.0);
        vPositionW = posW.xyz;
        vNormalW = normalize(matrix_normal * aNormal);
        vNormalObj = normalize(aNormal);
        gl_Position = matrix_viewProjection * posW;
    }
  `;

  const fshader = `
    precision highp float;

    varying vec3 vNormalW;
    varying vec3 vPositionW;
    varying vec3 vNormalObj;

    uniform vec3 uColor;
    uniform vec3 uCameraPos;
    uniform float uTime;
    uniform float uHexScale;
    uniform float uLineWidth;
    uniform float uFresnelPower;
    uniform float uPulseSpeed;
    uniform float uHitTime;
    uniform vec3 uPlayerPos;
    uniform float uPlayerAngle;
    uniform float uConeAngle;
    uniform float uConeFrac;

    vec2 hexGrid(vec2 p) {
        const vec2 r = vec2(1.0, 1.7320508);
        vec2 h = r * 0.5;
        vec2 a = mod(p, r) - h;
        vec2 b = mod(p - h, r) - h;
        vec2 gv = dot(a, a) < dot(b, b) ? a : b;
        vec2 ag = abs(gv);
        float edgeDist = 0.5 - max(ag.x, ag.x * 0.5 + ag.y * 0.866);
        vec2 id = p - gv;
        float cellId = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
        return vec2(edgeDist, cellId);
    }

    void main(void) {
        vec3 N = normalize(vNormalW);
        vec3 V = normalize(uCameraPos - vPositionW);
        float ndv = abs(dot(N, V));
        float fresnel = pow(1.0 - ndv, uFresnelPower);

        vec2 hexUV = normalize(vNormalObj).xz * uHexScale + vec2(uTime * 0.3, uTime * 0.5);
        vec2 hg = hexGrid(hexUV);
        float edgeDist = hg.x;
        float cellId = hg.y;

        float hexLine = 1.0 - smoothstep(0.0, uLineWidth, edgeDist);
        float cellBright = mix(0.3, 1.0, cellId * 0.5 + 0.5);

        vec3 lineCol = uColor * 1.5;
        vec3 cellCol = uColor * cellBright * 0.4;
        vec3 baseCol = mix(cellCol, lineCol, hexLine);

        float pulse = 0.92 + 0.08 * sin(uTime * uPulseSpeed * 3.14159);

        float hitAge = uTime - uHitTime;
        float hitMask = step(0.0, hitAge) * step(hitAge, 1.2);
        float hitPulse = hitMask * (1.0 - hitAge / 1.2) * 1.5;

        vec3 rimColor = mix(uColor, vec3(1.0, 0.95, 0.98), 0.25) * (fresnel * 0.7 + hitPulse * 0.5);

        vec3 finalColor = baseCol * pulse + rimColor * 0.8;
        float alpha = clamp(hexLine * 0.6 + fresnel * 0.55 + hitPulse * 0.5 + 0.15, 0.0, 1.0);

        vec3 dir = normalize(vPositionW - uPlayerPos);
        vec2 dirXZ = normalize(dir.xz);
        vec2 facing = vec2(sin(uPlayerAngle), cos(uPlayerAngle));
        float dp = dot(dirXZ, facing);
        float coneDot = cos(uConeAngle);

        float cellJitter = (cellId - 0.5) * 0.15;
        float lineJitter = (1.0 - smoothstep(0.0, uLineWidth * 2.0, edgeDist)) * 0.06;
        float localCone = coneDot + cellJitter - lineJitter;

        float coneAlpha = smoothstep(localCone - 0.06, localCone + 0.06, dp);
        alpha *= coneAlpha * uConeFrac;
        if (alpha < 0.01) discard;

        gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const mat = new ShaderMaterial({
    uniqueName: 'voronoiShield_' + id,
    attributes: { aPosition: SEMANTIC_POSITION, aNormal: SEMANTIC_NORMAL },
    vertexGLSL: vshader,
    fragmentGLSL: fshader,
  });
  mat.blendType = BLEND_NORMAL;
  mat.depthWrite = false;
  mat.cull = CULLFACE_NONE;
  mat.update();

  const entity = new Entity('shield' + id);
  entity.addComponent('render', { type: 'sphere' });
  entity.render.meshInstances[0].material = mat;
  entity.setLocalScale(1.4, 1.4, 1.4);
  entity.enabled = false;
  physics.app.root.addChild(entity);

  mat.setParameter('uColor', color);
  mat.setParameter('uHexScale', 3.5);
  mat.setParameter('uLineWidth', 0.08);
  mat.setParameter('uFresnelPower', 2.5);
  mat.setParameter('uPulseSpeed', 0.5);
  mat.setParameter('uHitTime', -10);
  mat.setParameter('uConeAngle', 0);
  mat.setParameter('uConeFrac', 0);
  mat.setParameter('uPlayerAngle', 0);

  return { entity, mat, time: 0, shieldCooldown: 0, playerAngle: 0, playerPos: { x: 0, y: 0, z: 0 } };
}

export function updateAllShields(physics, dt, cameraPos) {
  const maxConeAngle = 50 * Math.PI / 180;
  const activeDuration = 1.0;
  const openDuration = 0.3;
  const closeDuration = 0.3;

  for (const [id, sd] of physics._playerShields) {
    sd.time += dt;
    if (!sd.active) {
      sd.entity.enabled = false;
      continue;
    }

    sd.entity.enabled = true;
    sd.entity.setPosition(sd.playerPos.x, sd.playerPos.y, sd.playerPos.z);

    const mat = sd.mat;
    mat.setParameter('uTime', sd.time);
    mat.setParameter('uCameraPos', [cameraPos.x, cameraPos.y, cameraPos.z]);
    mat.setParameter('uPlayerPos', [sd.playerPos.x, sd.playerPos.y, sd.playerPos.z]);
    mat.setParameter('uPlayerAngle', sd.playerAngle || 0);

    const t = (7 - sd.shieldCooldown) / activeDuration;
    let coneFrac;
    if (t < openDuration / activeDuration) {
      coneFrac = (t * activeDuration / openDuration);
      coneFrac = coneFrac * (2 - coneFrac);
    } else if (t > 1 - closeDuration / activeDuration) {
      const closeT = (t - (1 - closeDuration / activeDuration)) * activeDuration / closeDuration;
      coneFrac = 1 - Math.min(closeT, 1);
    } else {
      coneFrac = 1;
    }
    mat.setParameter('uConeAngle', coneFrac * maxConeAngle);
    mat.setParameter('uConeFrac', coneFrac);
  }
}

export function shieldHit(physics, playerId) {
  const sd = physics._playerShields.get(playerId);
  if (sd) {
    sd.mat.setParameter('uHitTime', sd.time);
  }
}

export function destroyShield(physics, id) {
  const shield = physics._playerShields.get(id);
  if (shield) {
    if (shield.entity.parent) shield.entity.parent.removeChild(shield.entity);
    shield.entity.destroy();
    physics._playerShields.delete(id);
  }
}
