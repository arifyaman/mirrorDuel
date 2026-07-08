import { Color, Entity, Mesh, MeshInstance, ShaderMaterial, StandardMaterial, Vec3, BLEND_NORMAL, BLEND_ADDITIVE, CULLFACE_NONE, CULLFACE_BACK, SEMANTIC_POSITION, SEMANTIC_NORMAL, SEMANTIC_TEXCOORD0, createMesh } from 'playcanvas';

const DT = 0.01667;

export class Physics {
  constructor(app) {
    this.simTime = 0;
    this.playerEntities = new Map();
    this.indicatorEntities = new Map();
    this.playerLights = new Map();
    this.projectileEntities = new Map();
    this._explosions = [];
    this._playerFlash = new Map();
    this._dashTrails = [];
    this._prevPlayerPos = new Map();
    this._playerShields = new Map();
    this._slashes = [];
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

      // Player hit flash
      const mat = entity.render.material;
      const flashStart = this._playerFlash.get(p.id);
      if (flashStart && (performance.now() - flashStart) < 250) {
        mat.emissiveIntensity = 5.0;
      } else {
        mat.emissiveIntensity = 1.5;
        this._playerFlash.delete(p.id);
      }
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
      entity.enabled = p.health > 0;

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

      // Dash ghost trail
      const prevPos = this._prevPlayerPos.get(p.id);
      if (prevPos) {
        const dx = p.x - prevPos.x;
        const dz = p.z - prevPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 0.28) {
          this.createDashGhost(p.id, prevPos.x, prevPos.y, prevPos.z, p.angle);
        }
      }
      this._prevPlayerPos.set(p.id, { x: p.x, y: p.y, z: p.z });

      // Shield visual per player
      const shieldColor = p.id === 1 ? [1.0, 0.3, 0.3] : [0.1, 0.5, 1.0];
      const activeWin = 7 - (p.shieldCooldown || 0);
      const shieldActive = p.shieldCooldown > 0 && activeWin < 1.0;
      let sd = this._playerShields.get(p.id);

      if (shieldActive) {
        if (!sd) {
          sd = this._createShieldEntity(p.id, shieldColor);
          this._playerShields.set(p.id, sd);
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
    for (const [id] of this.playerEntities) {
      if (!activeIds.has(id)) {
        this.destroyPlayerEntity(id);
      }
    }
  }

  destroyPlayerEntity(id) {
    const entity = this.playerEntities.get(id);
    if (entity) {
      if (entity.parent) entity.parent.removeChild(entity);
      entity.destroy();
      this.playerEntities.delete(id);
    }
    const indicator = this.indicatorEntities.get(id);
    if (indicator) {
      if (indicator.parent) indicator.parent.removeChild(indicator);
      this.indicatorEntities.delete(id);
    }
    const light = this.playerLights.get(id);
    if (light) {
      if (light.parent) light.parent.removeChild(light);
      this.playerLights.delete(id);
    }
    const shield = this._playerShields.get(id);
    if (shield) {
      if (shield.entity.parent) shield.entity.parent.removeChild(shield.entity);
      shield.entity.destroy();
      this._playerShields.delete(id);
    }
    this._prevPlayerPos.delete(id);
    this._playerFlash.delete(id);
  }

  _createShieldEntity(id, color) {
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
      uniform float uCellScale;
      uniform float uCrackWidth;
      uniform float uFresnelPower;
      uniform float uPulseSpeed;
      uniform float uHitTime;
      uniform vec3 uPlayerPos;
      uniform float uPlayerAngle;
      uniform float uConeAngle;

      vec3 hash3(vec3 p) {
          p = vec3(
              dot(p, vec3(127.1, 311.7, 74.7)),
              dot(p, vec3(269.5, 183.3, 246.1)),
              dot(p, vec3(113.5, 271.9, 124.6))
          );
          return fract(sin(p) * 43758.5453123);
      }

      vec3 voronoi(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          float minDist1 = 8.0;
          float minDist2 = 8.0;
          vec3 minPoint = vec3(0.0);
          for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
              for (int k = -1; k <= 1; k++) {
                vec3 b = vec3(float(i), float(j), float(k));
                vec3 randOff = hash3(p + b);
                vec3 r = b + randOff - f;
                float d = dot(r, r);
                if (d < minDist1) {
                  minDist2 = minDist1;
                  minDist1 = d;
                  minPoint = p + b + randOff;
                } else if (d < minDist2) {
                  minDist2 = d;
                }
              }
            }
          }
          return vec3(sqrt(minDist1), sqrt(minDist2),
                      fract(sin(dot(minPoint, vec3(12.9898, 78.233, 45.164))) * 43758.5453));
      }

