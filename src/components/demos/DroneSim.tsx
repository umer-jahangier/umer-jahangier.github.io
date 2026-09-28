"use client";
import { useEffect, useRef } from "react";
import { useInView } from "./useInView";

type Tree = { x: number; y: number; r: number };

const W = 640, H = 340, BAND_TOP = 18, BAND_BOTTOM = 214, STRIP_TOP = 250, STRIP_H = 72;
const RAYS = 32, FOV = Math.PI / 1.5, MAX_D = 150, SPEED = 1.35, MARGIN = 9;

function makeForest(seed: number): Tree[] {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const trees: Tree[] = [];
  let tries = 0;
  while (trees.length < 46 && tries++ < 3000) {
    const t = { x: 90 + rnd() * (W - 120), y: BAND_TOP + 14 + rnd() * (BAND_BOTTOM - BAND_TOP - 28), r: 7 + rnd() * 9 };
    // Keep a corridor at least a drone-width wide between canopies.
    if (trees.every((o) => Math.hypot(o.x - t.x, o.y - t.y) > o.r + t.r + 26)) trees.push(t);
  }
  return trees;
}

/** Distance along a ray until it touches a canopy (plus margin), capped at MAX_D. */
function cast(trees: Tree[], x: number, y: number, a: number, max = MAX_D) {
  const cx = Math.cos(a), sy = Math.sin(a);
  let best = max;
  for (const t of trees) {
    const dx = t.x - x, dy = t.y - y;
    const proj = dx * cx + dy * sy;
    if (proj <= 0 || proj - t.r > best) continue;
    const perp = Math.abs(-dx * sy + dy * cx);
    const rr = t.r + MARGIN;
    if (perp < rr) {
      const hit = proj - Math.sqrt(rr * rr - perp * perp);
      if (hit < best) best = Math.max(0, hit);
    }
  }
  // The band edges are walls too.
  if (sy < 0) best = Math.min(best, (y - BAND_TOP) / -sy);
  if (sy > 0) best = Math.min(best, (BAND_BOTTOM - y) / sy);
  return best;
}

