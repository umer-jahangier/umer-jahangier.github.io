"use client";
import { getPrefs } from "./prefs";

/**
 * Whiteboard sounds, synthesised with the Web Audio API so nothing is downloaded:
 * a marker squeak while drawing, a soft tick on hover, a pop on the notes,
 * and the felt swoosh of the eraser. Off by default; never plays without a gesture.
 */
class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private lastSqueak = 0;

  private ensure() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 1.5;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private on() {
    return getPrefs().sound;
  }

  /** Call from a user gesture when sound is switched on, so the context is allowed. */
  unlock() {
    this.ensure();
  }

  tick() {
    if (!this.on()) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(1400, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    o.connect(g).connect(this.master);
    o.start();
    o.stop(ctx.currentTime + 0.07);
  }

  pop() {
    if (!this.on()) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(260, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.09);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    o.connect(g).connect(this.master);
    o.start();
    o.stop(ctx.currentTime + 0.15);
  }

  /** speed 0–1: faster strokes squeak higher and louder. */
  squeak(speed: number) {
    if (!this.on()) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.noise) return;
    const now = ctx.currentTime;
    if (now - this.lastSqueak < 0.07) return;
    this.lastSqueak = now;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 9;
    const f = 1500 + speed * 1800;
    bp.frequency.setValueAtTime(f, now);
    bp.frequency.exponentialRampToValueAtTime(f * 1.25, now + 0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.03 + speed * 0.05, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    src.connect(bp).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + 0.1);
  }

  swoosh() {
    if (!this.on()) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.noise) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(400, now);
    lp.frequency.exponentialRampToValueAtTime(2600, now + 0.22);
    lp.frequency.exponentialRampToValueAtTime(300, now + 0.55);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.16, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    src.connect(lp).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + 0.6);
  }
}

export const sound = new Sound();
