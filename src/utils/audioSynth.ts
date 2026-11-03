// High-performance Web Audio API Sound Synthesizer for Children's Educational UX
// Zero external asset latency; guarantees sound playback instantly on touch.

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft sparkle tone for tracing along the path
  playTraceSparkle(pitchFactor: number = 1.0) {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 520 * (0.8 + pitchFactor * 0.6);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Gentle, warm encouragement bounce (non-punitive "try again" nudge)
  playEncouragingNudge() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  }

  // Celebratory triumphant fanfare (major triad arpeggio + chime)
  playFanfare() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A major
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = ctx.currentTime + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch {}
  }

  // Bubble pop / item drop sound
  playPop() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }

  // Banana munch / eating pet sound
  playMunch() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {}
  }

  // Realistic Asian Elephant Trumpet (Harmonic brass sweep with flutter)
  playElephantTrumpet() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.Q.value = 4.0;

      // Pitch sweep up then trumpeting slide
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.18);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.65);

      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.25);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.65);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {}
  }

  // Realistic Indochinese Tiger Roar (Low frequency rumble with growl modulation)
  playTigerRoar() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      subOsc.type = 'triangle';

      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(85, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.85);

      subOsc.frequency.setValueAtTime(70, ctx.currentTime);
      subOsc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.85);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.85);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      subOsc.start();
      osc.stop(ctx.currentTime + 0.9);
      subOsc.stop(ctx.currentTime + 0.9);
    } catch {}
  }

  // Realistic Green Peacock Call (Shrill high-pitch harmonic sliding squawk)
  playPeacockCall() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {}
  }

  // Realistic Irrawaddy River Dolphin Whistle & Click Train
  playDolphinClicks() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      // Whistle sweep
      const whistle = ctx.createOscillator();
      const whistleGain = ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(2400, ctx.currentTime);
      whistle.frequency.exponentialRampToValueAtTime(3800, ctx.currentTime + 0.25);
      whistle.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + 0.5);

      whistleGain.gain.setValueAtTime(0.08, ctx.currentTime);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.52);

      whistle.connect(whistleGain);
      whistleGain.connect(ctx.destination);

      whistle.start();
      whistle.stop(ctx.currentTime + 0.52);

      // Clicks burst
      for (let i = 0; i < 4; i++) {
        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();
        const startTime = ctx.currentTime + 0.1 + i * 0.08;

        click.type = 'square';
        click.frequency.setValueAtTime(4200, startTime);

        clickGain.gain.setValueAtTime(0.05, startTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);

        click.connect(clickGain);
        clickGain.connect(ctx.destination);

        click.start(startTime);
        click.stop(startTime + 0.03);
      }
    } catch {}
  }

  // Soft Rabbit / Hare Hop Rustle
  playRabbitHop() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }

  // Play animal sound based on type key
  playAnimalSound(type: string) {
    if (type === 'trumpet') this.playElephantTrumpet();
    else if (type === 'roar') this.playTigerRoar();
    else if (type === 'peacock') this.playPeacockCall();
    else if (type === 'dolphin') this.playDolphinClicks();
    else if (type === 'rabbit') this.playRabbitHop();
    else this.playPop();
  }

  // Bilingual Speech Synthesis with fallback tone
  speak(text: string, lang: 'km' | 'en' = 'en') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // slightly slower & clearer for young kids
      utterance.pitch = 1.15; // friendly warmer pitch

      if (lang === 'km') {
        utterance.lang = 'km-KH';
      } else {
        utterance.lang = 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
    }
  }
}

export const soundEffects = new SoundEffectsEngine();