/**
 * A quadrotor crosses a forest from depth alone. Each frame it samples a fan of
 * headings, scores them by free distance and by how far they stray from the
 * goal, and turns toward the best. Below: the depth strip it steers from.
 * This illustrates the thesis setup; it is not the trained policy.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = H * dpr;
    const cs = getComputedStyle(document.documentElement);
    const col = () => ({ ink: cs.getPropertyValue("--ink").trim(), ink2: cs.getPropertyValue("--ink-2").trim(), ink3: cs.getPropertyValue("--ink-3").trim(), marker: cs.getPropertyValue("--marker").trim(), rose: cs.getPropertyValue("--rose").trim(), soft: cs.getPropertyValue("--marker-soft").trim(), line: cs.getPropertyValue("--line").trim() });

    let seed = 23;
    let trees = makeForest(seed);
    const drone = { x: 8, y: (BAND_TOP + BAND_BOTTOM) / 2, h: 0 };
    let path: { x: number; y: number }[] = [];
    let fade = 1; // 1 visible, fades to 0 at the far edge before the next run
    let depth = new Array(RAYS).fill(MAX_D);

    const step = () => {
      // Sense: a fan of rays across the field of view.
      for (let i = 0; i < RAYS; i++) {
        const a = drone.h - FOV / 2 + (FOV * i) / (RAYS - 1);
        const d = cast(trees, drone.x, drone.y, a);
        depth[i] = Math.min(MAX_D, Math.max(0, d + (Math.random() - 0.5) * 10));
      }
      // Decide: score candidate headings, prefer straight and open.
      let bestScore = -Infinity, bestA = drone.h;
      for (let k = -8; k <= 8; k++) {
        const a = drone.h + k * (Math.PI / 36);
        const free = cast(trees, drone.x, drone.y, a);
        const goal = Math.abs(a); // 0 = straight to the right edge
        const mid = Math.abs(drone.y + Math.sin(a) * 60 - (BAND_TOP + BAND_BOTTOM) / 2) / 100;
        const score = Math.min(free, 110) - goal * 55 - Math.abs(k) * 1.2 - mid * 8;
        if (score > bestScore) {
          bestScore = score;
          bestA = a;
        }
      }
      const ahead = cast(trees, drone.x, drone.y, drone.h);
      const turnRate = ahead < 24 ? 0.16 : 0.07;
      let diff = bestA - drone.h;
      diff = Math.max(-turnRate, Math.min(turnRate, diff));
      drone.h += diff;
      drone.h = Math.max(-1.2, Math.min(1.2, drone.h));
      // Act.
      drone.x += Math.cos(drone.h) * SPEED;
      drone.y += Math.sin(drone.h) * SPEED;
      drone.y = Math.max(BAND_TOP + 6, Math.min(BAND_BOTTOM - 6, drone.y));
      path.push({ x: drone.x, y: drone.y });
      if (drone.x > W - 40) fade = Math.max(0, fade - 0.03);
      if (drone.x > W + 6) {
        seed += 7;
        trees = makeForest(seed);
        drone.x = 8;
        drone.y = (BAND_TOP + BAND_BOTTOM) / 2;
        drone.h = 0;
        path = [];
        fade = 1;
      }
    };

    const draw = () => {
      const c = col();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // The band.
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.75, BAND_TOP - 8 + 0.75, W - 1.5, BAND_BOTTOM - BAND_TOP + 16 - 1.5);
      // Canopies.
      for (const t of trees) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = c.ink3;
        ctx.globalAlpha = 0.28;
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = c.ink2;
        ctx.stroke();
      }
      ctx.globalAlpha = fade;
      // Field of view.
      ctx.beginPath();
      ctx.moveTo(drone.x, drone.y);
      for (let i = 0; i < RAYS; i++) {
        const a = drone.h - FOV / 2 + (FOV * i) / (RAYS - 1);
        const d = Math.min(depth[i], 90);
        ctx.lineTo(drone.x + Math.cos(a) * d, drone.y + Math.sin(a) * d);
      }
      ctx.closePath();
      ctx.fillStyle = c.soft;
      ctx.fill();
      // Path.
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.strokeStyle = c.marker;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
      // The quadrotor: a body and four rotors, nose along the heading.
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.rotate(drone.h);
      ctx.fillStyle = c.rose;
      ctx.strokeStyle = c.rose;
      ctx.lineWidth = 1.5;
      for (const [rx, ry] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) {
        ctx.beginPath();
        ctx.arc(rx, ry, 3.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.lineTo(5, 5);
      ctx.moveTo(5, -5);
      ctx.lineTo(-5, 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(3, -3);
      ctx.lineTo(3, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
      // Depth strip: nearer is taller.
      ctx.fillStyle = c.ink2;
      ctx.font = "500 11px var(--font-text)";
      ctx.fillText("What the policy sees: 32 depth rays across its view, nearer is taller", 0, STRIP_TOP - 8);
      const bw = W / RAYS;
      for (let i = 0; i < RAYS; i++) {
        const near = 1 - depth[i] / MAX_D;
        const h = Math.max(2, near * STRIP_H);
        ctx.fillStyle = near > 0.72 ? c.rose : c.marker;
        ctx.globalAlpha = 0.25 + near * 0.7;
        ctx.fillRect(i * bw + 1.5, STRIP_TOP + STRIP_H - h, bw - 3, h);
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    if (reduce) {
      for (let i = 0; i < 260; i++) step();
      draw();
    } else raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="Illustration of the drone-navigation setup">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="hand text-[1.15rem]">Through the forest, from depth alone</span>
        <span className="mono text-xs text-ink-3">illustration, not the trained policy</span>
      </div>
      <canvas ref={canvas} className="block w-full h-auto" style={{ aspectRatio: `${W} / ${H}` }} />
    </div>
  );
}
