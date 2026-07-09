const STYLE_ID = 'audio-button-styles';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #audio-button {
      transition: box-shadow 0.2s ease-out, background 0.2s ease-out;
    }
    #audio-button:hover {
      box-shadow: 0 0 12px rgba(68,204,255,0.9), 0 0 26px rgba(68,204,255,0.5);
      background: rgba(10,25,35,0.95) !important;
    }
  `;
  document.head.appendChild(style);
}

const ICON_ON = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor"/>
  <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M19 6a9 9 0 0 1 0 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
</svg>`;

const ICON_OFF = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor"/>
  <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

export class AudioButton {
  constructor(audio) {
    ensureStyles();
    this.audio = audio;
    this.button = document.createElement('div');
    this.button.id = 'audio-button';
    this.button.title = 'Toggle sound';
    this.button.style.cssText = `
      position: fixed;
      top: 40px;
      right: 96px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(5,20,28,0.85);
      border: 2px solid #44ccff;
      box-shadow: 0 0 8px rgba(68,204,255,0.6), 0 0 16px rgba(0,120,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7fe0ff;
      cursor: pointer;
      pointer-events: auto;
      z-index: 250;
      user-select: none;
    `;
    this._render();
    this.button.addEventListener('click', () => this._toggle());
    document.body.appendChild(this.button);
  }

  _render() {
    const muted = !!(this.audio && this.audio.muted);
    this.button.innerHTML = muted ? ICON_OFF : ICON_ON;
  }

  _toggle() {
    if (!this.audio) return;
    const nowMuted = this.audio.toggleMuted();
    this._render();
    if (!nowMuted) this.audio.playUiClick();
  }

  destroy() {
    if (this.button && this.button.parentNode) this.button.parentNode.removeChild(this.button);
  }
}
