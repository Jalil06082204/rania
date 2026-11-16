// Gentle Web Audio API sound synthesis for Pomodoro chimes and soothing music-box demo playback with pause/resume support

class GentleSoundEngine {
  private ctx: AudioContext | null = null;
  private melodyInterval: number | null = null;
  private currentStep = 0;

  private readonly notes = [
    349.23, 440.0, 523.25, 659.25, 587.33, 523.25, 440.0, 392.0,
    349.23, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 349.23,
    392.0, 440.0, 523.25, 659.25, 698.46, 659.25, 587.33, 523.25,
    440.0, 392.0, 349.23, 440.0, 523.25, 392.0, 349.23, 349.23,
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playChime(enabled = true): void {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 1.45);
    });
  }

  public playSoftNote(freq = 587.33): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  public startOrResumeMusicBoxMelody(
    startAtStep = 0,
    onTick?: (elapsedSec: number, stepIndex: number) => void,
    onEnd?: () => void
  ): void {
    this.pauseMusicBoxMelody();
    const ctx = this.getContext();
    if (!ctx) return;

    this.currentStep =
      startAtStep >= this.notes.length || startAtStep < 0 ? 0 : startAtStep;

    this.playSoftNote(this.notes[this.currentStep]);
    if (onTick) {
      onTick(Math.floor(this.currentStep * 0.5), this.currentStep);
    }

    this.melodyInterval = window.setInterval(() => {
      this.currentStep += 1;
      if (this.currentStep >= this.notes.length) {
        this.stopMusicBoxMelody();
        if (onEnd) onEnd();
        return;
      }
      this.playSoftNote(this.notes[this.currentStep % this.notes.length]);
      if (onTick) {
        onTick(Math.floor(this.currentStep * 0.5), this.currentStep);
      }
    }, 500);
  }

  public pauseMusicBoxMelody(): number {
    if (this.melodyInterval !== null) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    return this.currentStep;
  }

  public stopMusicBoxMelody(): void {
    if (this.melodyInterval !== null) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    this.currentStep = 0;
  }
}

export const soundEngine = new GentleSoundEngine();
