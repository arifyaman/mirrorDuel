const SKILLS = [
  {
    id: 'dash',
    label: 'DASH',
    key: 'Q',
    color: '#00ccff',
    iconPaths: [
      { d: 'M 2 -14 L -2 -2 L 2 -2 L -2 14 L 4 -2 L 0 -2 Z', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
    ]
  },
  {
    id: 'projectile',
    label: 'FIRE',
    key: 'R',
    color: '#ff4444',
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

      // Cooldown ring (always ready - dim)
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', '30'); ring.setAttribute('cy', '30');
      ring.setAttribute('r', RING_RADIUS);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', skill.color);
      ring.setAttribute('stroke-width', '3');
      ring.setAttribute('stroke-linecap', 'round');
      ring.setAttribute('stroke-dasharray', RING_CIRCUMFERENCE);
      ring.setAttribute('stroke-dashoffset', 0);
      ring.setAttribute('transform', 'rotate(-90 30 30)');
      ring.style.opacity = '0.25';
      svg.appendChild(ring);

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

      // Key label below
      const keyLabel = document.createElement('div');
      keyLabel.style.cssText = `position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);color:#fff;font-family:Orbitron,sans-serif;font-size:8px;letter-spacing:0.5px;white-space:nowrap;opacity:0.6;`;
      keyLabel.textContent = `${skill.key} ${skill.label}`;

      slot.appendChild(keyLabel);
      this.container.appendChild(slot);
    }

    document.body.appendChild(this.container);
  }

  update() {
    // No functional cooldown - always shows ready
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
