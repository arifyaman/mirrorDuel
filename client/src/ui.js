import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

const PLAYER_NAME_COLORS = { 1: '#ff4444', 2: '#4488ff' };

export class UI {
  constructor(app, circumference, max, cameraComponent) {
    this.app = app;
    this.circumference = circumference;
    this.max = max;
    this.cameraComponent = cameraComponent;
    this.maxPerSkill = [3, 7, 7];
    this.healthBarEntities = new Map();
    this.nameLabelEls = new Map();
    this.slashBarEntities = new Map();
    this.fireBar = null;
    this.shieldBar = null;
    this.dashBar = null;
    this.rings = [];
    this.texts = [];
    this.container = null;
    this._createCooldownElements();
    this._createFlashOverlay();
    this._createWaveHUD();
  }

  update(players, cooldowns, maxPerSkill, myPlayerId, names) {
    this._updateHealthBars(players);
    this._updateNameLabels(players, names);
    this._updateSkillCooldownBars(players, myPlayerId);
    this._updateSlashCooldownBars(players, myPlayerId);
    this._updateCooldowns(cooldowns, maxPerSkill);
  }

  _updateNameLabels(players, names) {
    if (!this.cameraComponent || !this.cameraComponent.camera) return;
    const camera = this.cameraComponent.camera;
    const canvas = this.app.graphicsDevice.canvas;
    const activeIds = new Set();
    const worldPos = new Vec3();
    const screenPos = new Vec3();

    for (const p of players) {
      activeIds.add(p.id);
      let el = this.nameLabelEls.get(p.id);
      if (!el) {
        el = document.createElement('div');
        el.style.cssText = `
          position: fixed;
          transform: translate(-50%, -100%);
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: bold;
          text-shadow: 0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7);
          pointer-events: none;
          z-index: 140;
          white-space: nowrap;
        `;
        document.body.appendChild(el);
        this.nameLabelEls.set(p.id, el);
      }

      const dead = p.health <= 0;
      if (dead) {
        el.style.display = 'none';
        continue;
      }

      worldPos.set(p.x, p.y + (p.id >= 100 ? 1.35 : 1.6), p.z);
      camera.worldToScreen(worldPos, canvas.width, canvas.height, screenPos);
      el.style.display = 'block';
      el.style.left = `${screenPos.x}px`;
      el.style.top = `${screenPos.y}px`;
      if (p.id >= 100) {
        el.style.color = '#ff3d00';
        el.textContent = '🧟 ZOMBIE';
      } else {
        el.style.color = PLAYER_NAME_COLORS[p.id] || '#fff';
        el.textContent = (names && names[p.id]) || ('P' + p.id);
      }
    }

    for (const [id, el] of this.nameLabelEls) {
      if (!activeIds.has(id)) {
        if (el.parentNode) el.parentNode.removeChild(el);
        this.nameLabelEls.delete(id);
      }
    }
  }

  _updateHealthBars(players) {
    const activeIds = new Set();
    for (const p of players) {
      activeIds.add(p.id);
      let bar = this.healthBarEntities.get(p.id);
      if (!bar) {
        bar = this._createHealthBar(p.id);
        this.healthBarEntities.set(p.id, bar);
      }
      const dead = p.health <= 0;
      bar.bg.enabled = !dead;
      bar.fill.enabled = !dead;
      if (dead) continue;
      const maxHp = p.id >= 100 ? 24 : 100;
      const ratio = Math.max(0, Math.min(1, p.health / maxHp));
      const fullWidth = p.id >= 100 ? 0.9 : 1.6;
      bar.bg.setLocalScale(fullWidth, 0.08, 0.08);
      bar.fill.setLocalScale(fullWidth * ratio, 0.08, 0.08);
      bar.bg.setPosition(p.x, p.y + (p.id >= 100 ? 1.2 : 1.4), p.z);
      bar.fill.setPosition(p.x + (ratio - 1) * fullWidth * 0.5, p.y + (p.id >= 100 ? 1.2 : 1.4), p.z);
      const fillMat = bar.fill.render.material;
      if (ratio > 0.6) {
        fillMat.diffuse = new Color(0.0, 0.85, 0.1);
        fillMat.emissive = new Color(0.0, 0.8, 0.1);
      } else if (ratio > 0.3) {
        fillMat.diffuse = new Color(0.85, 0.7, 0.0);
        fillMat.emissive = new Color(0.8, 0.6, 0.0);
      } else {
        fillMat.diffuse = new Color(0.9, 0.1, 0.0);
        fillMat.emissive = new Color(0.9, 0.0, 0.0);
      }
      fillMat.update();
    }
    for (const [id, bar] of this.healthBarEntities) {
      if (!activeIds.has(id)) {
        if (bar.bg.parent) bar.bg.parent.removeChild(bar.bg);
        bar.bg.destroy();
        if (bar.fill.parent) bar.fill.parent.removeChild(bar.fill);
        bar.fill.destroy();
        this.healthBarEntities.delete(id);
      }
    }
  }

