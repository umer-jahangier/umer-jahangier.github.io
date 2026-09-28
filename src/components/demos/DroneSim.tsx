"use client";
import { useEffect, useRef } from "react";
import { useInView } from "./useInView";

/**
 * A top-down forest with a drone steering through it on a simple potential
 * field, and the 1-D depth it "sees" below. This illustrates the thesis setup;
 * it is not the trained policy.
 */
export default function DroneSim() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !inView) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cs = getComputedStyle(document.documentElement);
    const col = () => ({ ink: cs.getPropertyValue("--ink").trim(), ink2: cs.getPropertyValue("--ink-2").trim(), marker: cs.getPropertyValue("--marker").trim(), rose: cs.getPropertyValue("--rose").trim(), soft: cs.getPropertyValue("--marker-soft").trim() });
    const W = 640, H = 300, FOREST_H = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const trees: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 110; i++) trees.push({ x: 60 + rnd() * 1400, y: 20 + rnd() * (FOREST_H - 40), r: 5 + rnd() * 9 });
    const drone = { x: 30, y: FOREST_H / 2, vx: 1.6, vy: 0, heading: 0 };
    const path: { x: number; y: number }[] = [];
    let scroll = 0;
    let raf = 0;
    const step = () => {
      const c = col();
      // Potential field: avoid nearby trees, drift toward the middle, keep moving right.
      let fx = 0.12, fy = (FOREST_H / 2 - drone.y) * 0.0025;
      for (const t of trees) {
        const dx = drone.x - (t.x - scroll), dy = drone.y - t.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 3600) {
          const d = Math.sqrt(d2) || 1;
          const f = (60 - d) / 60;
          fx += (dx / d) * f * 0.35;
          fy += (dy / d) * f * 0.9;
        }
      }
      drone.vx = Math.min(2.2, Math.max(1.2, drone.vx + fx * 0.05));
      drone.vy += fy * 0.4;
      drone.vy *= 0.9;
      drone.y = Math.min(FOREST_H - 12, Math.max(12, drone.y + drone.vy));
      drone.heading = Math.atan2(drone.vy, drone.vx);
      scroll += drone.vx;
      if (scroll > 1300) {
        scroll = 0;
        path.length = 0;
      }
      path.push({ x: scroll + drone.x, y: drone.y });
      if (path.length > 260) path.shift();

      ctx.clearRect(0, 0, W, H);
      // Forest
      ctx.fillStyle = c.ink2;
      for (const t of trees) {
        const x = t.x - scroll;
        if (x < -20 || x > W + 20) continue;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Path
      ctx.strokeStyle = c.marker;
      ctx.lineWidth = 2;
      ctx.beginPath();
      path.forEach((p, i) => (i ? ctx.lineTo(p.x - scroll, p.y) : ctx.moveTo(p.x - scroll, p.y)));
      ctx.stroke();
      // Drone
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.rotate(drone.heading);
      ctx.fillStyle = c.rose;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-7, -6);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-7, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      // Depth strip: 32 rays from the drone across ±60°, distance to the nearest tree.
      const rays = 32;
      const stripY = FOREST_H + 14, stripH = H - stripY - 6;
      ctx.fillStyle = c.ink2;
      ctx.font = "10px var(--font-mono)";
      ctx.fillText("depth the policy sees (noisy)", 0, stripY - 4);
      for (let i = 0; i < rays; i++) {
        const a = drone.heading + (-60 + (120 * i) / (rays - 1)) * (Math.PI / 180);
        let dist = 220;
        for (const t of trees) {
          const tx = t.x - scroll - drone.x, ty = t.y - drone.y;
          const proj = tx * Math.cos(a) + ty * Math.sin(a);
          if (proj <= 0) continue;
          const perp = Math.abs(-tx * Math.sin(a) + ty * Math.cos(a));
          if (perp < t.r && proj < dist) dist = proj - t.r;
        }
        const noisy = Math.min(220, Math.max(0, dist + (Math.random() - 0.5) * 18));
        const h = (noisy / 220) * stripH;
        const x = (i / rays) * W;
        ctx.fillStyle = noisy < 50 ? c.rose : c.marker;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x + 1, stripY + stripH - h, W / rays - 3, h);
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="Illustration of the drone-navigation setup">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="hand text-[1.15rem]">Through the forest, from depth alone</span>
        <span className="mono text-xs text-ink-3">illustration, not the trained policy</span>
      </div>
      <canvas ref={canvas} className="block w-full h-auto" style={{ aspectRatio: "640 / 300" }} />
    </div>
  );
}
