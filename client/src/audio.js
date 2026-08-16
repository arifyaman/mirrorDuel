const STORAGE_MUTED_KEY = 'mirrorDuel_muted';
const STORAGE_VOLUME_KEY = 'mirrorDuel_volume';

// Procedural sci-fi SFX synth. No audio files — everything is generated on the
// fly with oscillators + filtered noise + gain envelopes, reusing PlayCanvas's
// already-initialized (and autoplay-unlocked) AudioContext.
export class AudioEngine {
  constructor(app) {
    this.ctx = app && app.soundManager ? app.soundManager.context : null;
    this._noiseBuffer = null;

    const storedVolume = parseFloat(localStorage.getItem(STORAGE_VOLUME_KEY));
    this.volume = isNaN(storedVolume) ? 0.6 : storedVolume;
    this.muted = localStorage.getItem(STORAGE_MUTED_KEY) === '1';

    if (this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
  }

  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem(STORAGE_MUTED_KEY, muted ? '1' : '0');
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : this.volume;
    }
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    localStorage.setItem(STORAGE_VOLUME_KEY, String(this.volume));
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.value = this.volume;
    }
  }

  _now() {
    return this.ctx.currentTime;
  }

  // Cached 1s white-noise buffer, sliced/played back for whoosh/impact texture.
  _getNoiseBuffer() {
    if (this._noiseBuffer) return this._noiseBuffer;
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this._noiseBuffer = buffer;
    return buffer;
  }

  _noiseSource() {
    const src = this.ctx.createBufferSource();
    src.buffer = this._getNoiseBuffer();
    src.loop = true;
    return src;
  }

  // ---- Low-level building blocks ----

  _tone(freqStart, freqEnd, duration, { type = 'sine', gain = 0.3, attack = 0.005, filterFreq = null, filterQ = 1, delay = 0 } = {}) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t0 = this._now() + delay;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + duration);
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    let node = osc;
    if (filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = filterFreq;
      filter.Q.value = filterQ;
      node.connect(filter);
      node = filter;
    }
    node.connect(g);
    g.connect(this.masterGain);

    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
    osc.onended = () => { osc.disconnect(); g.disconnect(); };
  }

  _noiseBurst(duration, { gain = 0.3, attack = 0.005, filterType = 'bandpass', freqStart = 1000, freqEnd = 1000, q = 1, delay = 0 } = {}) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t0 = this._now() + delay;

    const src = this._noiseSource();
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd !== freqStart) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 10), t0 + duration);
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);

    src.start(t0);
    src.stop(t0 + duration + 0.02);
    src.onended = () => { src.disconnect(); filter.disconnect(); g.disconnect(); };
  }

  // ---- Sound effects ----

  playFire(pitchMult = 1) {
    if (!this.ctx) return;
    this._tone(1250 * pitchMult, 120 * pitchMult, 0.07, { type: 'sawtooth', gain: 0.22, filterFreq: 2400 * pitchMult, filterQ: 3 });
    this._noiseBurst(0.06, { gain: 0.20, freqStart: 4500, freqEnd: 700, q: 1.4 });
  }

  playDash(pitchMult = 1) {
    if (!this.ctx) return;
    this._noiseBurst(0.18, { gain: 0.32, freqStart: 500 * pitchMult, freqEnd: 2600 * pitchMult, q: 0.8, attack: 0.01 });
  }

  playShieldActivate(pitchMult = 1) {
    if (!this.ctx) return;
    this._tone(420 * pitchMult, 640 * pitchMult, 0.14, { type: 'triangle', gain: 0.22, attack: 0.01 });
    this._tone(640 * pitchMult, 640 * pitchMult, 0.18, { type: 'sine', gain: 0.12, attack: 0.02, delay: 0.06 });
  }

  playShieldBlock(pitchMult = 1) {
    if (!this.ctx) return;
    this._tone(1250 * pitchMult, 900 * pitchMult, 0.07, { type: 'square', gain: 0.22, attack: 0.002, filterFreq: 1800 * pitchMult, filterQ: 6 });
    this._tone(1380 * pitchMult, 1000 * pitchMult, 0.06, { type: 'triangle', gain: 0.14, attack: 0.002 });
    this._noiseBurst(0.05, { gain: 0.15, freqStart: 4000, freqEnd: 2000, q: 1 });
  }

  playPerfectBlock(pitchMult = 1) {
    if (!this.ctx) return;
    // Note: the base "clink" is played separately via playShieldBlock() since
    // the server also emits EVENT_SHIELD_BLOCK alongside EVENT_PERFECT_BLOCK.
    const notes = [880, 1108, 1318];
    notes.forEach((f, i) => {
      this._tone(f * pitchMult, f * pitchMult, 0.11, { type: 'triangle', gain: 0.16, attack: 0.004, delay: i * 0.045 });
    });
  }

  playSlash(pitchMult = 1) {
    if (!this.ctx) return;
    this._noiseBurst(0.1, { gain: 0.26, freqStart: 3600 * pitchMult, freqEnd: 1000 * pitchMult, q: 0.9, attack: 0.004 });
  }

  playHit(isMe) {
    if (!this.ctx) return;
    const base = isMe ? 190 : 150;
    this._tone(base, base * 0.6, 0.14, { type: 'triangle', gain: isMe ? 0.32 : 0.22, attack: 0.002 });
    this._noiseBurst(0.06, { gain: 0.12, freqStart: 1200, freqEnd: 300, q: 1 });
    if (isMe) {
      this._tone(520, 420, 0.08, { type: 'sine', gain: 0.14, attack: 0.002, delay: 0.01 });
    }
  }

  playDeath() {
    if (!this.ctx) return;
    this._tone(220, 40, 0.7, { type: 'sine', gain: 0.35, attack: 0.005 });
    this._noiseBurst(0.6, { gain: 0.28, filterType: 'lowpass', freqStart: 900, freqEnd: 80, q: 0.7, attack: 0.01 });
  }

  playReloadStart(pitchMult = 1) {
    if (!this.ctx) return;
    // Mechanical magazine drop click
    this._tone(850 * pitchMult, 320 * pitchMult, 0.08, { type: 'triangle', gain: 0.22, attack: 0.002 });
    this._noiseBurst(0.06, { gain: 0.16, freqStart: 3800, freqEnd: 1200, q: 2 });
  }

  playReloadFinish(pitchMult = 1) {
    if (!this.ctx) return;
    // Solid mag slap in + bolt rack slide
    this._tone(480 * pitchMult, 950 * pitchMult, 0.08, { type: 'square', gain: 0.24, attack: 0.002 });
    this._tone(950 * pitchMult, 1400 * pitchMult, 0.07, { type: 'sawtooth', gain: 0.18, attack: 0.004, delay: 0.035 });
    this._noiseBurst(0.08, { gain: 0.24, freqStart: 5000, freqEnd: 1400, q: 1.8, delay: 0.03 });
  }

  playWaveClear() {
    if (!this.ctx) return;
    // Triumphant ascending victory fanfare
    this._tone(523.25, 523.25, 0.15, { type: 'triangle', gain: 0.22, attack: 0.01 }); // C5
    this._tone(659.25, 659.25, 0.15, { type: 'triangle', gain: 0.22, attack: 0.01, delay: 0.12 }); // E5
    this._tone(783.99, 783.99, 0.25, { type: 'triangle', gain: 0.25, attack: 0.01, delay: 0.24 }); // G5
    this._tone(1046.5, 1046.5, 0.45, { type: 'sine', gain: 0.3, attack: 0.02, delay: 0.38 }); // C6
  }

  playWaveStart() {
    if (!this.ctx) return;
    // Low sub-bass warhorn drop + combat alert
    this._tone(150, 45, 0.6, { type: 'sawtooth', gain: 0.32, attack: 0.01 });
    this._tone(880, 440, 0.2, { type: 'square', gain: 0.18, attack: 0.005, delay: 0.08 });
    this._noiseBurst(0.3, { gain: 0.2, freqStart: 2500, freqEnd: 400, q: 1.5 });
  }

  playUpgradeOpen() {
    if (!this.ctx) return;
    // Shimmering celestial synth open
    this._tone(440, 880, 0.25, { type: 'sine', gain: 0.2, attack: 0.01 });
    this._tone(659, 1318, 0.35, { type: 'triangle', gain: 0.22, attack: 0.02, delay: 0.08 });
    this._tone(880, 1760, 0.45, { type: 'sine', gain: 0.25, attack: 0.02, delay: 0.16 });
  }

  playUpgradeSelect() {
    if (!this.ctx) return;
    // Punchy futuristic power-up chime
    this._tone(300, 600, 0.08, { type: 'sawtooth', gain: 0.25, attack: 0.005 });
    this._tone(600, 1200, 0.2, { type: 'sine', gain: 0.3, attack: 0.01, delay: 0.05 });
    this._noiseBurst(0.12, { gain: 0.2, freqStart: 4000, freqEnd: 800, q: 2 });
  }

  playBoomExplosion() {
    if (!this.ctx) return;
    // Loud artillery explosion BOOM / GÜMM!
    this._tone(180, 24, 0.75, { type: 'sawtooth', gain: 0.55, attack: 0.005 });
    this._tone(90, 18, 0.95, { type: 'sine', gain: 0.65, attack: 0.005 });
    this._noiseBurst(0.65, { gain: 0.5, filterType: 'lowpass', freqStart: 1800, freqEnd: 70, q: 1.4, attack: 0.005 });
  }

  playTurretFire() {
    if (!this.ctx) return;
    // Heavy mechanical robotic autocannon pop
    this._tone(920, 280, 0.05, { type: 'sawtooth', gain: 0.22, attack: 0.002 });
    this._noiseBurst(0.06, { gain: 0.2, freqStart: 4500, freqEnd: 1200, q: 2 });
  }

  playUiClick() {
    if (!this.ctx) return;
    this._tone(620, 560, 0.045, { type: 'sine', gain: 0.14, attack: 0.002 });
  }
}
