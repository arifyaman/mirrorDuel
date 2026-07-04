export class CooldownHUD {
  constructor(circumference, max) {
    this.circumference = circumference;
    this.max = max;
    this.container = null;
    this.ring = null;
    this.text = null;
    this.createElements();
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:80px;height:80px;pointer-events:none;z-index:100;';
    this.container.id = 'cooldown-container';

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

    this.ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.ring.setAttribute('cx', '40'); this.ring.setAttribute('cy', '40');
    this.ring.setAttribute('r', '32');
    this.ring.setAttribute('fill', 'none');
    this.ring.setAttribute('stroke', '#ff4444');
    this.ring.setAttribute('stroke-width', '4');
    this.ring.setAttribute('stroke-linecap', 'round');
    this.ring.setAttribute('stroke-dasharray', this.circumference);
    this.ring.setAttribute('stroke-dashoffset', this.circumference);
    this.ring.setAttribute('transform', 'rotate(-90 40 40)');
    svg.appendChild(this.ring);

    this.text = document.createElement('div');
    this.text.id = 'cooldown-text';
    this.text.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-40%);color:#fff;font-family:monospace;font-size:14px;font-weight:bold;text-align:center;line-height:1;';
    this.text.textContent = '';

    this.container.appendChild(svg);
    this.container.appendChild(this.text);
    document.body.appendChild(this.container);
  }

  update(cooldown) {
    if (!this.ring || !this.text) return;
    if (cooldown <= 0) {
      this.ring.setAttribute('stroke-dashoffset', 0);
      this.text.textContent = 'READY';
      this.text.style.color = '#00ff88';
    } else {
      const ratio = 1 - (cooldown / this.max);
      this.ring.setAttribute('stroke-dashoffset', this.circumference * (1 - ratio));
      this.text.textContent = cooldown > 1
        ? Math.ceil(cooldown) + 's'
        : (cooldown > 0.02 ? cooldown.toFixed(2) + 's' : '');
      this.text.style.color = '#fff';
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