  _createHealthBar(id) {
    const bg = new Entity('hpBg' + id);
    bg.addComponent('render', { type: 'box' });
    const bgMat = new StandardMaterial();
    bgMat.diffuse = new Color(0.15, 0.15, 0.15);
    bgMat.emissive = new Color(0.1, 0.1, 0.1);
    bgMat.opacity = 0.7;
    bgMat.blendType = 2;
    bgMat.alphaWrite = false;
    bgMat.update();
    bg.render.material = bgMat;
    bg.setLocalScale(1.6, 0.08, 0.08);
    this.app.root.addChild(bg);

    const fill = new Entity('hpFill' + id);
    fill.addComponent('render', { type: 'box' });
    const fillMat = new StandardMaterial();
    fillMat.emissiveIntensity = 1.8;
    fillMat.roughness = 0.2;
    fillMat.metalness = 0.8;
    fillMat.update();
    fill.render.material = fillMat;
    fill.setLocalScale(1.6, 0.08, 0.08);
    this.app.root.addChild(fill);

    return { bg, fill };
  }

  _createSlashCooldownBar(id) {
    const bar = new Entity('slashCd' + id);
    bar.addComponent('render', { type: 'box' });
    const mat = new StandardMaterial();
    mat.diffuse = new Color(0, 0, 0);
    mat.emissive = new Color(0.6, 0.6, 0.6);
    mat.opacity = 0.8;
    mat.blendType = 2;
    mat.alphaWrite = false;
    mat.update();
    bar.render.material = mat;
    bar.setLocalScale(1.6, 0.04, 0.04);
    bar.enabled = false;
    this.app.root.addChild(bar);
    return bar;
  }

  _updateSlashCooldownBars(players, myPlayerId) {
    for (const p of players) {
      if (p.id !== myPlayerId) continue;
      let bar = this.slashBarEntities.get(p.id);
      if (!bar) {
        bar = this._createSlashCooldownBar(p.id);
        this.slashBarEntities.set(p.id, bar);
      }
      const dead = p.health <= 0;
      const ready = p.slashCooldown <= 0;
      if (dead || ready) {
        bar.enabled = false;
        continue;
      }
      const maxCd = 0.5;
      const ratio = Math.max(0, Math.min(1, 1 - p.slashCooldown / maxCd));
      const fullWidth = 1.6;
      bar.enabled = true;
      bar.setLocalScale(fullWidth * ratio, 0.04, 0.04);
      bar.setPosition(p.x + (ratio - 1) * fullWidth * 0.5, p.y + 1.3, p.z);
    }
    for (const [id, bar] of this.slashBarEntities) {
      const found = players.some(p => p.id === id && p.id === myPlayerId);
      if (!found) {
        if (bar.parent) bar.parent.removeChild(bar);
        bar.destroy();
        this.slashBarEntities.delete(id);
      }
    }
  }

  _createSkillCooldownBar(name, color) {
    const bar = new Entity(name);
    bar.addComponent('render', { type: 'box' });
    const mat = new StandardMaterial();
    mat.diffuse = new Color(0, 0, 0);
    mat.emissive = new Color(color[0], color[1], color[2]);
    mat.opacity = 0.8;
    mat.blendType = 2;
    mat.alphaWrite = false;
    mat.update();
    bar.render.material = mat;
    bar.setLocalScale(1.6, 0.04, 0.04);
    bar.enabled = false;
    this.app.root.addChild(bar);
    return bar;
  }

