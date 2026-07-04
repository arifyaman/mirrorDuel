export class SpellHUD {
  constructor() {
    this.container = null;
    this.myCooldownEl = null;
    this.debuffBadge = null;
    this.debuffWrap = null;
    this.oppCooldownEl = null;
    this.debuffScale = 1;
    this.debuffActive = false;
    this.debuffTime = 0;
    this.createElements();
  }

  createElements() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 10px 20px;
      background: linear-gradient(180deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.65) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      pointer-events: none;
      z-index: 200;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 16px rgba(0,255,255,0.04);
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
    `;

    // LEFT: My cooldown
    this.myCooldownEl = document.createElement('div');
    this.myCooldownEl.style.cssText = `
      font-size: 22px;
      font-weight: 900;
      color: #0ff;
      text-shadow: 0 0 8px #0ff, 0 0 16px rgba(0,255,255,0.4);
    `;
    this.myCooldownEl.textContent = 'READY';

    // CENTER: Debuff badge
    this.debuffWrap = document.createElement('div');
    this.debuffWrap.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: center center;
    `;

    this.debuffBadge = document.createElement('div');
    this.debuffBadge.style.cssText = `
      font-size: 10px;
      font-weight: 800;
      color: #ff6644;
      background: linear-gradient(135deg, rgba(255,50,50,0.2) 0%, rgba(255,100,50,0.15) 100%);
      border: 1px solid rgba(255,80,50,0.4);
      border-radius: 20px;
      padding: 4px 12px;
      letter-spacing: 1.5px;
      text-shadow: 0 0 8px rgba(255,80,50,0.6), 0 0 16px rgba(255,50,50,0.3);
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease-out;
    `;
    this.debuffBadge.textContent = '-50% CD';

    this.debuffWrap.appendChild(this.debuffBadge);

    // RIGHT: Opponent cooldown
    this.oppCooldownEl = document.createElement('div');
    this.oppCooldownEl.style.cssText = `
      font-size: 22px;
      font-weight: 900;
      color: #ff4444;
      text-shadow: 0 0 8px rgba(255,50,50,0.4), 0 0 16px rgba(255,50,50,0.2);
    `;
    this.oppCooldownEl.textContent = '???';

    this.container.appendChild(this.myCooldownEl);
    this.container.appendChild(this.debuffWrap);
    this.container.appendChild(this.oppCooldownEl);
    document.body.appendChild(this.container);
  }

  update(myCooldown, opponent, isDebuffTriggered) {
    // My cooldown display
    const cd = Math.max(0, myCooldown);
    if (cd <= 0) {
      this.myCooldownEl.textContent = 'READY';
      this.myCooldownEl.style.color = '#0f0';
      this.myCooldownEl.style.textShadow = '0 0 8px #0f0, 0 0 16px rgba(0,255,0,0.4)';
    } else if (cd > 1) {
      this.myCooldownEl.textContent = Math.ceil(cd) + 's';
      this.myCooldownEl.style.color = '#0ff';
      this.myCooldownEl.style.textShadow = '0 0 8px #0ff, 0 0 16px rgba(0,255,255,0.4)';
    } else {
      this.myCooldownEl.textContent = cd.toFixed(2) + 's';
      this.myCooldownEl.style.color = '#0ff';
      this.myCooldownEl.style.textShadow = '0 0 8px #0ff, 0 0 16px rgba(0,255,255,0.4)';
    }

    // Opponent cooldown display
    const oppCooldown = opponent ? Math.max(0, opponent.cooldown) : 0;
    if (oppCooldown <= 0) {
      this.oppCooldownEl.textContent = 'READY';
      this.oppCooldownEl.style.color = '#0f0';
      this.oppCooldownEl.style.textShadow = '0 0 8px #0f0, 0 0 16px rgba(0,255,0,0.4)';
    } else if (oppCooldown > 1) {
      this.oppCooldownEl.textContent = Math.ceil(oppCooldown) + 's';
      this.oppCooldownEl.style.color = '#ff4444';
      this.oppCooldownEl.style.textShadow = '0 0 8px rgba(255,50,50,0.4), 0 0 16px rgba(255,50,50,0.2)';
    } else {
      this.oppCooldownEl.textContent = oppCooldown.toFixed(2) + 's';
      this.oppCooldownEl.style.color = '#ff4444';
      this.oppCooldownEl.style.textShadow = '0 0 8px rgba(255,50,50,0.4), 0 0 16px rgba(255,50,50,0.2)';
    }

    // Debuff badge animation
    if (isDebuffTriggered) {
      this.debuffActive = true;
      this.debuffTime = performance.now();
      this.debuffBadge.style.opacity = '1';
    }

    if (this.debuffActive) {
      const elapsed = performance.now() - this.debuffTime;

      if (elapsed < 300) {
        const t = elapsed / 300;
        this.debuffScale = 1 + 0.6 * t;
      } else if (elapsed < 800) {
        this.debuffScale = 1.6;
      } else if (elapsed < 1800) {
        const t = (elapsed - 800) / 1000;
        this.debuffScale = 1.6 - 0.6 * Math.pow(t, 0.5);
        this.debuffBadge.style.opacity = String(1 - t);
      } else {
        this.debuffActive = false;
        this.debuffScale = 1;
      }
    } else {
      this.debuffScale += (1 - this.debuffScale) * 0.15;
      if (Math.abs(this.debuffScale - 1) < 0.005) this.debuffScale = 1;
    }

    this.debuffWrap.style.transform = `scale(${this.debuffScale})`;
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
