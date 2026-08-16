import { Color, Entity, StandardMaterial, BLEND_ADDITIVE } from 'playcanvas';
import { createShieldEntity, destroyShield } from './shields.js';
import { createDashGhost } from './effects.js';
import { cleanupProjectiles } from './projectiles.js';

export function applyPlayersLogic(physics, players) {
  const colors = {
    1: {
      diffuse: new Color(0.92, 0.2, 0.2),
      emissive: new Color(0.25, 0.04, 0.04),
      light: new Color(1, 0.35, 0.25),
      accent: new Color(1, 0.3, 0.2),
      lightIntensity: 2.5
    },
    2: {
      diffuse: new Color(0.18, 0.5, 0.95),
      emissive: new Color(0.04, 0.1, 0.28),
      light: new Color(0.3, 0.6, 1),
      accent: new Color(0.2, 0.6, 1),
      lightIntensity: 2.5
    }
  };

  for (const p of players) {
    let entity = physics.playerEntities.get(p.id);
    if (!entity) {
      if (p.id >= 100) {
        entity = createZombiePlayer(physics, p.id);
      } else {
        const col = colors[p.id] || {
          diffuse: new Color(0.5, 0.5, 0.5),
          emissive: new Color(0.1, 0.1, 0.1),
          light: new Color(0.5, 0.5, 0.5),
          accent: new Color(0.5, 0.5, 0.5),
          lightIntensity: 2.0
        };
        entity = createTacticalPlayer(physics, p.id, col.diffuse, col.emissive, col.accent, col.light, col.lightIntensity);
      }
      entity.enabled = false;
    }

    // Hit flash reaction
    const mat = entity.render.material;
    const flashStart = physics._playerFlash.get(p.id);
    const perfectFlashStart = physics._playerPerfectFlash.get(p.id);
    if (perfectFlashStart && (performance.now() - perfectFlashStart) < 400) {
      mat.emissive.set(0.2, 1.0, 0.8);
      mat.emissiveIntensity = 4.0;
    } else if (flashStart && (performance.now() - flashStart) < 250) {
      mat.emissive.set(1.0, 1.0, 1.0);
      mat.emissiveIntensity = 3.0;
    } else {
      mat.emissiveIntensity = 0.12;
      const col = p.id === 1 ? [0.25, 0.04, 0.04] : [0.04, 0.1, 0.28];
      mat.emissive.set(col[0], col[1], col[2]);
      physics._playerFlash.delete(p.id);
      physics._playerPerfectFlash.delete(p.id);
    }
    mat.update();

    // Animate tactical floating hands, rifle, combat idle/recoil & reload
    const t = (physics.simTime || 0) * 4.0;
    const leftHand = entity.children.find(c => c.name.startsWith('leftHand'));
    const rightHand = entity.children.find(c => c.name.startsWith('rightHand'));
    const rifle = entity.children.find(c => c.name.startsWith('rifle'));
    const leftFoot = entity.children.find(c => c.name.startsWith('leftFoot'));
    const rightFoot = entity.children.find(c => c.name.startsWith('rightFoot'));
    const magazine = rifle ? rifle.children.find(c => c.name.startsWith('magazine')) : null;

    // Check if entity is Zombie or Human Commando
    if (p.id >= 100) {
      // Zombie aggressive sprinting & lunging animation
      const zt = t * 2.2;
      if (leftHand) {
        leftHand.setLocalPosition(-0.65 + Math.sin(zt) * 0.15, Math.sin(zt * 1.5) * 0.08, Math.cos(zt) * 0.2);
      }
      if (rightHand) {
        const slashLunge = p.slashCooldown > 0 ? -0.55 : 0;
        rightHand.setLocalPosition(0.65 - Math.sin(zt) * 0.15, Math.sin(zt * 1.5 + Math.PI) * 0.08, -0.3 + slashLunge + Math.cos(zt + Math.PI) * 0.15);
        rightHand.setLocalEulerAngles(p.slashCooldown > 0 ? -35 : Math.sin(zt) * 15, 0, 0);
      }
      if (leftFoot) {
        leftFoot.setLocalPosition(-0.22, -0.48 + Math.sin(zt * 2) * 0.06, 0.05 + Math.cos(zt * 2) * 0.08);
      }
      if (rightFoot) {
        rightFoot.setLocalPosition(0.22, -0.48 + Math.sin(zt * 2 + Math.PI) * 0.06, 0.05 + Math.cos(zt * 2 + Math.PI) * 0.08);
      }
    } else {
      // Human Commando: floating hands, rifle, combat idle/recoil & reload
      const isReloading = p.cooldown > 0.20;
      let rightZOffset = -0.32;
      let leftZOffset = 0.06;
      let leftXOffset = -0.72;
      let leftYOffset = 0;
      let rightXRot = 0;

      if (isReloading) {
        // Progress from 0.0 (start) to 1.0 (finish)
        const progress = 1.0 - Math.min(1.0, Math.max(0, p.cooldown / 1.35));

        if (progress < 0.35) {
          // Stage 1: Drop empty magazine
          const dropT = progress / 0.35;
          if (magazine) {
            magazine.setLocalPosition(0, -0.32 - dropT * 0.6, -0.3 + dropT * 0.15);
            magazine.setLocalEulerAngles(-22 - dropT * 40, 0, 0);
          }
          leftXOffset = -0.72 + dropT * 0.6;
          leftYOffset = -dropT * 0.25;
          leftZOffset = 0.06 - dropT * 0.3;
        } else if (progress < 0.68) {
          // Stage 2: Left hand reaches to ammo pouch for fresh mag
          const reachT = (progress - 0.35) / 0.33;
          if (magazine) {
            magazine.setLocalPosition(0, -1.2, -0.3);
          }
          leftXOffset = -0.12 - reachT * 0.45;
          leftYOffset = -0.25 - Math.sin(reachT * Math.PI) * 0.2;
          leftZOffset = -0.24 + reachT * 0.35;
        } else {
          // Stage 3: Slap fresh magazine in and lock bolt!
          const insertT = Math.min(1.0, (progress - 0.68) / 0.32);
          if (magazine) {
            magazine.setLocalPosition(0, -0.85 + insertT * 0.53, -0.3);
            magazine.setLocalEulerAngles(-22, 0, 0);
          }
          leftXOffset = -0.57 + insertT * 0.8;
          leftYOffset = -0.45 + insertT * 0.25;
          leftZOffset = 0.11 - insertT * 0.35;
          if (insertT > 0.85) {
            // Tactical bolt slap kick
            rightZOffset += 0.08;
            rightXRot += 10;
          }
        }
      } else {
        // Normal combat stance with fire recoil & slash thrust
        if (magazine) {
          magazine.setLocalPosition(0, -0.32, -0.3);
          magazine.setLocalEulerAngles(-22, 0, 0);
        }
        // Projectile fire recoil kickback (rapid fire spray)
        if (p.cooldown > 0.02) {
          const kick = Math.min(1, p.cooldown / 0.14); // 1 -> 0
          rightZOffset += kick * 0.22;
          rightXRot -= kick * 14;
        }
        // Slash thrust forward
        if (p.slashCooldown > 0.3) {
          const thrust = (p.slashCooldown - 0.3) / 0.2; // 1 -> 0
          rightZOffset -= thrust * 0.45;
          rightXRot += thrust * 30;
        }
      }

      if (leftHand) {
        const pPerks = (physics.playerPerks && physics.playerPerks.get(p.id)) || 0;
        const isDualWield = (pPerks & 1) !== 0 || (p.id === physics.myPlayerId && physics.perks && physics.perks.has('dual_wield'));

        if (isDualWield) {
          // Dual Wield Stance: Left hand raises second rifle forward!
          const lx = -0.72 - Math.cos(t * 0.8) * 0.04;
          const ly = Math.sin(t + 0.6) * 0.04;
          const lz = rightZOffset + Math.cos(t + 0.6) * 0.03;
          leftHand.setLocalPosition(lx, ly, lz);
          leftHand.setLocalEulerAngles(rightXRot, 0, 0);

          const leftRifle = entity.findByName('leftRifle' + p.id);
          if (leftRifle) {
            leftRifle.enabled = true;
            leftRifle.setLocalPosition(lx, ly, lz);
            leftRifle.setLocalEulerAngles(rightXRot, 0, 0);
          }
        } else {
          leftHand.setLocalPosition(
            leftXOffset + Math.sin(t * 0.8) * 0.03,
            leftYOffset + Math.sin(t) * 0.04,
            leftZOffset + Math.cos(t) * 0.03
          );
          const leftRifle = entity.findByName('leftRifle' + p.id);
          if (leftRifle) leftRifle.enabled = false;
        }
      }
      if (rightHand) {
        const hx = 0.72 + Math.cos(t * 0.8) * 0.04;
        const hy = Math.sin(t + 0.6) * 0.04;
        const hz = rightZOffset + Math.cos(t + 0.6) * 0.03;

        rightHand.setLocalPosition(hx, hy, hz);
        rightHand.setLocalEulerAngles(rightXRot, 0, 0);

        if (rifle) {
          rifle.setLocalPosition(hx, hy, hz);
          rifle.setLocalEulerAngles(rightXRot, 0, 0);
        }
      }

      // Foot stepping bobbing animation
      if (leftFoot) {
        leftFoot.setLocalPosition(-0.24, -0.48 + Math.sin(t * 1.5) * 0.03, 0.05 + Math.cos(t * 1.5) * 0.04);
      }
      if (rightFoot) {
        rightFoot.setLocalPosition(0.24, -0.48 + Math.sin(t * 1.5 + Math.PI) * 0.03, 0.05 + Math.cos(t * 1.5 + Math.PI) * 0.04);
      }
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

    // --- STANDING GROUND DEFENSE TURRET PERK ---
    if (physics.perks && physics.perks.has('sentry_turret') && p.id === physics.myPlayerId) {
      if (!physics.groundTurret) {
        physics.groundTurret = createGroundTurret(physics, p.x, p.z);
      }

      if (physics.groundTurret) {
        const tPos = physics.groundTurret.entity.getPosition();

        // Scan for closest living zombie in 12m radius
        let closestZ = null;
        let minZDist = 999;
        for (const other of players) {
          if (other.id >= 100 && other.health > 0) {
            const d = Math.hypot(other.x - tPos.x, other.z - tPos.z);
            if (d < minZDist) {
              minZDist = d;
              closestZ = other;
            }
          }
        }

        if (closestZ && minZDist < 12.0) {
          // Swivel turret head towards zombie
          const targetAngle = Math.atan2(closestZ.x - tPos.x, closestZ.z - tPos.z);
          physics.groundTurret.head.setEulerAngles(0, (targetAngle + Math.PI) * (180 / Math.PI), 0);
        }
      }
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
  physics.playerLights.clear();
  cleanupProjectiles(physics);
}

/**
 * Creates a fully detailed Tactical Commando Orb character model matching
 * the concept art:
 * - Spherical colored body with clean semi-gloss 3D shading
 * - SWAT Tactical Combat Helmet with brow ridge, NVG mount & amber headlamp
 * - Expressive determined cartoon battle eyes (sclera + pupils + specular catchlights)
 * - Confident combat smirk / mouth
 * - Tactical Assault Rifle (APOC-1 Carbine) directly positioned on the right hand
 * - Tactical floating hands & boots
 * - Shoulder-mounted sensor/drone pod with dual glowing optics
 */
function createTacticalPlayer(physics, id, bodyColor, emissiveColor, accentColor, lightColor, lightIntensity) {
  const entity = new Entity('player' + id);
  entity.addComponent('render', { type: 'sphere' });
  const material = new StandardMaterial();
  material.diffuse = bodyColor;
  material.emissive = emissiveColor;
  material.emissiveIntensity = 0.12;
  material.roughness = 0.3;
  material.metalness = 0.25;
  material.castShadows = true;
  material.receiveShadows = true;
  material.update();
  entity.render.material = material;
  entity.setLocalScale(0.5, 0.5, 0.5);

  // Common materials
  const helmetDarkMat = new StandardMaterial();
  helmetDarkMat.diffuse = new Color(0.12, 0.15, 0.2);
  helmetDarkMat.roughness = 0.7;
  helmetDarkMat.metalness = 0.35;
  helmetDarkMat.castShadows = true;
  helmetDarkMat.update();

  const helmetPlateMat = new StandardMaterial();
  helmetPlateMat.diffuse = new Color(0.18, 0.24, 0.32);
  helmetPlateMat.roughness = 0.5;
  helmetPlateMat.metalness = 0.45;
  helmetPlateMat.update();

  const amberLedMat = new StandardMaterial();
  amberLedMat.diffuse = new Color(1.0, 0.6, 0.0);
  amberLedMat.emissive = new Color(1.0, 0.65, 0.0);
  amberLedMat.emissiveIntensity = 4.0;
  amberLedMat.update();

  const cyanLedMat = new StandardMaterial();
  cyanLedMat.diffuse = new Color(0.2, 0.85, 1.0);
  cyanLedMat.emissive = new Color(0.2, 0.85, 1.0);
  cyanLedMat.emissiveIntensity = 4.5;
  cyanLedMat.update();

  const gunMetalMat = new StandardMaterial();
  gunMetalMat.diffuse = new Color(0.12, 0.14, 0.18);
  gunMetalMat.roughness = 0.25;
  gunMetalMat.metalness = 0.9;
  gunMetalMat.castShadows = true;
  gunMetalMat.update();

  const gunAccentMat = new StandardMaterial();
  gunAccentMat.diffuse = new Color(0.24, 0.28, 0.35);
  gunAccentMat.roughness = 0.35;
  gunAccentMat.metalness = 0.7;
  gunAccentMat.update();

  const eyeWhiteMat = new StandardMaterial();
  eyeWhiteMat.diffuse = new Color(0.98, 0.98, 0.98);
  eyeWhiteMat.roughness = 0.15;
  eyeWhiteMat.update();

  const eyePupilMat = new StandardMaterial();
  eyePupilMat.diffuse = new Color(0.04, 0.06, 0.1);
  eyePupilMat.roughness = 0.2;
  eyePupilMat.update();

  const eyeSparkleMat = new StandardMaterial();
  eyeSparkleMat.diffuse = new Color(1.0, 1.0, 1.0);
  eyeSparkleMat.emissive = new Color(1.0, 1.0, 1.0);
  eyeSparkleMat.emissiveIntensity = 3.0;
  eyeSparkleMat.update();

  const mouthMat = new StandardMaterial();
  mouthMat.diffuse = new Color(0.05, 0.07, 0.12);
  mouthMat.update();

  // ================= 1. TACTICAL COMBAT HELMET =================
  const helmetDome = new Entity('helmetDome' + id);
  helmetDome.addComponent('render', { type: 'sphere' });
  helmetDome.render.material = helmetDarkMat;
  helmetDome.setLocalPosition(0, 0.12, 0.04);
  helmetDome.setLocalScale(1.04, 0.86, 1.04);
  entity.addChild(helmetDome);

  // Helmet Front Visor Rim / Brow ridge
  const helmetBrim = new Entity('helmetBrim' + id);
  helmetBrim.addComponent('render', { type: 'box' });
  helmetBrim.render.material = helmetPlateMat;
  helmetBrim.setLocalPosition(0, 0.22, -0.42);
  helmetBrim.setLocalEulerAngles(-18, 0, 0);
  helmetBrim.setLocalScale(0.88, 0.12, 0.26);
  entity.addChild(helmetBrim);

  // Helmet Top Ridge Armor Plate
  const helmetRidge = new Entity('helmetRidge' + id);
  helmetRidge.addComponent('render', { type: 'box' });
  helmetRidge.render.material = helmetPlateMat;
  helmetRidge.setLocalPosition(0, 0.52, 0.02);
  helmetRidge.setLocalScale(0.24, 0.12, 0.9);
  entity.addChild(helmetRidge);

  // Front Night Vision Mount / Headlamp Box
  const nvgMount = new Entity('nvgMount' + id);
  nvgMount.addComponent('render', { type: 'box' });
  nvgMount.render.material = gunMetalMat;
  nvgMount.setLocalPosition(0, 0.38, -0.46);
  nvgMount.setLocalScale(0.26, 0.22, 0.18);
  entity.addChild(nvgMount);

  // Glowing Amber Tactical Light in Center
  const nvgLens = new Entity('nvgLens' + id);
  nvgLens.addComponent('render', { type: 'box' });
  nvgLens.render.material = amberLedMat;
  nvgLens.setLocalPosition(0, 0.38, -0.55);
  nvgLens.setLocalScale(0.16, 0.14, 0.05);
  entity.addChild(nvgLens);

  // Side Comms Headset / Earcups
  const leftEarcup = new Entity('leftEarcup' + id);
  leftEarcup.addComponent('render', { type: 'cylinder' });
  leftEarcup.render.material = helmetPlateMat;
  leftEarcup.setLocalPosition(-0.52, 0.08, 0.02);
  leftEarcup.setLocalEulerAngles(0, 0, 90);
  leftEarcup.setLocalScale(0.26, 0.12, 0.26);
  entity.addChild(leftEarcup);

  const rightEarcup = new Entity('rightEarcup' + id);
  rightEarcup.addComponent('render', { type: 'cylinder' });
  rightEarcup.render.material = helmetPlateMat;
  rightEarcup.setLocalPosition(0.52, 0.08, 0.02);
  rightEarcup.setLocalEulerAngles(0, 0, 90);
  rightEarcup.setLocalScale(0.26, 0.12, 0.26);
  entity.addChild(rightEarcup);

  // ================= 2. CARTOON BATTLE EYES & FACE =================
  // Left Eye Sclera
  const leftEye = new Entity('leftEye' + id);
  leftEye.addComponent('render', { type: 'sphere' });
  leftEye.render.material = eyeWhiteMat;
  leftEye.setLocalPosition(-0.18, 0.04, -0.46);
  leftEye.setLocalScale(0.18, 0.22, 0.09);
  entity.addChild(leftEye);

  // Left Eye Pupil
  const leftPupil = new Entity('leftPupil' + id);
  leftPupil.addComponent('render', { type: 'sphere' });
  leftPupil.render.material = eyePupilMat;
  leftPupil.setLocalPosition(-0.17, 0.03, -0.5);
  leftPupil.setLocalScale(0.12, 0.15, 0.05);
  entity.addChild(leftPupil);

  // Left Eye Specular Catchlight
  const leftSparkle = new Entity('leftSparkle' + id);
  leftSparkle.addComponent('render', { type: 'sphere' });
  leftSparkle.render.material = eyeSparkleMat;
  leftSparkle.setLocalPosition(-0.19, 0.08, -0.52);
  leftSparkle.setLocalScale(0.045, 0.045, 0.045);
  entity.addChild(leftSparkle);

  // Left Eyebrow (Determined frown)
  const leftBrow = new Entity('leftBrow' + id);
  leftBrow.addComponent('render', { type: 'box' });
  leftBrow.render.material = mouthMat;
  leftBrow.setLocalPosition(-0.2, 0.18, -0.46);
  leftBrow.setLocalEulerAngles(0, 0, -22);
  leftBrow.setLocalScale(0.22, 0.06, 0.06);
  entity.addChild(leftBrow);

  // Right Eye Sclera
  const rightEye = new Entity('rightEye' + id);
  rightEye.addComponent('render', { type: 'sphere' });
  rightEye.render.material = eyeWhiteMat;
  rightEye.setLocalPosition(0.18, 0.04, -0.46);
  rightEye.setLocalScale(0.18, 0.22, 0.09);
  entity.addChild(rightEye);

  // Right Eye Pupil
  const rightPupil = new Entity('rightPupil' + id);
  rightPupil.addComponent('render', { type: 'sphere' });
  rightPupil.render.material = eyePupilMat;
  rightPupil.setLocalPosition(0.17, 0.03, -0.5);
  rightPupil.setLocalScale(0.12, 0.15, 0.05);
  entity.addChild(rightPupil);

  // Right Eye Specular Catchlight
  const rightSparkle = new Entity('rightSparkle' + id);
  rightSparkle.addComponent('render', { type: 'sphere' });
  rightSparkle.render.material = eyeSparkleMat;
  rightSparkle.setLocalPosition(0.15, 0.08, -0.52);
  rightSparkle.setLocalScale(0.045, 0.045, 0.045);
  entity.addChild(rightSparkle);

  // Right Eyebrow (Determined frown)
  const rightBrow = new Entity('rightBrow' + id);
  rightBrow.addComponent('render', { type: 'box' });
  rightBrow.render.material = mouthMat;
  rightBrow.setLocalPosition(0.2, 0.18, -0.46);
  rightBrow.setLocalEulerAngles(0, 0, 22);
  rightBrow.setLocalScale(0.22, 0.06, 0.06);
  entity.addChild(rightBrow);

  // Confident Battle Smirk / Mouth
  const mouth = new Entity('mouth' + id);
  mouth.addComponent('render', { type: 'box' });
  mouth.render.material = mouthMat;
  mouth.setLocalPosition(0.04, -0.15, -0.48);
  mouth.setLocalEulerAngles(0, 0, -8);
  mouth.setLocalScale(0.16, 0.04, 0.05);
  entity.addChild(mouth);

  // ================= 3. SHOULDER TACTICAL SENSOR POD =================
  const shoulderPod = new Entity('shoulderPod' + id);
  shoulderPod.addComponent('render', { type: 'box' });
  shoulderPod.render.material = helmetPlateMat;
  shoulderPod.setLocalPosition(-0.38, 0.36, 0.24);
  shoulderPod.setLocalEulerAngles(8, -15, 0);
  shoulderPod.setLocalScale(0.28, 0.3, 0.32);
  entity.addChild(shoulderPod);

  // Dual glowing camera lenses on pod
  const podLensTop = new Entity('podLensTop' + id);
  podLensTop.addComponent('render', { type: 'sphere' });
  podLensTop.render.material = cyanLedMat;
  podLensTop.setLocalPosition(-0.38, 0.44, 0.07);
  podLensTop.setLocalScale(0.09, 0.09, 0.09);
  entity.addChild(podLensTop);

  const podLensBottom = new Entity('podLensBottom' + id);
  podLensBottom.addComponent('render', { type: 'sphere' });
  podLensBottom.render.material = amberLedMat;
  podLensBottom.setLocalPosition(-0.38, 0.31, 0.07);
  podLensBottom.setLocalScale(0.09, 0.09, 0.09);
  entity.addChild(podLensBottom);

  // ================= 4. TACTICAL BOOTS / FEET =================
  const leftFoot = new Entity('leftFoot' + id);
  leftFoot.addComponent('render', { type: 'box' });
  leftFoot.render.material = helmetDarkMat;
  leftFoot.setLocalPosition(-0.24, -0.48, 0.05);
  leftFoot.setLocalScale(0.2, 0.14, 0.28);
  entity.addChild(leftFoot);

  const rightFoot = new Entity('rightFoot' + id);
  rightFoot.addComponent('render', { type: 'box' });
  rightFoot.render.material = helmetDarkMat;
  rightFoot.setLocalPosition(0.24, -0.48, 0.05);
  rightFoot.setLocalScale(0.2, 0.14, 0.28);
  entity.addChild(rightFoot);

  // ================= 5. LEFT HAND (TACTICAL GLOVE) =================
  const leftHand = new Entity('leftHand' + id);
  leftHand.addComponent('render', { type: 'sphere' });
  leftHand.render.material = helmetDarkMat;
  leftHand.setLocalScale(0.38, 0.38, 0.38);
  leftHand.setLocalPosition(-0.72, 0, 0.06);

  // Armored knuckle plate on left hand
  const leftKnuckle = new Entity('leftKnuckle' + id);
  leftKnuckle.addComponent('render', { type: 'box' });
  leftKnuckle.render.material = helmetPlateMat;
  leftKnuckle.setLocalPosition(0, 0.06, -0.15);
  leftKnuckle.setLocalScale(0.26, 0.18, 0.18);
  leftHand.addChild(leftKnuckle);

  entity.addChild(leftHand);

  // ================= 6. RIGHT HAND & TACTICAL RIFLE (APOC-1) =================
  const rightHand = new Entity('rightHand' + id);
  rightHand.addComponent('render', { type: 'sphere' });
  rightHand.render.material = helmetDarkMat;
  rightHand.setLocalScale(0.38, 0.38, 0.38);
  rightHand.setLocalPosition(0.72, 0, -0.32);
  entity.addChild(rightHand);

  // Tactical Rifle Entity (Bold & Chunky 1:1 scale with player body!)
  const rifle = new Entity('rifle' + id);
  rifle.setLocalPosition(0.72, 0, -0.32);

  // Receiver / Main Rifle Body
  const receiver = new Entity('receiver' + id);
  receiver.addComponent('render', { type: 'box' });
  receiver.render.material = gunMetalMat;
  receiver.setLocalPosition(0, 0.06, -0.45);
  receiver.setLocalScale(0.22, 0.34, 0.95);
  rifle.addChild(receiver);

  // Top Picatinny Rail
  const topRail = new Entity('topRail' + id);
  topRail.addComponent('render', { type: 'box' });
  topRail.render.material = gunAccentMat;
  topRail.setLocalPosition(0, 0.25, -0.45);
  topRail.setLocalScale(0.18, 0.08, 0.98);
  rifle.addChild(topRail);

  // Heavy Rifle Barrel
  const barrel = new Entity('barrel' + id);
  barrel.addComponent('render', { type: 'cylinder' });
  barrel.render.material = gunMetalMat;
  barrel.setLocalPosition(0, 0.1, -1.15);
  barrel.setLocalEulerAngles(90, 0, 0);
  barrel.setLocalScale(0.14, 0.7, 0.14);
  rifle.addChild(barrel);

  // Muzzle Brake / Flash Hider
  const muzzle = new Entity('muzzle' + id);
  muzzle.addComponent('render', { type: 'cylinder' });
  muzzle.render.material = gunAccentMat;
  muzzle.setLocalPosition(0, 0.1, -1.55);
  muzzle.setLocalEulerAngles(90, 0, 0);
  muzzle.setLocalScale(0.2, 0.2, 0.2);
  rifle.addChild(muzzle);

  // Glowing Muzzle Laser Tip
  const muzzleGlow = new Entity('muzzleGlow' + id);
  muzzleGlow.addComponent('render', { type: 'sphere' });
  muzzleGlow.render.material = amberLedMat;
  muzzleGlow.setLocalPosition(0, 0.1, -1.65);
  muzzleGlow.setLocalScale(0.12, 0.12, 0.12);
  rifle.addChild(muzzleGlow);

  // Holographic Red Dot Sight (Housing)
  const holoHousing = new Entity('holoHousing' + id);
  holoHousing.addComponent('render', { type: 'box' });
  holoHousing.render.material = gunAccentMat;
  holoHousing.setLocalPosition(0, 0.38, -0.38);
  holoHousing.setLocalScale(0.2, 0.18, 0.36);
  rifle.addChild(holoHousing);

  // Holo Optic Glowing Reticle Glass
  const holoLens = new Entity('holoLens' + id);
  holoLens.addComponent('render', { type: 'box' });
  holoLens.render.material = cyanLedMat;
  holoLens.setLocalPosition(0, 0.38, -0.57);
  holoLens.setLocalScale(0.14, 0.12, 0.04);
  rifle.addChild(holoLens);

  // Curved Tactical High-Cap Magazine
  const magazine = new Entity('magazine' + id);
  magazine.addComponent('render', { type: 'box' });
  magazine.render.material = gunAccentMat;
  magazine.setLocalPosition(0, -0.32, -0.3);
  magazine.setLocalEulerAngles(-22, 0, 0);
  magazine.setLocalScale(0.16, 0.46, 0.24);
  rifle.addChild(magazine);

  // Tactical Stock / Buffer Tube
  const stock = new Entity('stock' + id);
  stock.addComponent('render', { type: 'box' });
  stock.render.material = gunMetalMat;
  stock.setLocalPosition(0, 0.06, 0.2);
  stock.setLocalScale(0.18, 0.28, 0.48);
  rifle.addChild(stock);

  // Side Tactical Laser / Light Module
  const sideLaser = new Entity('sideLaser' + id);
  sideLaser.addComponent('render', { type: 'box' });
  sideLaser.render.material = gunMetalMat;
  sideLaser.setLocalPosition(-0.16, 0.1, -0.8);
  sideLaser.setLocalScale(0.1, 0.1, 0.32);
  rifle.addChild(sideLaser);

  const sideLaserLens = new Entity('sideLaserLens' + id);
  sideLaserLens.addComponent('render', { type: 'sphere' });
  sideLaserLens.render.material = cyanLedMat;
  sideLaserLens.setLocalPosition(-0.16, 0.1, -0.98);
  sideLaserLens.setLocalScale(0.08, 0.08, 0.08);
  rifle.addChild(sideLaserLens);

  // Tactical Laser Sight Beam (Long glowing tactical aiming laser)
  const laserBeamMat = new StandardMaterial();
  const laserColor = id === 1 ? new Color(1.0, 0.1, 0.15) : new Color(0.0, 0.9, 1.0);
  laserBeamMat.diffuse = laserColor;
  laserBeamMat.emissive = laserColor;
  laserBeamMat.emissiveIntensity = 5.0;
  laserBeamMat.opacity = 0.55;
  laserBeamMat.blendType = BLEND_ADDITIVE;
  laserBeamMat.alphaWrite = false;
  laserBeamMat.cull = 0;
  laserBeamMat.update();

  const laserBeam = new Entity('laserBeam' + id);
  laserBeam.addComponent('render', { type: 'box' });
  laserBeam.render.material = laserBeamMat;
  laserBeam.setLocalPosition(0, 0.1, -12.5);
  laserBeam.setLocalScale(0.022, 0.022, 22.0);
  laserBeam.render.castShadows = false;
  laserBeam.render.receiveShadows = false;
  rifle.addChild(laserBeam);

  // Tactical Laser Aim Dot (Impact Point)
  const laserDotMat = new StandardMaterial();
  laserDotMat.diffuse = laserColor;
  laserDotMat.emissive = laserColor;
  laserDotMat.emissiveIntensity = 7.0;
  laserDotMat.blendType = BLEND_ADDITIVE;
  laserDotMat.update();

  const laserDot = new Entity('laserDot' + id);
  laserDot.addComponent('render', { type: 'sphere' });
  laserDot.render.material = laserDotMat;
  laserDot.setLocalPosition(0, 0.1, -23.5);
  laserDot.setLocalScale(0.12, 0.12, 0.12);
  laserDot.render.castShadows = false;
  laserDot.render.receiveShadows = false;
  rifle.addChild(laserDot);

  entity.addChild(rifle);

  // ================= 7. LEFT RIFLE FOR DUAL WIELD (Identical 1:1 APOC-1) =================
  const leftRifle = new Entity('leftRifle' + id);
  leftRifle.setLocalPosition(-0.72, 0, -0.32);

  const lReceiver = new Entity('lReceiver' + id);
  lReceiver.addComponent('render', { type: 'box' });
  lReceiver.render.material = gunMetalMat;
  lReceiver.setLocalPosition(0, 0.06, -0.45);
  lReceiver.setLocalScale(0.22, 0.34, 0.95);
  leftRifle.addChild(lReceiver);

  const lTopRail = new Entity('lTopRail' + id);
  lTopRail.addComponent('render', { type: 'box' });
  lTopRail.render.material = gunAccentMat;
  lTopRail.setLocalPosition(0, 0.25, -0.45);
  lTopRail.setLocalScale(0.18, 0.08, 0.98);
  leftRifle.addChild(lTopRail);

  const lBarrel = new Entity('lBarrel' + id);
  lBarrel.addComponent('render', { type: 'cylinder' });
  lBarrel.render.material = gunMetalMat;
  lBarrel.setLocalPosition(0, 0.1, -1.15);
  lBarrel.setLocalEulerAngles(90, 0, 0);
  lBarrel.setLocalScale(0.14, 0.7, 0.14);
  leftRifle.addChild(lBarrel);

  const lMuzzle = new Entity('lMuzzle' + id);
  lMuzzle.addComponent('render', { type: 'cylinder' });
  lMuzzle.render.material = gunAccentMat;
  lMuzzle.setLocalPosition(0, 0.1, -1.55);
  lMuzzle.setLocalEulerAngles(90, 0, 0);
  lMuzzle.setLocalScale(0.2, 0.2, 0.2);
  leftRifle.addChild(lMuzzle);

  const lHoloHousing = new Entity('lHoloHousing' + id);
  lHoloHousing.addComponent('render', { type: 'box' });
  lHoloHousing.render.material = gunAccentMat;
  lHoloHousing.setLocalPosition(0, 0.38, -0.38);
  lHoloHousing.setLocalScale(0.2, 0.18, 0.36);
  leftRifle.addChild(lHoloHousing);

  const lHoloLens = new Entity('lHoloLens' + id);
  lHoloLens.addComponent('render', { type: 'box' });
  lHoloLens.render.material = cyanLedMat;
  lHoloLens.setLocalPosition(0, 0.38, -0.57);
  lHoloLens.setLocalScale(0.14, 0.12, 0.04);
  leftRifle.addChild(lHoloLens);

  const lMagazine = new Entity('lMagazine' + id);
  lMagazine.addComponent('render', { type: 'box' });
  lMagazine.render.material = gunAccentMat;
  lMagazine.setLocalPosition(0, -0.32, -0.3);
  lMagazine.setLocalEulerAngles(-22, 0, 0);
  lMagazine.setLocalScale(0.16, 0.46, 0.24);
  leftRifle.addChild(lMagazine);

  const lStock = new Entity('lStock' + id);
  lStock.addComponent('render', { type: 'box' });
  lStock.render.material = gunMetalMat;
  lStock.setLocalPosition(0, 0.06, 0.2);
  lStock.setLocalScale(0.18, 0.28, 0.48);
  leftRifle.addChild(lStock);

  const lLaserBeam = new Entity('lLaserBeam' + id);
  lLaserBeam.addComponent('render', { type: 'box' });
  lLaserBeam.render.material = laserBeamMat;
  lLaserBeam.setLocalPosition(0, 0.1, -12.5);
  lLaserBeam.setLocalScale(0.022, 0.022, 22.0);
  lLaserBeam.render.castShadows = false;
  lLaserBeam.render.receiveShadows = false;
  leftRifle.addChild(lLaserBeam);

  leftRifle.enabled = false;
  entity.addChild(leftRifle);

  // Real point light that illuminates the floor
  const lightEntity = new Entity('pointLight' + id);
  lightEntity.addComponent('light', {
    type: 'omni',
    color: lightColor,
    intensity: lightIntensity || 2.5,
    range: 6,
    shadow: false
  });
  lightEntity.setPosition(0, 0.8, 0);
  entity.addChild(lightEntity);

  physics.app.root.addChild(entity);
  physics.playerEntities.set(id, entity);
  physics.playerLights.set(id, lightEntity);
  return entity;
}

/**
 * Creates an Infected/Zombie Orb enemy with toxic green skin,
 * glowing bloodshot red eyes, rusted helmet, and a jagged combat machete blade.
 */
function createZombiePlayer(physics, id) {
  const entity = new Entity('player' + id);
  entity.addComponent('render', { type: 'sphere' });
  const material = new StandardMaterial();
  material.diffuse = new Color(0.24, 0.44, 0.16); // Toxic rotten zombie green
  material.emissive = new Color(0.1, 0.25, 0.08);
  material.emissiveIntensity = 0.25;
  material.roughness = 0.45;
  material.metalness = 0.15;
  material.castShadows = true;
  material.receiveShadows = true;
  material.update();
  entity.render.material = material;
  entity.setLocalScale(0.5, 0.5, 0.5);

  // Common zombie materials
  const rustHelmetMat = new StandardMaterial();
  rustHelmetMat.diffuse = new Color(0.18, 0.15, 0.12);
  rustHelmetMat.emissive = new Color(0.12, 0.04, 0.02);
  rustHelmetMat.roughness = 0.85;
  rustHelmetMat.metalness = 0.3;
  rustHelmetMat.castShadows = true;
  rustHelmetMat.update();

  const bloodEyeMat = new StandardMaterial();
  bloodEyeMat.diffuse = new Color(1.0, 0.08, 0.08);
  bloodEyeMat.emissive = new Color(1.0, 0.1, 0.1);
  bloodEyeMat.emissiveIntensity = 4.0;
  bloodEyeMat.update();

  const bladeSteelMat = new StandardMaterial();
  bladeSteelMat.diffuse = new Color(0.3, 0.34, 0.38);
  bladeSteelMat.emissive = new Color(0.15, 0.05, 0.02);
  bladeSteelMat.roughness = 0.3;
  bladeSteelMat.metalness = 0.9;
  bladeSteelMat.castShadows = true;
  bladeSteelMat.update();

  const darkMouthMat = new StandardMaterial();
  darkMouthMat.diffuse = new Color(0.04, 0.02, 0.02);
  darkMouthMat.update();

  const fangMat = new StandardMaterial();
  fangMat.diffuse = new Color(0.9, 0.9, 0.7);
  fangMat.update();

  // 1. Rusted Zombie Combat Helmet
  const helmetDome = new Entity('helmetDome' + id);
  helmetDome.addComponent('render', { type: 'sphere' });
  helmetDome.render.material = rustHelmetMat;
  helmetDome.setLocalPosition(0, 0.12, 0.04);
  helmetDome.setLocalScale(1.04, 0.86, 1.04);
  entity.addChild(helmetDome);

  // Helmet crack / damaged brow
  const helmetBrim = new Entity('helmetBrim' + id);
  helmetBrim.addComponent('render', { type: 'box' });
  helmetBrim.render.material = rustHelmetMat;
  helmetBrim.setLocalPosition(0, 0.22, -0.42);
  helmetBrim.setLocalEulerAngles(-18, 8, 5);
  helmetBrim.setLocalScale(0.88, 0.12, 0.26);
  entity.addChild(helmetBrim);

  // 2. Glowing Blood-Red Zombie Eyes
  const leftEye = new Entity('leftEye' + id);
  leftEye.addComponent('render', { type: 'sphere' });
  leftEye.render.material = bloodEyeMat;
  leftEye.setLocalPosition(-0.18, 0.04, -0.48);
  leftEye.setLocalScale(0.15, 0.18, 0.08);
  entity.addChild(leftEye);

  const rightEye = new Entity('rightEye' + id);
  rightEye.addComponent('render', { type: 'sphere' });
  rightEye.render.material = bloodEyeMat;
  rightEye.setLocalPosition(0.18, 0.04, -0.48);
  rightEye.setLocalScale(0.15, 0.18, 0.08);
  entity.addChild(rightEye);

  // Enraged angled dark zombie brows
  const leftBrow = new Entity('leftBrow' + id);
  leftBrow.addComponent('render', { type: 'box' });
  leftBrow.render.material = darkMouthMat;
  leftBrow.setLocalPosition(-0.2, 0.18, -0.47);
  leftBrow.setLocalEulerAngles(0, 0, -28);
  leftBrow.setLocalScale(0.24, 0.07, 0.06);
  entity.addChild(leftBrow);

  const rightBrow = new Entity('rightBrow' + id);
  rightBrow.addComponent('render', { type: 'box' });
  rightBrow.render.material = darkMouthMat;
  rightBrow.setLocalPosition(0.2, 0.18, -0.47);
  rightBrow.setLocalEulerAngles(0, 0, 28);
  rightBrow.setLocalScale(0.24, 0.07, 0.06);
  entity.addChild(rightBrow);

  // Snarling jagged mouth with fangs
  const mouth = new Entity('mouth' + id);
  mouth.addComponent('render', { type: 'box' });
  mouth.render.material = darkMouthMat;
  mouth.setLocalPosition(0, -0.15, -0.48);
  mouth.setLocalScale(0.22, 0.08, 0.05);
  entity.addChild(mouth);

  const leftFang = new Entity('leftFang' + id);
  leftFang.addComponent('render', { type: 'box' });
  leftFang.render.material = fangMat;
  leftFang.setLocalPosition(-0.06, -0.13, -0.5);
  leftFang.setLocalScale(0.04, 0.06, 0.03);
  entity.addChild(leftFang);

  const rightFang = new Entity('rightFang' + id);
  rightFang.addComponent('render', { type: 'box' });
  rightFang.render.material = fangMat;
  rightFang.setLocalPosition(0.06, -0.13, -0.5);
  rightFang.setLocalScale(0.04, 0.06, 0.03);
  entity.addChild(rightFang);

  // 3. Zombie Claws / Hands
  const leftHand = new Entity('leftHand' + id);
  leftHand.addComponent('render', { type: 'sphere' });
  leftHand.render.material = material;
  leftHand.setLocalScale(0.32, 0.32, 0.32);
  leftHand.setLocalPosition(-0.7, 0, 0.05);
  entity.addChild(leftHand);

  const rightHand = new Entity('rightHand' + id);
  rightHand.addComponent('render', { type: 'sphere' });
  rightHand.render.material = material;
  rightHand.setLocalScale(0.32, 0.32, 0.32);
  rightHand.setLocalPosition(0.7, 0, -0.28);

  // Jagged Machete / Sword Weapon
  const machete = new Entity('machete' + id);

  // Handle
  const handle = new Entity('handle' + id);
  handle.addComponent('render', { type: 'cylinder' });
  handle.render.material = rustHelmetMat;
  handle.setLocalPosition(0, 0, -0.15);
  handle.setLocalEulerAngles(90, 0, 0);
  handle.setLocalScale(0.1, 0.35, 0.1);
  machete.addChild(handle);

  // Wicked Serrated Blade
  const blade = new Entity('blade' + id);
  blade.addComponent('render', { type: 'box' });
  blade.render.material = bladeSteelMat;
  blade.setLocalPosition(0, 0.04, -0.7);
  blade.setLocalEulerAngles(-8, 0, 0);
  blade.setLocalScale(0.08, 0.34, 0.85);
  machete.addChild(blade);

  // Glowing toxic blood tip
  const bladeTip = new Entity('bladeTip' + id);
  bladeTip.addComponent('render', { type: 'sphere' });
  bladeTip.render.material = bloodEyeMat;
  bladeTip.setLocalPosition(0, 0.06, -1.15);
  bladeTip.setLocalScale(0.12, 0.12, 0.12);
  machete.addChild(bladeTip);

  rightHand.addChild(machete);
  entity.addChild(rightHand);

  // 4. Zombie Feet / Boots
  const leftFoot = new Entity('leftFoot' + id);
  leftFoot.addComponent('render', { type: 'box' });
  leftFoot.render.material = rustHelmetMat;
  leftFoot.setLocalPosition(-0.22, -0.48, 0.05);
  leftFoot.setLocalScale(0.18, 0.12, 0.26);
  entity.addChild(leftFoot);

  const rightFoot = new Entity('rightFoot' + id);
  rightFoot.addComponent('render', { type: 'box' });
  rightFoot.render.material = rustHelmetMat;
  rightFoot.setLocalPosition(0.22, -0.48, 0.05);
  rightFoot.setLocalScale(0.18, 0.12, 0.26);
  entity.addChild(rightFoot);

  // Sickly Toxic Green Point Light
  const lightEntity = new Entity('pointLight' + id);
  lightEntity.addComponent('light', {
    type: 'omni',
    color: new Color(0.2, 0.9, 0.3),
    intensity: 1.8,
    range: 4.5,
    shadow: false
  });
  lightEntity.setPosition(0, 0.8, 0);
  entity.addChild(lightEntity);

  physics.app.root.addChild(entity);
  physics.playerEntities.set(id, entity);
  physics.playerLights.set(id, lightEntity);
  return entity;
}

/**
 * Creates a deployed ground defense turret on the arena floor.
 */
export function createGroundTurret(physics, posX, posZ) {
  const turret = new Entity('groundTurret');
  turret.setPosition(posX, -0.48, posZ);

  const baseMat = new StandardMaterial();
  baseMat.diffuse = new Color(0.12, 0.16, 0.22);
  baseMat.metalness = 0.9;
  baseMat.roughness = 0.25;
  baseMat.update();

  const accentMat = new StandardMaterial();
  accentMat.diffuse = new Color(0.0, 0.85, 1.0);
  accentMat.emissive = new Color(0.0, 0.85, 1.0);
  accentMat.emissiveIntensity = 4.5;
  accentMat.update();

  // 1. Heavy Tripod Base
  const basePlate = new Entity('turretBase');
  basePlate.addComponent('render', { type: 'cylinder' });
  basePlate.render.material = baseMat;
  basePlate.setLocalScale(0.85, 0.12, 0.85);
  turret.addChild(basePlate);

  for (let i = 0; i < 3; i++) {
    const angle = (i * 120) * (Math.PI / 180);
    const leg = new Entity('turretLeg' + i);
    leg.addComponent('render', { type: 'box' });
    leg.render.material = baseMat;
    leg.setLocalPosition(Math.sin(angle) * 0.45, 0.05, Math.cos(angle) * 0.45);
    leg.setLocalEulerAngles(0, (i * 120), 25);
    leg.setLocalScale(0.14, 0.1, 0.55);
    turret.addChild(leg);
  }

  const mast = new Entity('turretMast');
  mast.addComponent('render', { type: 'cylinder' });
  mast.render.material = baseMat;
  mast.setLocalPosition(0, 0.25, 0);
  mast.setLocalScale(0.24, 0.4, 0.24);
  turret.addChild(mast);

  // 2. Swiveling Turret Head Assembly
  const head = new Entity('turretHead');
  head.setLocalPosition(0, 0.5, 0);

  const pod = new Entity('turretPod');
  pod.addComponent('render', { type: 'box' });
  pod.render.material = baseMat;
  pod.setLocalPosition(0, 0, 0);
  pod.setLocalScale(0.48, 0.32, 0.65);
  head.addChild(pod);

  const barrelL = new Entity('turretBarrelL');
  barrelL.addComponent('render', { type: 'cylinder' });
  barrelL.render.material = baseMat;
  barrelL.setLocalPosition(-0.16, -0.04, -0.65);
  barrelL.setLocalEulerAngles(90, 0, 0);
  barrelL.setLocalScale(0.09, 0.75, 0.09);
  head.addChild(barrelL);

  const barrelR = new Entity('turretBarrelR');
  barrelR.addComponent('render', { type: 'cylinder' });
  barrelR.render.material = baseMat;
  barrelR.setLocalPosition(0.16, -0.04, -0.65);
  barrelR.setLocalEulerAngles(90, 0, 0);
  barrelR.setLocalScale(0.09, 0.75, 0.09);
  head.addChild(barrelR);

  const optic = new Entity('turretOptic');
  optic.addComponent('render', { type: 'sphere' });
  optic.render.material = accentMat;
  optic.setLocalPosition(0, 0.12, -0.34);
  optic.setLocalScale(0.14, 0.14, 0.14);
  head.addChild(optic);

  const turretBeam = new Entity('turretLaser');
  turretBeam.addComponent('render', { type: 'box' });
  turretBeam.render.material = accentMat;
  turretBeam.setLocalPosition(0, 0.12, -7.5);
  turretBeam.setLocalScale(0.02, 0.02, 14.0);
  turretBeam.render.castShadows = false;
  head.addChild(turretBeam);

  turret.addChild(head);

  const light = new Entity('turretLight');
  light.addComponent('light', { type: 'omni', color: new Color(0, 0.85, 1), intensity: 2.2, range: 6 });
  light.setLocalPosition(0, 0.6, 0);
  turret.addChild(light);

  physics.app.root.addChild(turret);
  return { entity: turret, head, cooldown: 0 };
}