  _updateSkillCooldownBars(players, myPlayerId) {
    const myPlayer = players.find(p => p.id === myPlayerId);
    if (!myPlayer || myPlayer.health <= 0) {
      if (this.fireBar) this.fireBar.enabled = false;
      if (this.shieldBar) this.shieldBar.enabled = false;
      if (this.dashBar) this.dashBar.enabled = false;
      return;
    }

    const fullWidth = 1.6;

    // Fire bar (red) — y+1.2
    const fireCd = myPlayer.cooldown || 0;
    if (fireCd > 0) {
      if (!this.fireBar) this.fireBar = this._createSkillCooldownBar('fireCd', [1.0, 0.27, 0.27]);
      const ratio = Math.max(0, Math.min(1, 1 - fireCd / 3));
      this.fireBar.enabled = true;
      this.fireBar.setLocalScale(fullWidth * ratio, 0.04, 0.04);
      this.fireBar.setPosition(myPlayer.x + (ratio - 1) * fullWidth * 0.5, myPlayer.y + 1.2, myPlayer.z);
    } else if (this.fireBar) {
      this.fireBar.enabled = false;
    }

    // Shield bar (blue) — y+1.15
    const shieldCd = myPlayer.shieldCooldown || 0;
    if (shieldCd > 0) {
      if (!this.shieldBar) this.shieldBar = this._createSkillCooldownBar('shieldCd', [0.27, 0.53, 1.0]);
      const ratio = Math.max(0, Math.min(1, 1 - shieldCd / 7));
      this.shieldBar.enabled = true;
      this.shieldBar.setLocalScale(fullWidth * ratio, 0.04, 0.04);
      this.shieldBar.setPosition(myPlayer.x + (ratio - 1) * fullWidth * 0.5, myPlayer.y + 1.15, myPlayer.z);
    } else if (this.shieldBar) {
      this.shieldBar.enabled = false;
    }

    // Dash bar (yellow) — y+1.25
    const dashCd = myPlayer.dashCooldown || 0;
    if (dashCd > 0) {
      if (!this.dashBar) this.dashBar = this._createSkillCooldownBar('dashCd', [1.0, 0.67, 0.0]);
      const ratio = Math.max(0, Math.min(1, 1 - dashCd / 7));
      this.dashBar.enabled = true;
      this.dashBar.setLocalScale(fullWidth * ratio, 0.04, 0.04);
      this.dashBar.setPosition(myPlayer.x + (ratio - 1) * fullWidth * 0.5, myPlayer.y + 1.25, myPlayer.z);
    } else if (this.dashBar) {
      this.dashBar.enabled = false;
    }
  }

