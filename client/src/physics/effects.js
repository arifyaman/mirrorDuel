import { Color, Entity, ShaderMaterial, StandardMaterial, Vec3, BLEND_ADDITIVE, BLEND_NORMAL, CULLFACE_BACK, SEMANTIC_POSITION, SEMANTIC_TEXCOORD0, createMesh } from 'playcanvas';

export function updateExplosions(physics) {
  const now = performance.now();
  for (let i = physics._explosions.length - 1; i >= 0; i--) {
    const exp = physics._explosions[i];
    const elapsed = now - exp.startTime;
    if (elapsed >= exp.duration) {
      for (const p of exp.particles) {
        if (p.entity.parent) p.entity.parent.removeChild(p.entity);
        p.entity.destroy();
      }
      physics._explosions.splice(i, 1);
      continue;
    }
    const t = elapsed / exp.duration;
    const decay = 1 - t;
    for (const p of exp.particles) {
      if (elapsed > p.nextDirChange) {
        const jitter = 0.6 + Math.random() * 1.2;
        const theta2 = Math.random() * Math.PI * 2;
        const phi2 = Math.random() * Math.PI;
        p.vx += Math.sin(phi2) * Math.cos(theta2) * jitter;
        p.vy += Math.sin(phi2) * Math.sin(theta2) * jitter;
        p.vz += Math.cos(phi2) * jitter;
        p.nextDirChange = elapsed + 20 + Math.random() * 100;
      }
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vz *= 0.96;
      p.entity.translate(p.vx * 0.016, p.vy * 0.016, p.vz * 0.016);
      const s = p.initialScale * decay;
      p.entity.setLocalScale(s, s, s);
      const mat = p.entity.render.material;
      mat.opacity = decay;
      mat.emissiveIntensity = decay * 2.0;
      mat.update();
    }
  }
}

export function updateDashTrails(physics) {
  const now = performance.now();
  for (let i = physics._dashTrails.length - 1; i >= 0; i--) {
    const t = physics._dashTrails[i];
    const elapsed = now - t.createdAt;
    if (elapsed >= t.duration) {
      if (t.entity.parent) t.entity.parent.removeChild(t.entity);
      t.entity.destroy();
      physics._dashTrails.splice(i, 1);
      continue;
    }
    const alpha = 1 - elapsed / t.duration;
    const mat = t.entity.render.material;
    mat.opacity = alpha * 0.35;
    mat.emissiveIntensity = alpha * 1.5;
    mat.update();

    t.entity.translate(t.driftX * alpha * 0.016, t.driftY * alpha * 0.016, t.driftZ * alpha * 0.016);
    const s = 0.5 * (0.3 + alpha * 0.7);
    t.entity.setLocalScale(s, s, s);
  }
}

export function updateSlashes(physics, dt) {
  for (let i = physics._slashes.length - 1; i >= 0; i--) {
    const s = physics._slashes[i];
    s.elapsed += dt;
    s.mat.setParameter('uTime', s.elapsed);

    let sweep = s.elapsed < s.sweepDuration ? s.elapsed / s.sweepDuration : 1;
    let alpha = 1;
    if (s.elapsed > s.sweepDuration + s.holdDuration) {
      const fadeT = (s.elapsed - s.sweepDuration - s.holdDuration) / s.fadeDuration;
      alpha = 1 - Math.min(fadeT, 1);
    }
    s.mat.setParameter('uSweep', sweep);
    s.mat.setParameter('uAlpha', alpha);

    if (s.elapsed >= s.duration) {
      if (s.entity.parent) s.entity.parent.removeChild(s.entity);
      s.entity.destroy();
      s.mat.destroy();
      if (s.mesh) s.mesh.destroy();
      physics._slashes.splice(i, 1);
    }
  }
}

