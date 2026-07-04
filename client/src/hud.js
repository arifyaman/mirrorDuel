export class CooldownHUD {
  constructor(circumference, max) {
    this.circumference = circumference;
    this.max = max;
    this.container = null;
    this.rings = [];
    this.texts = [];
    this.numSkills = 3;
    this.createElements();
  }

  createElements() {
    const ringSize = 80;
    const halfSide = 70;
    const triHeight = Math.round(halfSide * Math.sqrt(3));

    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;bottom:30px;right:20px;pointer-events:none;z-index:100;width:' + (halfSide * 2 + ringSize) + 'px;height:' + (triHeight + ringSize) + 'px;';

    for (let i = 0; i < this.numSkills; i++) {
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
      iconSvg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;';

      const iconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      iconGroup.setAttribute('transform', 'translate(40,40)');
      iconGroup.setAttribute('opacity', '0.85');

      const iconColor = i === 0 ? '#ff4444' : (i === 1 ? '#ffaa00' : '#4488ff');
      iconGroup.setAttribute('stroke', iconColor);
      iconGroup.setAttribute('stroke-width', '2.5');
      iconGroup.setAttribute('stroke-linecap', 'round');
      iconGroup.setAttribute('stroke-linejoin', 'round');
      iconGroup.setAttribute('fill', 'none');

      if (i === 0) {
        // Projectile: crosshair / reticle
        const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        crosshair.setAttribute('stroke', iconColor);
        crosshair.setAttribute('stroke-width', '2');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '0'); circle.setAttribute('cy', '0'); circle.setAttribute('r', '14');
        circle.setAttribute('fill', 'none');
        crosshair.appendChild(circle);

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', '0'); dot.setAttribute('cy', '0'); dot.setAttribute('r', '2');
        dot.setAttribute('fill', iconColor);
        dot.setAttribute('stroke', 'none');
        crosshair.appendChild(dot);

        const topLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        topLine.setAttribute('x1', '0'); topLine.setAttribute('y1', '-20'); topLine.setAttribute('x2', '0'); topLine.setAttribute('y2', '-17');
        crosshair.appendChild(topLine);

        const bottomLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        bottomLine.setAttribute('x1', '0'); bottomLine.setAttribute('y1', '17'); bottomLine.setAttribute('x2', '0'); bottomLine.setAttribute('y2', '20');
        crosshair.appendChild(bottomLine);

        const leftLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLine.setAttribute('x1', '-20'); leftLine.setAttribute('y1', '0'); leftLine.setAttribute('x2', '-17'); leftLine.setAttribute('y2', '0');
        crosshair.appendChild(leftLine);

        const rightLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLine.setAttribute('x1', '17'); rightLine.setAttribute('y1', '0'); rightLine.setAttribute('x2', '20'); rightLine.setAttribute('y2', '0');
        crosshair.appendChild(rightLine);

        iconGroup.appendChild(crosshair);

      } else if (i === 1) {
        // Dash: lightning bolt
        const bolt = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        bolt.setAttribute('points', '2,-18 -8,-2 0,-2 -4,18 10,2 2,2');
        bolt.setAttribute('fill', iconColor);
        bolt.setAttribute('stroke', iconColor);
        bolt.setAttribute('stroke-width', '1.5');
        iconGroup.appendChild(bolt);

      } else {
        // Shield: classic shield shape
        const shield = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shield.setAttribute('d', 'M0,-18 L16,-12 L16,4 C16,14 8,20 0,24 C-8,20 -16,14 -16,4 L-16,-12 Z');
        shield.setAttribute('fill', iconColor + '40');
        shield.setAttribute('stroke', iconColor);
        shield.setAttribute('stroke-width', '2.5');
        iconGroup.appendChild(shield);

        const innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        innerLine.setAttribute('x1', '0'); innerLine.setAttribute('y1', '-8');
        innerLine.setAttribute('x2', '0'); innerLine.setAttribute('y2', '14');
        innerLine.setAttribute('stroke', iconColor);
        innerLine.setAttribute('stroke-width', '2');
        iconGroup.appendChild(innerLine);

        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '-8'); hLine.setAttribute('y1', '4');
        hLine.setAttribute('x2', '8'); hLine.setAttribute('y2', '4');
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

  update(cooldowns) {
    if (!this.rings.length) return;
    for (let i = 0; i < this.numSkills; i++) {
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

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
