export class GameTitle {
  constructor() {
    this.container = null;
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

    // Main title
    this.title = document.createElement('div');
    this.title.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 28px;
      font-weight: 900;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 8px;
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
      font-size: 11px;
      font-weight: bold;
      color: #ffaa44;
      letter-spacing: 2px;
      text-shadow:
        0 0 6px rgba(255,170,50,0.6),
        0 0 12px rgba(255,100,0,0.3);
      text-transform: uppercase;
      opacity: 0.85;
      text-align: center;
      max-width: 320px;
      line-height: 1.5;
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

  setPlayerColor(playerId) {
    this.playerId = playerId;
    const isRed = playerId === 1;
    const primary = isRed ? '#f00' : '#0066ff';
    const secondary = isRed ? '#ff4444' : '#4488ff';
    const accent = isRed ? '#ff2200' : '#0044ff';
    const glow = isRed ? '255,0,0' : '0,100,255';

    this.title.style.background = `linear-gradient(180deg, #fff 0%, ${secondary} 50%, ${accent} 100%)`;
    this.title.style.textShadow = `
      0 0 10px ${primary},
      0 0 20px ${secondary},
      0 0 40px ${primary},
      0 0 80px rgba(${glow},0.4),
      0 0 120px rgba(${glow},0.2)
    `;
    this.title.style.filter = `drop-shadow(0 0 12px rgba(${glow},0.8))`;

    this.subtitle.style.color = secondary;
    this.subtitle.style.textShadow = `
      0 0 6px rgba(${glow},0.6),
      0 0 12px rgba(${glow},0.3)
    `;
  }

  update() {
    // Mouse parallax offset
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
