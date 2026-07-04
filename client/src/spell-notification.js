export class SpellNotification {
  constructor() {
    this.container = null;
    this.text = null;
    this.subtitle = null;
    this.particles = [];
    this.active = false;
    this.startTime = 0;
    this.duration = 2.5;
    this.mouseX = 0;
    this.mouseY = 0;
    this.createElements();
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 12%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 200;
      text-align: center;
      opacity: 0;
      transition: none;
    `;

    // Main text (spell name)
    this.text = document.createElement('div');
    this.text.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 32px;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 6px;
      text-shadow:
        0 0 10px #0ff,
        0 0 20px #0ff,
        0 0 40px #0ff,
        0 0 80px #08f;
      margin-bottom: 8px;
      line-height: 1.2;
    `;

    // Subtitle (debuff info)
    this.subtitle = document.createElement('div');
    this.subtitle.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 14px;
      font-weight: bold;
      color: #ff4444;
      text-shadow: 0 0 10px #f00, 0 0 20px #f00;
      letter-spacing: 3px;
      text-transform: uppercase;
      opacity: 0.9;
    `;

    // Container for particles
    this.particlesContainer = document.createElement('div');
    this.particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    `;

    this.container.appendChild(this.particlesContainer);
    this.container.appendChild(this.text);
    this.container.appendChild(this.subtitle);
    document.body.appendChild(this.container);
  }

  show(opponentName, isOpponentHit = false) {
    if (this.active) this.hide();
    this.active = true;
    this.startTime = performance.now();
    this.opponentName = opponentName;
    this.isOpponentHit = isOpponentHit;
    this.container.style.opacity = '1';
    this.text.textContent = isOpponentHit ? 'DEBUFFED' : 'SPELL FIRED';
    this.subtitle.textContent = `${isOpponentHit ? '⚡' : '→'} ${opponentName} ${isOpponentHit ? '⚡' : '- 50% CD'}`;
  }

  hide() {
    this.active = false;
    this.container.style.opacity = '0';
    this.particlesContainer.innerHTML = '';
    this.particles = [];
  }

  update() {
    if (!this.active) return;

    const elapsed = (performance.now() - this.startTime) / 1000;
    const progress = elapsed / this.duration;

    if (progress >= 1) {
      this.hide();
      return;
    }

    // Fade in then fade out
    let opacity = 1;
    if (progress < 0.1) {
      opacity = progress / 0.1;
    } else if (progress > 0.6) {
      opacity = 1 - ((progress - 0.6) / 0.4);
    }
    this.container.style.opacity = String(Math.max(0, opacity));

    // Subtle scale pulse
    const scale = 1 + Math.sin(elapsed * 8) * 0.05;
    this.text.style.transform = `scale(${scale})`;

    // Color shift from cyan to red over time
    const hue = 180 - progress * 100;
    const color = `hsl(${hue}, 100%, 70%)`;
    this.text.style.color = color;
    this.text.style.textShadow = `
      0 0 10px hsl(${hue}, 100%, 50%),
      0 0 20px hsl(${hue}, 100%, 40%),
      0 0 40px hsl(${hue}, 100%, 30%),
      0 0 80px hsl(${hue}, 100%, 20%)
    `;

    // Mouse parallax
    const dx = (this.mouseX - window.innerWidth / 2) / window.innerWidth;
    const dy = (this.mouseY - window.innerHeight / 2) / window.innerHeight;
    this.container.style.marginLeft = `${dx * 20}px`;
    this.container.style.marginTop = `${dy * 10}px`;

    // Spawn particles
    if (Math.random() < 0.3 && this.particles.length < 15) {
      this.spawnParticle();
    }

    // Update particles
    this.updateParticles();
  }

  spawnParticle() {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 30 + 10;
    const life = Math.random() * 0.8 + 0.3;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, #fff, hsl(${Math.random() * 60 + 160}, 100%, 60%));
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 ${size * 2}px hsl(${Math.random() * 60 + 160}, 100%, 60%);
      opacity: 1;
    `;

    this.particlesContainer.appendChild(particle);
    this.particles.push({
      el: particle,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: life,
      age: 0,
      startX: 0,
      startY: 0,
    });
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += 1 / 60;
      const progress = p.age / p.life;

      if (progress >= 1) {
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
        this.particles.splice(i, 1);
        continue;
      }

      const x = p.vx * p.age;
      const y = p.vy * p.age - p.age * p.age * 30;
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.5;

      p.el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      p.el.style.opacity = String(opacity);
    }
  }

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
