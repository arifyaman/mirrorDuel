const SKILLS = [
  {
    id: 'dash',
    label: 'DASH',
    key: 'Q',
    color: '#00ccff',
    maxCooldown: 2,
    iconPaths: [
      { d: 'M 2 -14 L -2 -2 L 2 -2 L -2 14 L 4 -2 L 0 -2 Z', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
    ]
  },
  {
    id: 'projectile',
    label: 'FIRE',
    key: 'R',
    color: '#ff4444',
    maxCooldown: 3,
    iconPaths: [
      { d: 'M 0 -12 A 12 12 0 1 1 0 12 A 12 12 0 1 1 0 -12', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
      { d: 'M 0 -18 L 0 -10 M 0 10 L 0 18 M -18 0 L -10 0 M 10 0 L 18 0', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }
    ]
  },
  {
    id: 'shield',
    label: 'SHIELD',
    key: 'E',
    color: '#44aaff',
    maxCooldown: 5,
    iconPaths: [
      { d: 'M 0 -14 L 13 -9 L 13 1 C 13 8 6 13 0 15 C -6 13 -13 8 -13 1 L -13 -9 Z', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
      { d: 'M -7 -4 L 0 4 L 7 -4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
    ]
  }
];

const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SLOT_SIZE = 64;

export class SkillsHUD {
  constructor() {
    this.container = null;
    this.cooldowns = new Map();
    this.rings = [];
    this.texts = [];
    this.createElements();
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:10px;pointer-events:none;z-index:100;';

    for (let i = 0; i < 3; i++) {
      const skill = SKILLS[i];
      const slot = document.createElement('div');
      slot.style.cssText = `width:${SLOT_SIZE}px;height:${SLOT_SIZE}px;position:relative;`;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 60 60');
      svg.setAttribute('width', SLOT_SIZE);
      svg.setAttribute('height', SLOT_SIZE);
      svg.style.cssText = 'width:100%;height:100%;';

      // Background circle
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bg.setAttribute('cx', '30'); bg.setAttribute('cy', '30');
      bg.setAttribute('r', RING_RADIUS + 4);
      bg.setAttribute('fill', 'rgba(0,0,0,0.5)');
      bg.setAttribute('stroke', 'rgba(255,255,255,0.1)');
      bg.setAttribute('stroke-width', '1');
      svg.appendChild(bg);

      // Cooldown ring
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', '30'); ring.setAttribute('cy', '30');
      ring.setAttribute('r', RING_RADIUS);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', skill.color);
      ring.setAttribute('stroke-width', '3');
      ring.setAttribute('stroke-linecap', 'round');
      ring.setAttribute('stroke-dasharray', RING_CIRCUMFERENCE);
      ring.setAttribute('stroke-dashoffset', RING_CIRCUMFERENCE);
      ring.setAttribute('transform', 'rotate(-90 30 30)');
      svg.appendChild(ring);
      this.rings.push({ el: ring, skillId: skill.id, maxCooldown: skill.maxCooldown });

      // Icon group
      const iconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      iconGroup.setAttribute('transform', 'translate(30, 28)');
      iconGroup.style.color = skill.color;

      for (const pDef of skill.iconPaths) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pDef.d);
        if (pDef.fill) path.setAttribute('fill', pDef.fill);
        if (pDef.stroke) path.setAttribute('stroke', pDef.stroke);
        if (pDef.strokeWidth) path.setAttribute('stroke-width', pDef.strokeWidth);
        if (pDef.strokeLinecap) path.setAttribute('stroke-linecap', pDef.strokeLinecap);
        if (pDef.strokeLinejoin) path.setAttribute('stroke-linejoin', pDef.strokeLinejoin);
        iconGroup.appendChild(path);
      }

      svg.appendChild(iconGroup);

      slot.appendChild(svg);

      // Text overlay for seconds
      const text = document.createElement('div');
      text.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);color:#fff;font-family:Orbitron,sans-serif;font-size:11px;font-weight:bold;text-align:center;line-height:1;pointer-events:none;`;
      text.textContent = 'READY';
      slot.appendChild(text);
      this.texts.push({ el: text, skillId: skill.id });

      // Key label below
      const keyLabel = document.createElement('div');
      keyLabel.style.cssText = `position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);color:#fff;font-family:Orbitron,sans-serif;font-size:8px;letter-spacing:0.5px;white-space:nowrap;opacity:0.6;`;
      keyLabel.textContent = `${skill.key} ${skill.label}`;

      slot.appendChild(keyLabel);
      this.container.appendChild(slot);
    }

    document.body.appendChild(this.container);
  }

  setCooldown(skillId, cooldown) {
    this.cooldowns.set(skillId, cooldown);
  }

  update(dt) {
    for (const [skillId, cooldown] of this.cooldowns) {
      if (cooldown <= 0) {
        this.cooldowns.delete(skillId);
        continue;
      }
      this.cooldowns.set(skillId, cooldown - dt);
    }

    for (const ringData of this.rings) {
      const cooldown = this.cooldowns.get(ringData.skillId) || 0;
      const maxCooldown = ringData.maxCooldown;

      if (cooldown <= 0) {
        ringData.el.setAttribute('stroke-dashoffset', 0);
        ringData.el.style.opacity = '0.25';
      } else {
        const ratio = 1 - (cooldown / maxCooldown);
        ringData.el.setAttribute('stroke-dashoffset', RING_CIRCUMFERENCE * ratio);
        ringData.el.style.opacity = '1';
      }
    }

    for (const textData of this.texts) {
      const cooldown = this.cooldowns.get(textData.skillId) || 0;
      const el = textData.el;

      if (cooldown <= 0) {
        el.textContent = 'READY';
        el.style.color = '#00ff88';
        el.style.fontSize = '10px';
      } else {
        el.style.color = '#fff';
        if (cooldown > 1) {
          el.textContent = Math.ceil(cooldown) + 's';
          el.style.fontSize = '11px';
        } else {
          el.textContent = cooldown.toFixed(1) + 's';
          el.style.fontSize = '10px';
        }
      }
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