      void main(void) {
          vec3 N = normalize(vNormalW);
          vec3 V = normalize(uCameraPos - vPositionW);
          float ndv = abs(dot(N, V));
          float fresnel = pow(1.0 - ndv, uFresnelPower);

          vec3 samplePos = normalize(vNormalObj) * uCellScale + vec3(0.0, uTime * 1.2, uTime * 0.6);
          vec3 vr = voronoi(samplePos);
          float edgeDist = vr.y - vr.x;

          float crack = smoothstep(0.0, uCrackWidth, edgeDist);
          float cellBrightness = mix(0.15, 1.0, vr.z * 0.6 + 0.4);

          vec3 darkCol = uColor * 0.03;
          vec3 brightCol = uColor * cellBrightness * 1.2;
          vec3 baseCol = mix(darkCol, brightCol, crack);

          float pulse = 0.92 + 0.08 * sin(uTime * uPulseSpeed * 3.14159);

          float hitAge = uTime - uHitTime;
          float hitPulse = 0.0;
          if (hitAge >= 0.0 && hitAge < 1.2) {
              hitPulse = (1.0 - hitAge / 1.2) * 1.5;
          }

          vec3 rimColor = mix(uColor, vec3(1.0, 0.95, 0.98), 0.25) * (fresnel * 0.7 + hitPulse * 0.5);

          vec3 finalColor = baseCol * pulse + rimColor * 0.8;
          float alpha = clamp(crack * 0.55 + fresnel * 0.55 + hitPulse * 0.5 + 0.22, 0.0, 1.0);

          // Cone culling with voronoi-jittered boundary
          vec3 dir = normalize(vPositionW - uPlayerPos);
          vec2 dirXZ = normalize(dir.xz);
          vec2 facing = vec2(sin(uPlayerAngle), cos(uPlayerAngle));
          float dp = dot(dirXZ, facing);
          float coneDot = cos(uConeAngle);

          float cellJitter = (vr.z - 0.5) * 0.15;
          float crackJitter = (1.0 - smoothstep(0.0, uCrackWidth * 2.0, edgeDist)) * 0.06;
          float localCone = coneDot + cellJitter - crackJitter;

          float coneAlpha = smoothstep(localCone - 0.06, localCone + 0.06, dp);
          alpha *= coneAlpha;
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
    this.app.root.addChild(entity);

    mat.setParameter('uColor', color);
    mat.setParameter('uCellScale', 3.0);
    mat.setParameter('uCrackWidth', 0.06);
    mat.setParameter('uFresnelPower', 2.5);
    mat.setParameter('uPulseSpeed', 0.5);
    mat.setParameter('uHitTime', -10);
    mat.setParameter('uConeAngle', 0);
    mat.setParameter('uPlayerAngle', 0);

    return { entity, mat, time: 0, shieldCooldown: 0, playerAngle: 0, playerPos: { x: 0, y: 0, z: 0 } };
  }

  updateAllShields(dt, cameraPos) {
    const maxConeAngle = 50 * Math.PI / 180;
    const activeDuration = 1.0;
    const openDuration = 0.3;
    const closeDuration = 0.3;

    for (const [id, sd] of this._playerShields) {
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
        coneFrac = 1 - Math.min(closeT, 1) * (2 - Math.min(closeT, 1));
      } else {
        coneFrac = 1;
      }
      mat.setParameter('uConeAngle', coneFrac * maxConeAngle);
    }
  }

  shieldHit(playerId) {
    const sd = this._playerShields.get(playerId);
    if (sd) {
      sd.mat.setParameter('uHitTime', sd.time);
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
      intensity: 5,
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
      data.lightEntity.setPosition(px, py + 0.15, pz);
    }
  }

  createExplosion(x, y, z, hexColor) {
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
      this.app.root.addChild(e);
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
    this._explosions.push({ particles, startTime: performance.now(), duration: 1200 });
  }

  createDashGhost(playerId, x, y, z, angle) {
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
    this.app.root.addChild(ghost);
    this._dashTrails.push({
      entity: ghost,
      createdAt: performance.now(),
      duration: 600,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: 0.2 + Math.random() * 0.3,
      driftZ: (Math.random() - 0.5) * 0.3,
    });
  }

  updateDashTrails() {
    const now = performance.now();
    for (let i = this._dashTrails.length - 1; i >= 0; i--) {
      const t = this._dashTrails[i];
      const elapsed = now - t.createdAt;
      if (elapsed >= t.duration) {
        if (t.entity.parent) t.entity.parent.removeChild(t.entity);
        t.entity.destroy();
        this._dashTrails.splice(i, 1);
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

  _createCrescentMesh(opts = {}) {
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

    return createMesh(this.app.graphicsDevice, positions, { uvs, indices });
  }

  _createCrescentMaterial(coreColor, edgeColor) {
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

  spawnCrescentSlash(options = {}) {
    const {
      position = new Vec3(0, 0.05, 0),
      facingAngle = 0,
      coreColor = [0.45, 0.9, 1.0],
      edgeColor = [0.05, 0.2, 0.47],
      radius = 1,
      arcAngle = 220,
      duration = 0.60
    } = options;

    const mat = this._createCrescentMaterial(coreColor, edgeColor);

    const crescentMesh = this._createCrescentMesh({ outerRadius: radius, arcAngle: arcAngle * (Math.PI / 180) });

    const entity = new Entity('slash');
    entity.addComponent('render', { type: 'box' });
    entity.render.meshInstances[0].mesh = crescentMesh;
    entity.render.meshInstances[0].material = mat;
    entity.setPosition(position);
    entity.setEulerAngles(0, (facingAngle + Math.PI) * 180 / Math.PI, 0);
    entity.setLocalScale(0.45, 1, 0.35);
    this.app.root.addChild(entity);

    this._slashes.push({
      entity, mat, mesh: crescentMesh,
      elapsed: 0,
      duration,
      sweepDuration: duration * 0.30,
      holdDuration: 0.1,
      fadeDuration: duration * 0.6
    });
  }

  updateSlashes(dt) {
    for (let i = this._slashes.length - 1; i >= 0; i--) {
      const s = this._slashes[i];
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
        this._slashes.splice(i, 1);
      }
    }
  }

  flashPlayer(id) {
    this._playerFlash.set(id, performance.now());
  }

  updateExplosions() {
    const now = performance.now();
    for (let i = this._explosions.length - 1; i >= 0; i--) {
      const exp = this._explosions[i];
      const elapsed = now - exp.startTime;
      if (elapsed >= exp.duration) {
        for (const p of exp.particles) {
          if (p.entity.parent) p.entity.parent.removeChild(p.entity);
          p.entity.destroy();
        }
        this._explosions.splice(i, 1);
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
}
