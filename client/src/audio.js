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
    this._tone(950 * pitchMult, 260 * pitchMult, 0.14, { type: 'sawtooth', gain: 0.28, filterFreq: 1400 * pitchMult, filterQ: 4 });
    this._noiseBurst(0.08, { gain: 0.08, freqStart: 3000, freqEnd: 1200, q: 0.7 });
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
    this._noiseBurst(0.1, { gain: 0.26, freqStart: 2600 * pitchMult, freqEnd: 700 * pitchMult, q: 0.9, attack: 0.004 });
    this._tone(260 * pitchMult, 180 * pitchMult, 0.05, { type: 'square', gain: 0.15, attack: 0.002, delay: 0.07 });
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

  playUiClick() {
    if (!this.ctx) return;
    this._tone(620, 560, 0.045, { type: 'sine', gain: 0.14, attack: 0.002 });
  }
}