export function updateHurtBounces(physics, dt) {
  for (const [id, b] of physics._hurtBounces) {
    b.velocity -= 15.0 * dt;
    b.offset += b.velocity * dt;
    if (b.offset <= 0) {
      b.offset = 0;
      physics._hurtBounces.delete(id);
    }
  }
}

export function createExplosion(physics, x, y, z, hexColor) {
  const color = new Color(
    parseInt(hexColor.slice(1, 3), 16) / 255,
    parseInt(hexColor.slice(3, 5), 16) / 255,
    parseInt(hexColor.slice(5, 7), 16) / 255
  );
  const count = 24;
  const particles = [];
  for (let i = 0; i < count; i++) {
    const e = new Entity('explode');
    e.addComponent('render', { type: 'sphere' });
    const mat = new StandardMaterial();
    mat.diffuse = color;
    mat.emissive = color;
    mat.emissiveIntensity = 2.0;
    mat.opacity = 1;
    mat.blendType = 2;
    mat.alphaWrite = false;
    mat.update();
    e.render.material = mat;
    const scale = 0.05 + Math.random() * 0.15;
    e.setLocalScale(scale, scale, scale);
    e.setPosition(x + (Math.random() - 0.5) * 0.2, y + (Math.random() - 0.5) * 0.2, z + (Math.random() - 0.5) * 0.2);
    physics.app.root.addChild(e);
    const speed = 1.5 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const initialScale = scale;
    particles.push({
      entity: e,
      initialScale,
      vx: Math.sin(phi) * Math.cos(theta) * speed,
      vy: Math.sin(phi) * Math.sin(theta) * speed,
      vz: Math.cos(phi) * speed,
      nextDirChange: 20 + Math.random() * 80,
    });
  }
  physics._explosions.push({ particles, startTime: performance.now(), duration: 1200 });
}

export function createDashGhost(physics, playerId, x, y, z, angle) {
  const col = {
    1: { diffuse: new Color(1, 0.2, 0.2), emissive: new Color(1, 0.1, 0.05) },
    2: { diffuse: new Color(0.2, 0.2, 1), emissive: new Color(0.05, 0.05, 1) },
  }[playerId] || { diffuse: new Color(0.5, 0.5, 0.5), emissive: new Color(0.2, 0.2, 0.2) };

  const ghost = new Entity('dashGhost');
  ghost.addComponent('render', { type: 'box' });
  const mat = new StandardMaterial();
  mat.diffuse = col.diffuse;
  mat.emissive = col.emissive;
  mat.emissiveIntensity = 1.0;
  mat.opacity = 0.35;
  mat.blendType = 2;
  mat.alphaWrite = false;
  mat.update();
  ghost.render.material = mat;
  ghost.setLocalScale(0.5, 0.5, 0.5);
  ghost.setPosition(x, y, z);
  const angleDeg = (typeof angle === 'number' && !isNaN(angle)) ? (angle + Math.PI) * (180 / Math.PI) : 0;
  ghost.setEulerAngles(0, angleDeg, 0);
  physics.app.root.addChild(ghost);
  physics._dashTrails.push({
    entity: ghost,
    createdAt: performance.now(),
    duration: 600,
    driftX: (Math.random() - 0.5) * 0.3,
    driftY: 0.2 + Math.random() * 0.3,
    driftZ: (Math.random() - 0.5) * 0.3,
  });
}

export function spawnCrescentSlash(physics, options = {}) {
  const {
    position = new Vec3(0, 0.05, 0),
    facingAngle = 0,
    coreColor = [0.45, 0.9, 1.0],
    edgeColor = [0.05, 0.2, 0.47],
    radius = 1,
    arcAngle = 220,
    duration = 0.60
  } = options;

  const mat = createCrescentMaterial(physics, coreColor, edgeColor);
  const crescentMesh = createCrescentMesh(physics, { outerRadius: radius, arcAngle: arcAngle * (Math.PI / 180) });

  const entity = new Entity('slash');
  entity.addComponent('render', { type: 'box' });
  entity.render.meshInstances[0].mesh = crescentMesh;
  entity.render.meshInstances[0].material = mat;
  entity.setPosition(position);
  entity.setEulerAngles(0, (facingAngle + Math.PI) * 180 / Math.PI, 0);
  entity.setLocalScale(0.45, 1, 0.35);
  physics.app.root.addChild(entity);

  physics._slashes.push({
    entity, mat, mesh: crescentMesh,
    elapsed: 0,
    duration,
    sweepDuration: duration * 0.30,
    holdDuration: 0.1,
    fadeDuration: duration * 0.6
  });
}

