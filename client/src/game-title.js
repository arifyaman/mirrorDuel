export class GameTitle {
  constructor() {
    this.container = null;
    this.title = null;
    this.subtitle = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.jumping = false;
    this.jumpTime = 0;
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
      font-size: 52px;
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
    `;
    this.title.textContent = 'MIRROR DUEL!';

    // Subtitle
    this.subtitle = document.createElement('div');
    this.subtitle.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 18px;
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
    if (this.jumping) return;
    this.jumping = true;
    this.jumpTime = performance.now();
  }

  update() {
    // Mouse parallax offset
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (this.mouseX - centerX) / centerX;
    const dy = (this.mouseY - centerY) / centerY;

    // Jump animation
    let jumpY = 0;
    let jumpScale = 1;
    if (this.jumping) {
      const elapsed = performance.now() - this.jumpTime;
      const duration = 500;

      if (elapsed < duration) {
        // Bouncy overshoot curve
        const t = elapsed / duration;
        // Cubic ease out with bounce
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // Subtle scale pulse
        jumpScale = 1 + Math.sin(t * Math.PI) * 0.12;
        // Slight upward hop
        jumpY = -Math.sin(t * Math.PI) * 6;
      } else {
        this.jumping = false;
        jumpScale = 1;
        jumpY = 0;
      }
    }

    this.container.style.transform = `
      translateX(calc(-50% + ${dx * 12}px))
      translateY(${dy * 6 + jumpY}px)
      rotateX(${dy * -2}deg)
      rotateY(${dx * 3}deg)
    `;

    this.subtitle.style.transform = `scale(${jumpScale})`;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
