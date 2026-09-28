"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { loadPrefs, markerColor, subscribePrefs } from "@/lib/prefs";
import { sound } from "@/lib/sound";
import { clientId, publishStroke, serverNow, STROKE_FADE, STROKE_TTL, subscribeStrokes } from "@/lib/live";

type Pt = { x: number; y: number; t: number; w: number };
type Stroke = { pts: Pt[]; color: string; born: number; done: boolean; remote?: boolean };

const INTERACTIVE = "a, button, input, textarea, select, label, [role=button], [role=slider], summary";

/**
 * The board sits behind everything: a dot grid, and a canvas where the visitor's
 * cursor is a marker. Moving leaves a fading trail; press and drag draws a stroke
 * that stays for a while, then fades like a wiped board. When the shared board is
 * configured, strokes are published and other visitors' strokes appear too.
 */
export default function Board() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPrefs();
    const cv = canvas.current;
    const cur = cursor.current;
    if (!cv || !cur) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(window.innerWidth * dpr);
      cv.height = Math.floor(window.innerHeight * dpr);
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: Pt[] = [];
    const strokes: Stroke[] = [];
    let drawing: Stroke | null = null;
    let color = markerColor();
    const unsub = subscribePrefs(() => {
      color = markerColor();
    });
    const mo = new MutationObserver(() => (color = markerColor()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-marker"] });

    // Other visitors' strokes arrive in units of the writer's viewport width on both
    // axes, so a circle stays a circle on a screen of another shape.
    let alive = true;
    let unsubLive: (() => void) | undefined;
    if (!reduce) {
      subscribeStrokes((s) => {
        const pts: Pt[] = [];
        for (let i = 0; i + 1 < s.p.length; i += 2) pts.push({ x: s.p[i] * window.innerWidth, y: s.p[i + 1] * window.innerWidth, t: s.t, w: 0.6 });
        strokes.push({ pts, color: s.c, born: s.t, done: true, remote: true });
      }).then((u) => (alive ? (unsubLive = u) : u()));
    }

    const qx = gsap.quickTo(cur, "x", { duration: 0.16, ease: "power3.out" });
    const qy = gsap.quickTo(cur, "y", { duration: 0.16, ease: "power3.out" });
    const qs = gsap.quickTo(cur, "scale", { duration: 0.25, ease: "power3.out" });

    let last: Pt | null = null;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const p = { x: e.clientX, y: e.clientY, t: now, w: 0 };
      if (last) {
        const d = Math.hypot(p.x - last.x, p.y - last.y);
        const dt = Math.max(now - last.t, 1);
        const speed = Math.min(d / dt, 3);
        p.w = speed;
        if (drawing) {
          if (drawing.pts.length < 2400) drawing.pts.push(p);
          sound.squeak(Math.min(speed / 2.2, 1));
        } else if (fine && !reduce) {
          trail.push(p);
        }
      }
      last = p;
      if (fine) {
        qx(p.x);
        qy(p.y);
        const t = e.target as HTMLElement | null;
        qs(t?.closest(INTERACTIVE) ? 2.2 : 1);
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.button !== 0 || !t || t.closest(INTERACTIVE) || t.closest("[data-no-draw]")) return;
      if (reduce) return;
      e.preventDefault();
      drawing = { pts: [{ x: e.clientX, y: e.clientY, t: performance.now(), w: 0 }], color, born: serverNow(), done: false };
      strokes.push(drawing);
      qs(0.6);
    };
    const onUp = () => {
      if (drawing) {
        const s = drawing;
        s.done = true;
        s.born = serverNow();
        drawing = null;
        if (s.pts.length > 3) {
          // Share it: at most 400 points, in units of this viewport's width.
          const step = Math.max(1, Math.ceil(s.pts.length / 400));
          const p: number[] = [];
          for (let i = 0; i < s.pts.length; i += step) p.push(+(s.pts[i].x / window.innerWidth).toFixed(4), +(s.pts[i].y / window.innerWidth).toFixed(4));
          void publishStroke({ cid: clientId, c: s.color, t: s.born, p });
        }
      }
      qs(1);
    };
    const clear = () => {
      for (let i = strokes.length - 1; i >= 0; i--) if (!strokes[i].remote) strokes.splice(i, 1);
      trail.length = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    // A stroke whose release happens outside the window still ends.
    window.addEventListener("blur", onUp);
    document.documentElement.addEventListener("pointerleave", onUp);
    window.addEventListener("board:clear", clear);

    const line = (pts: Pt[], alpha: number, width: number, col: string) => {
      if (pts.length < 2) return;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = col;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.lineWidth = width * (1 - Math.min(pts[i].w, 2) * 0.18);
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.stroke();
    };

    let raf = 0;
    const frame = () => {
      const now = performance.now();
      const wall = serverNow();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      while (trail.length && now - trail[0].t > 350) trail.shift();
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const a = 1 - (now - trail[i].t) / 350;
          line([trail[i - 1], trail[i], trail[i]], a * 0.45, 4, color);
        }
      }
      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i];
        let a = s.remote ? 0.8 : 0.95;
        if (s.done) {
          const age = wall - s.born;
          if (age > STROKE_TTL) a *= Math.max(0, 1 - (age - STROKE_TTL) / STROKE_FADE);
          if (a <= 0) {
            strokes.splice(i, 1);
            continue;
          }
        }
        line(s.pts, a, 5, s.color);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      document.documentElement.removeEventListener("pointerleave", onUp);
      window.removeEventListener("board:clear", clear);
      alive = false;
      unsub();
      unsubLive?.();
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--grid) 1.2px, transparent 1.4px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "14px 14px",
        }}
      />
      <canvas ref={canvas} aria-hidden className="fixed inset-0 z-[5] pointer-events-none" />
      <div ref={cursor} aria-hidden className="marker-cursor" />
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <filter id="marker" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
