const svgNS = 'http://www.w3.org/2000/svg';
const CIRCUMFERENCE = 2 * Math.PI * 32; // ~201.06

export class SkillHud {
  constructor(player) {
    this.player = player;
    this.container = null;
    this.progressCircle = null;
    this.textEl = null;
    this.readyEl = null;
    this._initialized = false;
    this._lastCooldown = -1;
  }

  init() {
    if (this._initialized) return;

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 80px;
      pointer-events: none;
      z-index: 100;
    `;

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    svg.style.cssText = 'width: 100%; height: 100%;';

    // Background circle
    const bgCircle = document.createElementNS(svgNS, 'circle');
    bgCircle.setAttribute('cx', '40');
    bgCircle.setAttribute('cy', '40');
    bgCircle.setAttribute('r', '32');
    bgCircle.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');
    bgCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.15)');
    bgCircle.setAttribute('stroke-width', '4');
    svg.appendChild(bgCircle);

    // Progress ring
    this.progressCircle = document.createElementNS(svgNS, 'circle');
    this.progressCircle.setAttribute('cx', '40');
    this.progressCircle.setAttribute('cy', '40');
    this.progressCircle.setAttribute('r', '32');
    this.progressCircle.setAttribute('fill', 'none');
    this.progressCircle.setAttribute('stroke', '#00ffff');
    this.progressCircle.setAttribute('stroke-width', '4');
    this.progressCircle.setAttribute('stroke-linecap', 'round');
    this.progressCircle.setAttribute('stroke-dasharray', CIRCUMFERENCE);
    this.progressCircle.setAttribute('stroke-dashoffset', CIRCUMFERENCE);
    this.progressCircle.setAttribute('transform', 'rotate(-90 40 40)');
    svg.appendChild(this.progressCircle);

    // Text overlay (cooldown seconds)
    this.textEl = document.createElement('div');
    this.textEl.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -40%);
      color: #ffffff;
      font-family: monospace, sans-serif;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      line-height: 1;
    `;
    this.textEl.textContent = '';
    this.container.appendChild(svg);
    this.container.appendChild(this.textEl);

    document.body.appendChild(this.container);
    this._initialized = true;
  }

  _formatCooldown(seconds) {
    if (seconds < 0.05) {
      return '';
    }
    if (seconds >= 1.0) {
      return Math.ceil(seconds) + 's';
    }
    return seconds.toFixed(2);
  }

  update(dt) {
    if (!this._initialized) return;

    const skill = this.player.skills[0];
    if (!skill) return;

    const cooldown = Math.max(0, skill.cooldown);
    const maxCooldown = skill.maxCooldown;

    // Only update if cooldown changed meaningfully
    if (cooldown === this._lastCooldown && cooldown <= 0) return;
    this._lastCooldown = cooldown;

    const cooldownRatio = 1 - (cooldown / maxCooldown);
    const offset = CIRCUMFERENCE * (1 - cooldownRatio);
    this.progressCircle.setAttribute('stroke-dashoffset', offset);

    // Change color when ready
    if (cooldown <= 0) {
      this.progressCircle.setAttribute('stroke', '#00ffff');
      this.textEl.textContent = 'READY';
      this.textEl.style.color = '#00ff88';
    } else {
      this.progressCircle.setAttribute('stroke', '#00ffff');
      this.textEl.style.color = '#ffffff';
      this.textEl.textContent = this._formatCooldown(cooldown);
    }
  }
}
