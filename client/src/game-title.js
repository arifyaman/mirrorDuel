export class GameTitle {
  constructor() {
    this.container = null;
    this.glowLayer = null;
    this.title = null;
    this.subtitle = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.playerId = 0;
    this.createElements();
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      pointer-events: none;
      z-index: 200;
      will-change: transform;
    `;

    // Glow layer (behind, blurred)
    this.glowLayer = document.createElement('div');
    this.glowLayer.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 8px;
      text-transform: uppercase;
      text-align: center;
      color: rgba(255,50,0,0.5);
      filter: blur(6px);
      line-height: 1.2;
    `;
    this.glowLayer.textContent = 'MIRROR DUEL!';
    this.glowLayer.style.opacity = '0.6';

    // Main title (sharp, gradient clipped)
    this.title = document.createElement('div');
    this.title.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 28px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 8px;
      line-height: 1.2;
      background: linear-gradient(180deg, #ffffff 0%, #ff6644 50%, #ff2200 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
    `;
    this.title.textContent = 'MIRROR DUEL!';

    // Subtitle
    this.subtitle = document.createElement('div');
    this.subtitle.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 11px;
      font-weight: bold;
      color: #ffaa44;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.85;
      text-align: center;
      max-width: 320px;
      line-height: 1.5;
    `;
    this.subtitle.innerHTML = 'Using a spell gives 50% cooldown for your opponent!';

    this.container.appendChild(this.glowLayer);
    this.container.appendChild(this.title);
    this.container.appendChild(this.subtitle);
    document.body.appendChild(this.container);

    window.addEventListener('mousemove', e => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  setPlayerColor(playerId) {
    this.playerId = playerId;
    const isRed = playerId === 1;
    const secondary = isRed ? '#ff4444' : '#4488ff';
    const accent = isRed ? '#ff2200' : '#0044ff';
    const glowColor = isRed ? '255,50,0' : '0,100,255';

    // Title gradient
    this.title.style.background = `linear-gradient(180deg, #ffffff 0%, ${secondary} 50%, ${accent} 100%)`;

    // Glow layer color
    this.glowLayer.style.color = `rgba(${glowColor},0.5)`;

    // Subtitle color
    this.subtitle.style.color = secondary;
    this.subtitle.style.textShadow = `0 0 8px rgba(${glowColor},0.5), 0 0 16px rgba(${glowColor},0.3)`;
  }

  update() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (this.mouseX - centerX) / centerX;
    const dy = (this.mouseY - centerY) / centerY;

    this.container.style.transform = `
      translateX(calc(-50% + ${dx * 12}px))
      translateY(${dy * 6}px)
      rotateX(${dy * -2}deg)
      rotateY(${dx * 3}deg)
    `;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
