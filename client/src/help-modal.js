const STYLE_ID = 'help-modal-styles';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes helpShake {
      0%, 20%, 100% { transform: translateX(0) rotate(0deg); }
      3% { transform: translateX(-3px) rotate(-10deg); }
      6% { transform: translateX(3px) rotate(10deg); }
      9% { transform: translateX(-3px) rotate(-8deg); }
      12% { transform: translateX(3px) rotate(8deg); }
      15% { transform: translateX(-2px) rotate(-4deg); }
      18% { transform: translateX(2px) rotate(4deg); }
    }
    #help-button {
      transition: box-shadow 0.2s ease-out, background 0.2s ease-out;
    }
    #help-button:hover {
      box-shadow: 0 0 12px rgba(255,204,68,0.9), 0 0 26px rgba(255,204,68,0.5);
      background: rgba(40,30,10,0.95) !important;
    }
    #help-button-glyph {
      display: inline-block;
      animation: helpShake 3s ease-in-out infinite;
    }
    #help-backdrop {
      opacity: 0;
      transition: opacity 0.2s ease-out;
    }
    #help-backdrop.visible {
      opacity: 1;
    }
    #help-panel {
      transform: scale(0.92);
      transition: transform 0.2s ease-out;
    }
    #help-backdrop.visible #help-panel {
      transform: scale(1);
    }
    .help-section h3 {
      margin: 0 0 6px 0;
    }
    .help-key {
      display: inline-block;
      padding: 1px 7px;
      border-radius: 4px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      margin-right: 6px;
    }
  `;
  document.head.appendChild(style);
}

export class HelpModal {
  constructor() {
    ensureStyles();
    this.isOpen = false;
    this._createButton();
    this._createModal();
    this._onKeyDown = e => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    };
    window.addEventListener('keydown', this._onKeyDown);
  }

  _createButton() {
    this.button = document.createElement('div');
    this.button.id = 'help-button';
    this.button.title = 'How to play';
    this.button.style.cssText = `
      position: fixed;
      top: 40px;
      right: 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(20,15,5,0.85);
      border: 2px solid #ffaa44;
      box-shadow: 0 0 8px rgba(255,170,68,0.6), 0 0 16px rgba(255,100,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #ffcc66;
      text-shadow: 0 0 6px rgba(255,170,50,0.8);
      cursor: pointer;
      pointer-events: auto;
      z-index: 250;
      user-select: none;
    `;
    this.button.textContent = '';
    const glyph = document.createElement('span');
    glyph.id = 'help-button-glyph';
    glyph.textContent = '?';
    this.button.appendChild(glyph);
    this.button.addEventListener('click', () => this.open());
    document.body.appendChild(this.button);
  }

  _section(keyLabel, keyColor, title, body) {
    return `
      <div class="help-section" style="margin-bottom: 16px;">
        <h3 style="font-family: 'Orbitron', sans-serif; font-size: 15px; color: #fff; letter-spacing: 1px;">
          <span class="help-key" style="background:${keyColor}22; color:${keyColor}; border: 1px solid ${keyColor};">${keyLabel}</span>
          ${title}
        </h3>
        <div style="font-family: 'Courier New', monospace; font-size: 13px; color: #ccc; line-height: 1.5; padding-left: 2px;">
          ${body}
        </div>
      </div>
    `;
  }

  _createModal() {
    this.backdrop = document.createElement('div');
    this.backdrop.id = 'help-backdrop';
    this.backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(3px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 300;
      pointer-events: auto;
    `;
    this.backdrop.addEventListener('click', e => {
      if (e.target === this.backdrop) this.close();
    });

    this.panel = document.createElement('div');
    this.panel.id = 'help-panel';
    this.panel.style.cssText = `
      position: relative;
      width: 520px;
      max-width: 90vw;
      max-height: 82vh;
      overflow-y: auto;
      background: linear-gradient(180deg, rgba(20,16,24,0.98) 0%, rgba(10,8,14,0.98) 100%);
      border: 1px solid #ff6644;
      box-shadow: 0 0 24px rgba(255,60,20,0.35), 0 0 60px rgba(0,0,0,0.6);
      border-radius: 10px;
      padding: 28px 30px;
      color: #fff;
    `;

    const closeBtn = document.createElement('div');
    closeBtn.textContent = '\u00D7';
    closeBtn.style.cssText = `
      position: absolute;
      top: 12px;
      right: 16px;
      font-family: 'Orbitron', sans-serif;
      font-size: 26px;
      color: #ff8866;
      cursor: pointer;
      line-height: 1;
      user-select: none;
    `;
    closeBtn.addEventListener('click', () => this.close());
    this.panel.appendChild(closeBtn);

    const heading = document.createElement('div');
    heading.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 4px;
      background: linear-gradient(180deg, #fff 0%, #ff6644 50%, #ff2200 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `;
    heading.textContent = 'How to Play';
    this.panel.appendChild(heading);

    const intro = document.createElement('div');
    intro.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #ffaa44;
      text-align: center;
      margin-bottom: 20px;
      opacity: 0.9;
    `;
    intro.textContent = 'Win by draining your opponent\u2019s health to zero.';
    this.panel.appendChild(intro);

    const content = document.createElement('div');
    content.innerHTML = `
      <div class="help-section" style="margin-bottom: 18px;">
        <h3 style="font-family: 'Orbitron', sans-serif; font-size: 15px; color: #fff; letter-spacing: 1px;">Movement</h3>
        <div style="font-family: 'Courier New', monospace; font-size: 13px; color: #ccc; line-height: 1.5;">
          <span class="help-key" style="background:#ffffff22; color:#fff; border: 1px solid #fff;">WASD</span>
          Move relative to the camera &mdash; W forward, S back, A/D strafe.<br>
          Aim by moving your mouse: your player always faces the cursor on the ground.<br>
          Strafing/backpedaling is 75% speed; moving in your facing direction is full speed.
        </div>
      </div>

      ${this._section('R', '#ff4444', 'Fire', `
        Launches a projectile toward your cursor.<br>
        Heals you a bit on cast.
      `)}

      ${this._section('SPACE', '#ffaa00', 'Dash', `
        Dash in your facing direction. You dodge all projectiles while dashing.<br>
        You can still aim and steer where you'll move after the dash ends.<br>
        Heals you a bit on cast.
      `)}

      ${this._section('F', '#4488ff', 'Shield', `
        Raises a shield that blocks projectiles in a cone in front of you.<br>
        Block a hit early enough for a <b>Perfect Block</b>: fires a free projectile at no cost.<br>
        Heals you a bit on cast.
      `)}

      ${this._section('CLICK', '#44ffee', 'Slash', `
        Melee swing in a close-range cone, instant damage.<br>
        Your fastest, most spammable attack &mdash; but it does not heal you.
      `)}

      <div class="help-section" style="margin-bottom: 18px;">
        <h3 style="font-family: 'Orbitron', sans-serif; font-size: 15px; color: #fff; letter-spacing: 1px;">Healing</h3>
        <div style="font-family: 'Courier New', monospace; font-size: 13px; color: #ccc; line-height: 1.5;">
          Every skill &mdash; Fire, Dash, and Shield &mdash; heals you a small amount when cast.<br>
          Slash is your only skill that doesn't: it's your default attack, so it deals damage with no healing reward.<br>
          Casting skills is both offense/defense <b>and</b> sustain &mdash; but that same cast halves your opponent's cooldown on it (see below).
        </div>
      </div>

      <div class="help-section" style="margin-bottom: 4px;">
        <h3 style="font-family: 'Orbitron', sans-serif; font-size: 15px; color: #fff; letter-spacing: 1px;">Mirror Mechanic</h3>
        <div style="font-family: 'Courier New', monospace; font-size: 13px; color: #ccc; line-height: 1.5;">
          Whenever you use a skill, your opponent's cooldown for <b>that same skill</b> is cut by 50%.<br>
          Every cast you make gives your rival a faster copy back &mdash; play aggressively, but expect retaliation.
        </div>
      </div>
    `;
    this.panel.appendChild(content);

    this.backdrop.appendChild(this.panel);
    document.body.appendChild(this.backdrop);
  }

  open() {
    this.isOpen = true;
    this.backdrop.style.display = 'flex';
    // force reflow so the transition triggers
    void this.backdrop.offsetHeight;
    this.backdrop.classList.add('visible');
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('visible');
    setTimeout(() => {
      if (!this.isOpen) this.backdrop.style.display = 'none';
    }, 200);
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    if (this.button && this.button.parentNode) this.button.parentNode.removeChild(this.button);
    if (this.backdrop && this.backdrop.parentNode) this.backdrop.parentNode.removeChild(this.backdrop);
  }
}