  _createCooldownElements() {
    const ringSize = 52;
    const halfSide = 48;
    const triHeight = Math.round(halfSide * Math.sqrt(3));

    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;bottom:30px;right:20px;pointer-events:none;z-index:100;width:' + (halfSide * 2 + ringSize) + 'px;height:' + (triHeight + ringSize) + 'px;';

    for (let i = 0; i < 3; i++) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:absolute;width:' + ringSize + 'px;height:' + ringSize + 'px;';

      if (i === 0) {
        wrapper.style.cssText += 'left:0;bottom:0;';
      } else if (i === 1) {
        wrapper.style.cssText += 'left:' + halfSide + 'px;bottom:' + triHeight + 'px;';
      } else {
        wrapper.style.cssText += 'right:0;bottom:0;';
      }

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 80 80');
      svg.setAttribute('width', '80');
      svg.setAttribute('height', '80');
      svg.style.cssText = 'width:100%;height:100%;';

      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bg.setAttribute('cx', '40'); bg.setAttribute('cy', '40'); bg.setAttribute('r', '32');
      bg.setAttribute('fill', 'rgba(0,0,0,0.5)');
      bg.setAttribute('stroke', 'rgba(255,255,255,0.15)');
      bg.setAttribute('stroke-width', '4');
      svg.appendChild(bg);

      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', '40'); ring.setAttribute('cy', '40');
      ring.setAttribute('r', '32');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', i === 0 ? '#ff4444' : (i === 1 ? '#ffaa00' : '#4488ff'));
      ring.setAttribute('stroke-width', '4');
      ring.setAttribute('stroke-linecap', 'round');
      ring.setAttribute('stroke-dasharray', this.circumference);
      ring.setAttribute('stroke-dashoffset', this.circumference);
      ring.setAttribute('transform', 'rotate(-90 40 40)');
      svg.appendChild(ring);

      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('viewBox', '0 0 80 80');
      iconSvg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:' + ringSize + 'px;height:' + ringSize + 'px;';

      const iconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      iconGroup.setAttribute('transform', 'translate(40,40)');
      iconGroup.setAttribute('opacity', '0.85');

      const iconColor = i === 0 ? '#ff4444' : (i === 1 ? '#ffaa00' : '#4488ff');
      iconGroup.setAttribute('stroke', iconColor);
      iconGroup.setAttribute('stroke-width', '2.8');
      iconGroup.setAttribute('stroke-linecap', 'round');
      iconGroup.setAttribute('stroke-linejoin', 'round');
      iconGroup.setAttribute('fill', 'none');

      if (i === 0) {
        const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        crosshair.setAttribute('stroke', iconColor);
        crosshair.setAttribute('stroke-width', '2.5');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '0'); circle.setAttribute('cy', '0'); circle.setAttribute('r', '11');
        circle.setAttribute('fill', 'none');
        crosshair.appendChild(circle);

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', '0'); dot.setAttribute('cy', '0'); dot.setAttribute('r', '1.5');
        dot.setAttribute('fill', iconColor);
        dot.setAttribute('stroke', 'none');
        crosshair.appendChild(dot);

        const topLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        topLine.setAttribute('x1', '0'); topLine.setAttribute('y1', '-16'); topLine.setAttribute('x2', '0'); topLine.setAttribute('y2', '-13');
        crosshair.appendChild(topLine);

        const bottomLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        bottomLine.setAttribute('x1', '0'); bottomLine.setAttribute('y1', '13'); bottomLine.setAttribute('x2', '0'); bottomLine.setAttribute('y2', '16');
        crosshair.appendChild(bottomLine);

        const leftLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLine.setAttribute('x1', '-16'); leftLine.setAttribute('y1', '0'); leftLine.setAttribute('x2', '-13'); leftLine.setAttribute('y2', '0');
        crosshair.appendChild(leftLine);

        const rightLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLine.setAttribute('x1', '13'); rightLine.setAttribute('y1', '0'); rightLine.setAttribute('x2', '16'); rightLine.setAttribute('y2', '0');
        crosshair.appendChild(rightLine);

        iconGroup.appendChild(crosshair);
      } else if (i === 1) {
        const bolt = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        bolt.setAttribute('points', '2,-16 -7,-1 0,-1 -3,16 9,-1 2,-1');
        bolt.setAttribute('fill', iconColor);
        bolt.setAttribute('stroke', iconColor);
        bolt.setAttribute('stroke-width', '1.5');
        iconGroup.appendChild(bolt);
      } else {
        const shield = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shield.setAttribute('d', 'M0,-16 L14,-10 L14,3 C14,12 8,17 0,21 C-8,17 -14,12 -14,3 L-14,-10 Z');
        shield.setAttribute('fill', iconColor + '40');
        shield.setAttribute('stroke', iconColor);
        shield.setAttribute('stroke-width', '2.5');
        iconGroup.appendChild(shield);

        const innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        innerLine.setAttribute('x1', '0'); innerLine.setAttribute('y1', '-7');
        innerLine.setAttribute('x2', '0'); innerLine.setAttribute('y2', '12');
        innerLine.setAttribute('stroke', iconColor);
        innerLine.setAttribute('stroke-width', '2');
        iconGroup.appendChild(innerLine);

        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '-7'); hLine.setAttribute('y1', '3');
        hLine.setAttribute('x2', '7'); hLine.setAttribute('y2', '3');
        hLine.setAttribute('stroke', iconColor);
        hLine.setAttribute('stroke-width', '2');
        iconGroup.appendChild(hLine);
      }

      iconSvg.appendChild(iconGroup);

      const keyLabel = document.createElement('div');
      const keys = ['L-Click / R', 'Space', 'F'];
      keyLabel.style.cssText = 'position:absolute;top:-16px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.7);font-family:monospace;font-size:9px;font-weight:bold;white-space:nowrap;';
      keyLabel.textContent = keys[i];

      const label = document.createElement('div');
      label.style.cssText = 'position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.6);font-family:monospace;font-size:10px;white-space:nowrap;';
      label.textContent = i === 0 ? 'Burst (5)' : (i === 1 ? 'Dash' : 'Shield');

      wrapper.appendChild(svg);
      wrapper.appendChild(iconSvg);
      wrapper.appendChild(keyLabel);
      wrapper.appendChild(label);
      this.container.appendChild(wrapper);

      this.rings.push(ring);
      this.texts.push(label);
    }

    document.body.appendChild(this.container);
  }

  _updateCooldowns(cooldowns, maxPerSkill) {
    if (!this.rings.length) return;
    for (let i = 0; i < 3; i++) {
      const ring = this.rings[i];
      const label = this.texts[i];
      if (!ring || !label) continue;
      const cd = cooldowns[i] || 0;

      if (i === 0) {
        // Weapon skill (5-shot burst + reload)
        if (cd > 0.20) {
          // In reload state (1.35s)
          const ratio = 1 - (cd / 1.35);
          ring.setAttribute('stroke', '#ffaa00');
          ring.setAttribute('stroke-dashoffset', this.circumference * (1 - ratio));
          label.textContent = `RELOAD ${cd.toFixed(1)}s`;
          label.style.color = '#ffaa00';
        } else if (cd > 0.02) {
          // Intra-burst interval
          ring.setAttribute('stroke', '#ff4444');
          ring.setAttribute('stroke-dashoffset', this.circumference * (cd / 0.14));
          label.textContent = 'BURST';
          label.style.color = '#ff8888';
        } else {
          // Ready to fire 5-shot burst
          ring.setAttribute('stroke', '#ff4444');
          ring.setAttribute('stroke-dashoffset', 0);
          label.textContent = 'READY (5)';
          label.style.color = 'rgba(255,255,255,0.7)';
        }
      } else {
        // Dash & Shield
        const max = (maxPerSkill && maxPerSkill[i]) || this.max;
        if (cd <= 0) {
          ring.setAttribute('stroke-dashoffset', 0);
          label.textContent = i === 1 ? 'Dash' : 'Shield';
          label.style.color = 'rgba(255,255,255,0.7)';
        } else {
          const ratio = 1 - (cd / max);
          ring.setAttribute('stroke-dashoffset', this.circumference * (1 - ratio));
          label.textContent = cd > 1
            ? Math.ceil(cd) + 's'
            : (cd > 0.02 ? cd.toFixed(2) + 's' : (i === 1 ? 'Dash' : 'Shield'));
          label.style.color = 'rgba(255,255,255,0.7)';
        }
      }
    }
  }

  _createFlashOverlay() {
    this.flashOverlay = document.createElement('div');
    this.flashOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:150;background:rgba(255,0,0,0);transition:opacity 0.15s ease-out;';
    document.body.appendChild(this.flashOverlay);
  }

  showHitIndicator() {
    this.flashOverlay.style.transition = 'none';
    this.flashOverlay.style.background = 'rgba(255,0,0,0.35)';
    this.flashOverlay.style.opacity = '1';
    void this.flashOverlay.offsetHeight;
    this.flashOverlay.style.transition = 'opacity 0.25s ease-out';
    this.flashOverlay.style.opacity = '0';
  }

  showDeathLabel(isMe) {
    const label = document.createElement('div');
    label.textContent = isMe ? 'GOT SHIT ON!' : 'WINNER!';
    label.className = 'death-label';
    label.style.cssText = `
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      font-family:'Impact','Arial Black',sans-serif;font-size:72px;font-weight:900;
      letter-spacing:4px;text-transform:uppercase;pointer-events:none;z-index:200;
      color:${isMe ? '#ff2244' : '#00ff88'};
      text-shadow:0 0 20px ${isMe ? '#ff2244' : '#00ff88'}, 0 0 40px ${isMe ? '#ff2244' : '#00ff88'};
      opacity:0;transition:opacity 0.3s ease-in;
    `;
    document.body.appendChild(label);
    requestAnimationFrame(() => { label.style.opacity = '1'; });
  }

  clearDeathLabels() {
    document.querySelectorAll('.death-label').forEach(el => el.remove());
  }

  destroy() {
    for (const [, bar] of this.healthBarEntities) {
      if (bar.bg.parent) bar.bg.parent.removeChild(bar.bg);
      bar.bg.destroy();
      if (bar.fill.parent) bar.fill.parent.removeChild(bar.fill);
      bar.fill.destroy();
    }
    this.healthBarEntities.clear();
    for (const [, el] of this.nameLabelEls) {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    this.nameLabelEls.clear();
    for (const [, bar] of this.slashBarEntities) {
      if (bar.parent) bar.parent.removeChild(bar);
      bar.destroy();
    }
    this.slashBarEntities.clear();
    for (const bar of [this.fireBar, this.shieldBar, this.dashBar]) {
      if (bar) {
        if (bar.parent) bar.parent.removeChild(bar);
        bar.destroy();
      }
    }
    this.fireBar = null;
    this.shieldBar = null;
    this.dashBar = null;
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.flashOverlay && this.flashOverlay.parentNode) {
      this.flashOverlay.parentNode.removeChild(this.flashOverlay);
    }
    if (this.waveHUD && this.waveHUD.parentNode) {
      this.waveHUD.parentNode.removeChild(this.waveHUD);
    }
  }

  _createWaveHUD() {
    this.waveHUD = document.createElement('div');
    this.waveHUD.id = 'wave-hud';
    this.waveHUD.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(12, 18, 26, 0.88);
      backdrop-filter: blur(8px);
      padding: 8px 24px;
      border-radius: 20px;
      border: 1px solid rgba(0, 230, 118, 0.4);
      box-shadow: 0 4px 24px rgba(0,0,0,0.8), 0 0 15px rgba(0, 230, 118, 0.25);
      z-index: 120;
      font-family: 'Courier New', monospace;
      user-select: none;
      pointer-events: none;
    `;

    this.waveBadge = document.createElement('div');
    this.waveBadge.style.cssText = `
      font-weight: 900;
      font-size: 16px;
      color: #00e676;
      letter-spacing: 2px;
      text-shadow: 0 0 10px rgba(0, 230, 118, 0.8);
      white-space: nowrap;
    `;
    this.waveBadge.textContent = 'WAVE 1';

    const divider1 = document.createElement('div');
    divider1.style.cssText = 'width: 1px; height: 18px; background: rgba(255,255,255,0.2);';

    this.timerBadge = document.createElement('div');
    this.timerBadge.style.cssText = `
      font-weight: bold;
      font-size: 15px;
      color: #ffffff;
      letter-spacing: 1px;
      white-space: nowrap;
      text-shadow: 0 0 6px rgba(255,255,255,0.4);
    `;
    this.timerBadge.textContent = '⏱️ 01:00';

    const divider2 = document.createElement('div');
    divider2.style.cssText = 'width: 1px; height: 18px; background: rgba(255,255,255,0.2);';

    this.threatBadge = document.createElement('div');
    this.threatBadge.style.cssText = `
      font-weight: bold;
      font-size: 14px;
      color: #ffaa00;
      letter-spacing: 1px;
      white-space: nowrap;
      text-shadow: 0 0 8px rgba(255, 170, 0, 0.6);
    `;
    this.threatBadge.textContent = '🧟 0 | 💀 0';

    this.waveHUD.appendChild(this.waveBadge);
    this.waveHUD.appendChild(divider1);
    this.waveHUD.appendChild(this.timerBadge);
    this.waveHUD.appendChild(divider2);
    this.waveHUD.appendChild(this.threatBadge);
    document.body.appendChild(this.waveHUD);
  }

  updateWave(wave, state, timeLeft, aliveZombies, totalKills) {
    if (!this.waveBadge || !this.timerBadge || !this.threatBadge) return;

    if (state === 0) {
      // Wave in progress (60s round)
      const mins = Math.floor(timeLeft / 60);
      const secs = Math.floor(timeLeft % 60);
      const timeStr = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      this.waveBadge.textContent = `WAVE ${wave}`;
      this.waveBadge.style.color = '#00e676';
      this.waveBadge.style.textShadow = '0 0 10px rgba(0, 230, 118, 0.8)';
      this.timerBadge.textContent = `⏱️ ${timeStr}`;
      this.timerBadge.style.color = timeLeft <= 10 ? '#ff3d00' : '#ffffff';
      this.threatBadge.textContent = `🧟 ${aliveZombies} | 💀 ${totalKills}`;
    } else {
      // Intermission (5s countdown)
      this.waveBadge.textContent = `WAVE ${wave} CLEAR!`;
      this.waveBadge.style.color = '#ffaa00';
      this.waveBadge.style.textShadow = '0 0 12px rgba(255, 170, 0, 0.9)';
      this.timerBadge.textContent = `NEXT IN ${Math.ceil(timeLeft)}s`;
      this.timerBadge.style.color = '#00e676';
      this.threatBadge.textContent = `💀 ${totalKills} KILLS`;
    }
  }

  showWaveBanner(title, subtitle, color = '#00e676') {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: rgba(10, 15, 20, 0.92);
      border: 2px solid ${color};
      border-radius: 16px;
      padding: 24px 48px;
      text-align: center;
      box-shadow: 0 0 40px ${color}, inset 0 0 20px ${color};
      z-index: 250;
      pointer-events: none;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-family: 'Impact', 'Arial Black', sans-serif;
    `;

    const titleEl = document.createElement('div');
    titleEl.style.cssText = `
      font-size: 42px;
      font-weight: 900;
      color: ${color};
      letter-spacing: 3px;
      text-shadow: 0 0 20px ${color};
      margin-bottom: 6px;
    `;
    titleEl.textContent = title;

    const subEl = document.createElement('div');
    subEl.style.cssText = `
      font-size: 18px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
      opacity: 0.9;
    `;
    subEl.textContent = subtitle;

    banner.appendChild(titleEl);
    banner.appendChild(subEl);
    document.body.appendChild(banner);

    requestAnimationFrame(() => {
      banner.style.opacity = '1';
      banner.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.transform = 'translate(-50%, -50%) scale(1.1)';
      setTimeout(() => banner.remove(), 400);
    }, 2400);
  }

  showUpgradeModal(perks, onSelect) {
    // Remove existing modal if any
    const existing = document.getElementById('upgrade-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'upgrade-modal';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(4, 8, 14, 0.88);
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 300;
      opacity: 0;
      transition: opacity 0.3s ease-out;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const header = document.createElement('div');
    header.style.cssText = 'text-align: center; margin-bottom: 32px;';

    const title = document.createElement('div');
    title.style.cssText = `
      font-family: 'Impact', 'Arial Black', sans-serif;
      font-size: 38px;
      color: #00e676;
      letter-spacing: 3px;
      text-shadow: 0 0 25px rgba(0, 230, 118, 0.8);
      margin-bottom: 6px;
    `;
    title.textContent = '🎖️ WAVE COMPLETED! CHOOSE AN UPGRADE';

    const subtitle = document.createElement('div');
    subtitle.style.cssText = `
      color: rgba(255, 255, 255, 0.7);
      font-family: 'Courier New', monospace;
      font-size: 14px;
      letter-spacing: 1px;
    `;
    subtitle.textContent = 'BİR ÖZELLİK SEÇ VE CEPHANELİĞİNİ GÜÇLENDİR (TUŞ: 1, 2, 3)';

    header.appendChild(title);
    header.appendChild(subtitle);
    overlay.appendChild(header);

    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = `
      display: flex;
      gap: 24px;
      max-width: 1000px;
      width: 90%;
      justify-content: center;
      align-items: stretch;
    `;

    if (this._activeUpgradeModalCleanup) {
      this._activeUpgradeModalCleanup();
    }

    const cleanup = () => {
      window.removeEventListener('keydown', keyHandler);
      this._activeUpgradeModalCleanup = null;
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    };
    this._activeUpgradeModalCleanup = cleanup;

    const selectPerk = (perk) => {
      cleanup();
      if (onSelect) onSelect(perk);
    };

    const keyHandler = (e) => {
      if (e.key === '1' && perks[0]) selectPerk(perks[0]);
      if (e.key === '2' && perks[1]) selectPerk(perks[1]);
      if (e.key === '3' && perks[2]) selectPerk(perks[2]);
    };
    window.addEventListener('keydown', keyHandler);

    perks.forEach((perk, index) => {
      const card = document.createElement('div');
      card.style.cssText = `
        flex: 1;
        background: linear-gradient(160deg, rgba(20, 28, 40, 0.95), rgba(10, 15, 22, 0.98));
        border: 2px solid ${perk.rarityColor};
        border-radius: 18px;
        padding: 28px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px ${perk.rarityColor}33;
        position: relative;
        overflow: hidden;
      `;

      card.onmouseenter = () => {
        card.style.transform = 'translateY(-10px) scale(1.03)';
        card.style.boxShadow = `0 14px 40px rgba(0, 0, 0, 0.9), 0 0 30px ${perk.rarityColor}88`;
        card.style.borderColor = '#ffffff';
      };

      card.onmouseleave = () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px ${perk.rarityColor}33`;
        card.style.borderColor = perk.rarityColor;
      };

      card.onclick = () => selectPerk(perk);

      // Key shortcut badge
      const keyBadge = document.createElement('div');
      keyBadge.style.cssText = `
        position: absolute;
        top: 12px;
        right: 14px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        padding: 2px 8px;
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.8);
      `;
      keyBadge.textContent = `KEY [${index + 1}]`;
      card.appendChild(keyBadge);

      // Rarity tag
      const rarityBadge = document.createElement('div');
      rarityBadge.style.cssText = `
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
        color: ${perk.rarityColor};
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 12px;
        text-shadow: 0 0 8px ${perk.rarityColor};
      `;
      rarityBadge.textContent = `★ ${perk.rarity}`;
      card.appendChild(rarityBadge);

      // Big Icon
      const icon = document.createElement('div');
      icon.style.cssText = 'font-size: 48px; margin-bottom: 16px; filter: drop-shadow(0 0 12px rgba(255,255,255,0.3));';
      icon.textContent = perk.icon;
      card.appendChild(icon);

      // Title
      const perkTitle = document.createElement('div');
      perkTitle.style.cssText = `
        font-family: 'Impact', 'Arial Black', sans-serif;
        font-size: 20px;
        color: #ffffff;
        letter-spacing: 1px;
        margin-bottom: 4px;
      `;
      perkTitle.textContent = perk.title;
      card.appendChild(perkTitle);

      // Subtitle
      const perkSub = document.createElement('div');
      perkSub.style.cssText = `
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: ${perk.rarityColor};
        font-weight: bold;
        margin-bottom: 14px;
      `;
      perkSub.textContent = perk.subtitle;
      card.appendChild(perkSub);

      // Description
      const desc = document.createElement('div');
      desc.style.cssText = `
        font-size: 13px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.75);
        margin-bottom: 22px;
        flex: 1;
      `;
      desc.textContent = perk.description;
      card.appendChild(desc);

      // Select Button
      const btn = document.createElement('div');
      btn.style.cssText = `
        width: 100%;
        padding: 10px 0;
        background: ${perk.rarityColor};
        color: #000;
        font-weight: bold;
        font-size: 13px;
        border-radius: 10px;
        letter-spacing: 1px;
        text-transform: uppercase;
        box-shadow: 0 0 15px ${perk.rarityColor}88;
      `;
      btn.textContent = 'SEÇ & KUŞAN';
      card.appendChild(btn);

      cardsContainer.appendChild(card);
    });

    overlay.appendChild(cardsContainer);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }

  closeUpgradeModal() {
    if (this._activeUpgradeModalCleanup) {
      this._activeUpgradeModalCleanup();
      this._activeUpgradeModalCleanup = null;
    }
  }
}
