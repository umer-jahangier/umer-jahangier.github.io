/**
 * The heat field: one 2D source that drives everything.
 *
 * A small grid accumulates heat where the pointer moves, diffuses a little,
 * and cools every frame. The WebGL chamber reads it as a texture; DOM elements
 * sample it once per frame and receive `--heat` (0–1) at their centre.
 */
export const HEAT_W = 128;
export const HEAT_H = 72;

class HeatField {
  readonly w = HEAT_W;
  readonly h = HEAT_H;
  readonly data = new Float32Array(HEAT_W * HEAT_H);
  readonly bytes = new Uint8Array(HEAT_W * HEAT_H);
  private scratch = new Float32Array(HEAT_W * HEAT_H);
  private px = -1;
  private py = -1;
  private lastX = -1;
  private lastY = -1;
  private velocity = 0;
  private lastTime = 0;
  private started = false;
  private subscribers = new Set<(f: HeatField) => void>();
  private raf = 0;
  ambient = 0; // set by scroll: the vent's contribution near the hero

  start() {
    if (this.started || typeof window === "undefined") return;
    this.started = true;
    const onMove = (e: PointerEvent) => {
      this.px = e.clientX / window.innerWidth;
      this.py = 1 - e.clientY / window.innerHeight;
    };
    const onLeave = () => {
      this.px = -1;
      this.py = -1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    const loop = (t: number) => {
      this.step(t);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  subscribe(fn: (f: HeatField) => void) {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private step(t: number) {
    const dt = Math.min(0.05, this.lastTime ? (t - this.lastTime) / 1000 : 0.016);
    this.lastTime = t;
    const { w, h, data, scratch } = this;

    // Pointer splat: strength grows with speed, so a slow hover simmers and a sweep blazes.
    if (this.px >= 0) {
      if (this.lastX >= 0) {
        const dx = this.px - this.lastX;
        const dy = this.py - this.lastY;
        const v = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 0.008);
        this.velocity += (v - this.velocity) * 0.25;
      }
      this.lastX = this.px;
      this.lastY = this.py;
      const strength = (0.55 + Math.min(this.velocity * 0.45, 1.6)) * dt * 9;
      const cx = this.px * (w - 1);
      const cy = this.py * (h - 1);
      const r = 7.5;
      const x0 = Math.max(0, Math.floor(cx - r));
      const x1 = Math.min(w - 1, Math.ceil(cx + r));
      const y0 = Math.max(0, Math.floor(cy - r));
      const y1 = Math.min(h - 1, Math.ceil(cy + r));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const ddx = (x - cx) / r;
          const ddy = ((y - cy) / r) * (h / w) * (w / h); // isotropic in grid units
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 > 1) continue;
          const g = Math.exp(-d2 * 3.2);
          const i = y * w + x;
          data[i] = Math.min(1.35, data[i] + g * strength);
        }
      }
    } else {
      this.velocity *= 0.9;
      this.lastX = -1;
    }

    // Diffuse and cool.
    const decay = Math.pow(0.28, dt); // ~ -72% per second
    const k = 0.14;
    for (let y = 0; y < h; y++) {
      const ym = y > 0 ? y - 1 : y;
      const yp = y < h - 1 ? y + 1 : y;
      for (let x = 0; x < w; x++) {
        const xm = x > 0 ? x - 1 : x;
        const xp = x < w - 1 ? x + 1 : x;
        const i = y * w + x;
        const nb = data[ym * w + x] + data[yp * w + x] + data[y * w + xm] + data[y * w + xp];
        const v = data[i] * (1 - k) + (nb / 4) * k;
        scratch[i] = v * decay;
      }
    }
    data.set(scratch);
    for (let i = 0; i < data.length; i++) this.bytes[i] = Math.min(255, (data[i] * 255) | 0);

    this.subscribers.forEach((fn) => fn(this));
  }

  /** Bilinear sample in normalised screen space (x right, y up). */
  sample(u: number, v: number) {
    const { w, h, data } = this;
    const x = Math.min(Math.max(u, 0), 1) * (w - 1);
    const y = Math.min(Math.max(v, 0), 1) * (h - 1);
    const x0 = x | 0,
      y0 = y | 0;
    const x1 = Math.min(x0 + 1, w - 1),
      y1 = Math.min(y0 + 1, h - 1);
    const fx = x - x0,
      fy = y - y0;
    const a = data[y0 * w + x0],
      b = data[y0 * w + x1],
      c = data[y1 * w + x0],
      d = data[y1 * w + x1];
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
  }

  /** Average heat over a screen rect (px), for DOM elements. */
  sampleRect(left: number, top: number, width: number, height: number) {
    const W = window.innerWidth,
      H = window.innerHeight;
    const cx = (left + width / 2) / W;
    const cy = 1 - (top + height / 2) / H;
    const rx = Math.max(width / W / 2, 0.01);
    const ry = Math.max(height / H / 2, 0.01);
    // Five taps: centre and four corners, weighted to the centre.
    const s =
      this.sample(cx, cy) * 0.4 +
      (this.sample(cx - rx, cy - ry) + this.sample(cx + rx, cy - ry) + this.sample(cx - rx, cy + ry) + this.sample(cx + rx, cy + ry)) * 0.15;
    return Math.min(1, s);
  }
}

let field: HeatField | null = null;
export function getHeatField() {
  if (!field) field = new HeatField();
  return field;
}