function createCrescentMesh(physics, opts = {}) {
  const arcAngle = opts.arcAngle !== undefined ? opts.arcAngle : 110 * (Math.PI / 180);
  const outerRadius = opts.outerRadius !== undefined ? opts.outerRadius : 1.3;
  const thickness = opts.thickness !== undefined ? opts.thickness : 0.55;
  const segments = opts.segments !== undefined ? opts.segments : 40;
  const taperPower = opts.taperPower !== undefined ? opts.taperPower : 1.3;

  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const theta = -arcAngle / 2 + t * arcAngle;
    const taper = Math.pow(Math.sin(t * Math.PI), taperPower);
    const rOuter = outerRadius;
    const rInner = outerRadius - thickness * taper;

    const sinT = Math.sin(theta), cosT = Math.cos(theta);

    positions.push(sinT * rOuter, 0, -cosT * rOuter);
    uvs.push(t, 1);

    positions.push(sinT * rInner, 0, -cosT * rInner);
    uvs.push(t, 0);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
    indices.push(a, b, c, b, d, c);
  }

  return createMesh(physics.app.graphicsDevice, positions, { uvs, indices });
}

function createCrescentMaterial(physics, coreColor, edgeColor) {
  const vshader = `
    attribute vec3 aPosition;
    attribute vec2 aUv0;

    uniform mat4 matrix_model;
    uniform mat4 matrix_viewProjection;

    varying vec2 vUv;

    void main(void) {
      vUv = aUv0;
      gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);
    }
  `;

  const fshader = `
    precision mediump float;

    varying vec2 vUv;

    uniform float uTime;
    uniform float uAlpha;
    uniform float uSweep;
    uniform vec3 uColorCore;
    uniform vec3 uColorEdge;

    void main(void) {
      float u = vUv.x;
      float v = vUv.y;

      float sweepEdge = 0.021;
      float reveal = smoothstep(u + sweepEdge, u - sweepEdge, uSweep);
      float endFade = smoothstep(0.0, 0.05, u) * smoothstep(1.0, 0.95, u);

      vec3 col = mix(uColorEdge, uColorCore, pow(v, 1.6));

      float rim = pow(v, 4.0) * 1.4;
      col += rim * uColorCore;

      float streak = sin(u * 40.0 - uTime * 9.0) * 0.5 + 0.5;
      streak = pow(streak, 6.0);
      col += streak * 0.35 * uColorCore;

      float alpha = reveal * endFade * uAlpha;
      alpha *= smoothstep(0.0, 0.25, v);

      gl_FragColor = vec4(col, alpha);
    }
  `;

  const mat = new ShaderMaterial({
    uniqueName: 'crescentSlash',
    attributes: { aPosition: SEMANTIC_POSITION, aUv0: SEMANTIC_TEXCOORD0 },
    vertexGLSL: vshader,
    fragmentGLSL: fshader,
  });
  mat.blendType = BLEND_NORMAL;
  mat.depthWrite = false;
  mat.cull = CULLFACE_BACK;
  mat.update();

  mat.setParameter('uTime', 0);
  mat.setParameter('uAlpha', 1);
  mat.setParameter('uSweep', 0);
  mat.setParameter('uColorCore', coreColor);
  mat.setParameter('uColorEdge', edgeColor);

  return mat;
}
