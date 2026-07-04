export class GameTitle {
  constructor() {
    this.container = null;
    this.title = null;
    this.subtitle = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.bouncing = false;
    this.bounceTime = 0;
    this.createElements();
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 36px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      pointer-events: none;
      z-index: 200;
      will-change: transform;
    `;

    // Main title
    this.title = document.createElement('div');
    this.title.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 36px;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 10px;
      text-shadow:
        0 0 10px #f00,
        0 0 20px #f44,
        0 0 40px #f00,
        0 0 80px rgba(255,0,0,0.4),
        0 0 120px rgba(255,0,0,0.2);
      line-height: 1.2;
      background: linear-gradient(180deg, #fff 0%, #ff6644 50%, #ff2200 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 12px rgba(255,50,0,0.8));
      will-change: transform;
    `;
    this.title.textContent = 'MIRROR DUEL!';

    // Subtitle
    this.subtitle = document.createElement('div');
    this.subtitle.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 13px;
      font-weight: bold;
      color: #ffaa44;
      letter-spacing: 2px;
      text-shadow:
        0 0 6px rgba(255,170,50,0.6),
        0 0 12px rgba(255,100,0,0.3);
      text-transform: uppercase;
      opacity: 0.85;
      text-align: center;
      max-width: 360px;
      line-height: 1.5;
      will-change: transform;
    `;
    this.subtitle.innerHTML = 'Using a spell gives 50% cooldown for your opponent!';

    this.container.appendChild(this.title);
    this.container.appendChild(this.subtitle);
    document.body.appendChild(this.container);

    window.addEventListener('mousemove', e => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  triggerJump() {
    if (this.bouncing) return;
    this.bouncing = true;
    this.bounceTime = performance.now();
  }

  update() {
    // Mouse parallax offset
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (this.mouseX - centerX) / centerX;
    const dy = (this.mouseY - centerY) / centerY;

    // Bounce animation (like a ball hitting the ground)
    let offsetY = 0;
    let scaleY = 1;
    let scaleX = 1;
    let rotDeg = 0;

    if (this.bouncing) {
      const elapsed = performance.now() - this.bounceTime;
      const totalBounces = 4;
      const bounceDurations = [400, 280, 190, 130]; // each bounce shorter
      const bounceHeights = [40, 25, 14, 8];
      let accumulated = 0;
      let reachedEnd = false;

      for (let i = 0; i < totalBounces; i++) {
        if (elapsed >= accumulated && elapsed < accumulated + bounceDurations[i]) {
          const t = (elapsed - accumulated) / bounceDurations[i];

          // Gravity physics: y = 4h * t * (1 - t), parabolic
          // Bounce starts from 0, goes up to height, lands at 0
          offsetY = -bounceHeights[i] * Math.sin(t * Math.PI);

          // Squash on impact (at t=0 and t=1)
          if (t < 0.12) {
            // Landing squash
            const sqT = t / 0.12;
            const squash = Math.sin(sqT * Math.PI * 0.5);
            scaleY = 1 - 0.12 * squash;
            scaleX = 1 + 0.12 * squash;
          } else if (t > 0.88) {
            // Landing squash
            const sqT = (1 - t) / 0.12;
            const squash = Math.sin(sqT * Math.PI * 0.5);
            scaleY = 1 - 0.12 * squash;
            scaleX = 1 + 0.12 * squash;
          } else {
            scaleY = 1;
            scaleX = 1;
          }

          // Subtle rotation wobble on bounce
          rotDeg = Math.sin(t * Math.PI * 2) * 3 * (1 - t);

          accumulated += bounceDurations[i];
          break;
        } else if (elapsed >= accumulated + bounceDurations[i]) {
          accumulated += bounceDurations[i];
          if (i === totalBounces - 1) {
            offsetY = 0;
            scaleY = 1;
            scaleX = 1;
            rotDeg = 0;
            this.bouncing = false;
            reachedEnd = true;
          }
        }
      }

      if (elapsed >= accumulated) {
        offsetY = 0;
        scaleY = 1;
        scaleX = 1;
        rotDeg = 0;
        this.bouncing = false;
      }
    }

    this.container.style.transform = `
      translateX(calc(-50% + ${dx * 12}px))
      translateY(${dy * 6 + offsetY}px)
      rotateX(${dy * -2}deg)
      rotateY(${dx * 3}deg)
      scale(${scaleX}, ${scaleY})
    `;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
