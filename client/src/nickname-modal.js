const STYLE_ID = 'nickname-modal-styles';
const STORAGE_KEY = 'mirrorDuel.nickname';
const MAX_LENGTH = 12;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #nickname-backdrop {
      opacity: 0;
      transition: opacity 0.2s ease-out;
    }
    #nickname-backdrop.visible {
      opacity: 1;
    }
    #nickname-panel {
      transform: scale(0.92);
      transition: transform 0.2s ease-out;
    }
    #nickname-backdrop.visible #nickname-panel {
      transform: scale(1);
    }
    #nickname-input {
      transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
    }
    #nickname-input:focus {
      outline: none;
      border-color: #ffaa44;
      box-shadow: 0 0 10px rgba(255,170,68,0.5);
    }
    #nickname-input.shake {
      animation: nicknameShake 0.3s ease-out;
    }
    @keyframes nicknameShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    #nickname-submit {
      transition: box-shadow 0.15s ease-out, background 0.15s ease-out, transform 0.1s ease-out;
    }
    #nickname-submit:hover {
      box-shadow: 0 0 12px rgba(255,170,68,0.7), 0 0 26px rgba(255,100,0,0.3);
      background: rgba(60,40,15,0.95) !important;
    }
    #nickname-submit:active {
      transform: scale(0.96);
    }
  `;
  document.head.appendChild(style);
}

function randomNickname() {
  return 'Player' + Math.floor(Math.random() * 1000);
}

export class NicknameModal {
  constructor(audio) {
    ensureStyles();
    this.audio = audio;
    this.isOpen = false;
    this._onSubmit = null;
    this._createModal();
  }

  _createModal() {
    this.backdrop = document.createElement('div');
    this.backdrop.id = 'nickname-backdrop';
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

    this.panel = document.createElement('div');
    this.panel.id = 'nickname-panel';
    this.panel.style.cssText = `
      position: relative;
      width: 380px;
      max-width: 90vw;
      background: linear-gradient(180deg, rgba(20,16,24,0.98) 0%, rgba(10,8,14,0.98) 100%);
      border: 1px solid #ff6644;
      box-shadow: 0 0 24px rgba(255,60,20,0.35), 0 0 60px rgba(0,0,0,0.6);
      border-radius: 10px;
      padding: 30px 32px;
      color: #fff;
    `;

    const heading = document.createElement('div');
    heading.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 26px;
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
    heading.textContent = 'Mirror Duel';
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
    intro.textContent = 'Enter your name to join the arena';
    this.panel.appendChild(intro);

    this.input = document.createElement('input');
    this.input.id = 'nickname-input';
    this.input.type = 'text';
    this.input.maxLength = MAX_LENGTH;
    this.input.autocomplete = 'off';
    this.input.spellcheck = false;
    this.input.style.cssText = `
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      color: #fff;
      background: rgba(0,0,0,0.4);
      border: 1px solid #666;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
      text-align: center;
      letter-spacing: 1px;
    `;
    this.panel.appendChild(this.input);

    this.hint = document.createElement('div');
    this.hint.style.cssText = `
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #888;
      text-align: center;
      margin-bottom: 18px;
      min-height: 14px;
    `;
    this.hint.textContent = `Max ${MAX_LENGTH} characters`;
    this.panel.appendChild(this.hint);

    this.submitBtn = document.createElement('div');
    this.submitBtn.id = 'nickname-submit';
    this.submitBtn.style.cssText = `
      font-family: 'Orbitron', 'Segoe UI', sans-serif;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
      color: #ffcc66;
      background: rgba(20,15,5,0.85);
      border: 2px solid #ffaa44;
      box-shadow: 0 0 8px rgba(255,170,68,0.4);
      border-radius: 6px;
      padding: 10px;
      cursor: pointer;
      user-select: none;
    `;
    this.submitBtn.textContent = 'Join Battle';
    this.submitBtn.addEventListener('click', () => this._trySubmit());
    this.panel.appendChild(this.submitBtn);

    this.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._trySubmit();
    });

    this.backdrop.appendChild(this.panel);
    document.body.appendChild(this.backdrop);
  }

  _trySubmit() {
    const raw = this.input.value;
    // Strip control characters, collapse surrounding whitespace.
    const cleaned = raw.replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, MAX_LENGTH);

    if (cleaned.length === 0) {
      this.input.classList.remove('shake');
      // force reflow so the animation can retrigger
      void this.input.offsetWidth;
      this.input.classList.add('shake');
      this.hint.textContent = 'Please enter a name';
      this.hint.style.color = '#ff6666';
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, cleaned);
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — not critical.
    }

    if (this.audio) this.audio.playUiClick();
    this.close();
    if (this._onSubmit) this._onSubmit(cleaned);
  }

  /**
   * Shows the modal and invokes onSubmit(name) once a valid name is
   * confirmed. The modal cannot be dismissed without submitting.
   */
  show(onSubmit) {
    this._onSubmit = onSubmit;

    let suggested = null;
    try {
      suggested = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    this.input.value = (suggested && suggested.trim()) || randomNickname();

    this.isOpen = true;
    this.backdrop.style.display = 'flex';
    void this.backdrop.offsetHeight;
    this.backdrop.classList.add('visible');

    // Select the suggested text so typing immediately replaces it.
    requestAnimationFrame(() => {
      this.input.focus();
      this.input.select();
    });
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('visible');
    setTimeout(() => {
      if (!this.isOpen) this.backdrop.style.display = 'none';
    }, 200);
  }

  destroy() {
    if (this.backdrop && this.backdrop.parentNode) this.backdrop.parentNode.removeChild(this.backdrop);
  }
}
