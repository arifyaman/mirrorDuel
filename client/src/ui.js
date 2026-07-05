import { Color, Entity, StandardMaterial } from 'playcanvas';

export class UI {
  constructor(app, circumference, max) {
    this.app = app;
    this.circumference = circumference;
    this.max = max;
    this.healthBarEntities = new Map();
    this.rings = [];
    this.texts = [];
    this.container = null;
    this._createCooldownElements();
    this._createFlashOverlay();
  }

  update(players, cooldowns) {
    this._updateHealthBars(players);
    this._updateCooldowns(cooldowns);
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
      const ratio = Math.max(0, Math.min(1, p.health / 100));
      const fullWidth = 1.6;
      bar.fill.setLocalScale(fullWidth * ratio, 0.08, 0.08);
      bar.bg.setPosition(p.x, p.y + 1.4, p.z);
      bar.fill.setPosition(p.x + (ratio - 1) * fullWidth * 0.5, p.y + 1.4, p.z);
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

      const label = document.createElement('div');
      label.style.cssText = 'position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.5);font-family:monospace;font-size:10px;white-space:nowrap;';
      label.textContent = 'Skill ' + (i + 1);

      wrapper.appendChild(svg);
      wrapper.appendChild(iconSvg);
      wrapper.appendChild(label);
      this.container.appendChild(wrapper);

      this.rings.push(ring);
      this.texts.push(label);
    }

    document.body.appendChild(this.container);
  }

  _updateCooldowns(cooldowns) {
    if (!this.rings.length) return;
    for (let i = 0; i < 3; i++) {
      const ring = this.rings[i];
      const label = this.texts[i];
      if (!ring || !label) continue;
      const cooldown = cooldowns[i] || 0;
      if (cooldown <= 0) {
        ring.setAttribute('stroke-dashoffset', 0);
        label.textContent = i === 0 ? 'Fire' : (i === 1 ? 'Dash' : 'Shield');
      } else {
        const ratio = 1 - (cooldown / this.max);
        ring.setAttribute('stroke-dashoffset', this.circumference * (1 - ratio));
        label.textContent = cooldown > 1
          ? Math.ceil(cooldown) + 's'
          : (cooldown > 0.02 ? cooldown.toFixed(2) + 's' : (i === 0 ? 'Fire' : (i === 1 ? 'Dash' : 'Shield')));
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

  destroy() {
    for (const [, bar] of this.healthBarEntities) {
      if (bar.bg.parent) bar.bg.parent.removeChild(bar.bg);
      bar.bg.destroy();
      if (bar.fill.parent) bar.fill.parent.removeChild(bar.fill);
      bar.fill.destroy();
    }
    this.healthBarEntities.clear();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.flashOverlay && this.flashOverlay.parentNode) {
      this.flashOverlay.parentNode.removeChild(this.flashOverlay);
    }
  }
}
