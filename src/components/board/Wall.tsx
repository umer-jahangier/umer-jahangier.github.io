"use client";
import { useEffect, useRef, useState } from "react";
import { liveReady, publishWall, removeWall, serverNow, subscribeWall, WALL_TTL, type LiveStroke } from "@/lib/live";
import { markerColor, subscribePrefs } from "@/lib/prefs";
import { sound } from "@/lib/sound";

type Pt = { x: number; y: number };
type Stroke = { id: string; pts: Pt[]; color: string; t: number };

const MAX_POINTS = 400;
const MIN_GAP_MS = 350; // between published strokes from one visitor
const UNDO_WINDOW = 60_000; // a stroke can be taken back for a minute

/**
 * The open board: a fixed-proportion wall everyone draws on. Strokes are stored
 * normalised to the wall, so a line drawn on a phone lands in the same place on
 * a desktop. Everything stays for 24 hours, then any visitor's browser wipes it.
 */
export default function Wall() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const [notice, setNotice] = useState<string>("");

  useEffect(() => {
    const cv = canvas.current;
    const el = box.current;
    if (!cv || !el) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const strokes = new Map<string, Stroke>();
    const mine: { id: string; t: number }[] = []; // my saved strokes, newest last
    let drawing: Stroke | null = null;
    let color = markerColor();
    let lastPublish = 0;
    let dirty = true;
    const unsubPrefs = subscribePrefs(() => (color = markerColor()));
    const mo = new MutationObserver(() => (color = markerColor()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-marker"] });

    let dpr = 1;
    const resize = () => {
      const r = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(r.width * dpr);
      cv.height = Math.floor(r.height * dpr);
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const toLocal = (e: PointerEvent): Pt => {
      const r = el.getBoundingClientRect();
      return { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || reduce) return;
      e.preventDefault();
      cv.setPointerCapture(e.pointerId);
      drawing = { id: "local-" + Date.now(), pts: [toLocal(e)], color, t: serverNow() };
      strokes.set(drawing.id, drawing);
      dirty = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing) return;
      const p = toLocal(e);
      const last = drawing.pts[drawing.pts.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) < 0.002) return;
      if (drawing.pts.length < MAX_POINTS) drawing.pts.push(p);
      sound.squeak(0.4);
      dirty = true;
    };
    const onUp = () => {
      if (!drawing) return;
      const s = drawing;
      drawing = null;
      if (s.pts.length < 2 || Date.now() - lastPublish < MIN_GAP_MS) return;
      lastPublish = Date.now();
      s.t = serverNow(); // the rules judge the stroke by when it was saved, not when it was begun
      const p: number[] = [];
      s.pts.forEach((q) => p.push(+q.x.toFixed(4), +q.y.toFixed(4)));
      void publishWall({ cid: "", c: s.color, t: s.t, p }).then((id) => {
        if (id) {
          strokes.delete(s.id);
          strokes.set(id, { ...s, id });
          mine.push({ id, t: s.t });
          setNotice("");
        } else {
          setNotice("The shared board refused that drawing, so it stays only on your screen.");
        }
        dirty = true;
      });
    };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);

    // The toolbar's eraser: take back my most recent stroke while the undo window is open.
    const undo = () => {
      // Unsaved local strokes go first.
      let removedLocal = false;
      strokes.forEach((s, id) => {
        if (id.startsWith("local-")) {
          strokes.delete(id);
          removedLocal = true;
        }
      });
      if (removedLocal) dirty = true;
      const recent = mine.filter((m) => serverNow() - m.t < UNDO_WINDOW);
      const last = recent[recent.length - 1];
      if (!last) {
        setNotice(removedLocal ? "" : mine.length ? "Your strokes older than a minute stay on the board for the day." : "Nothing of yours to erase yet.");
        return;
      }
      void removeWall(last.id).then((ok) => {
        if (ok) {
          strokes.delete(last.id);
          mine.splice(mine.indexOf(last), 1);
          setCount(strokes.size);
          setNotice("Erased your last stroke.");
        } else {
          setNotice("The board would not let that stroke go; strokes older than a minute stay for the day.");
        }
        dirty = true;
      });
    };
    window.addEventListener("board:clear", undo);

    let alive = true;
    let unsubLive: (() => void) | undefined;
    liveReady().then(async (ok) => {
      if (!alive) return;
      setLive(ok);
      if (!ok) return;
      const u = await subscribeWall(
        (s: LiveStroke) => {
          if (strokes.has(s.id)) return;
          const pts: Pt[] = [];
          for (let i = 0; i + 1 < s.p.length; i += 2) pts.push({ x: s.p[i], y: s.p[i + 1] });
          strokes.set(s.id, { id: s.id, pts, color: s.c, t: s.t });
          setCount(strokes.size);
          dirty = true;
        },
        (id: string) => {
          strokes.delete(id);
          setCount(strokes.size);
          dirty = true;
        },
      );
      if (alive) unsubLive = u;
      else u();
    });

    let raf = 0;
    const frame = () => {
      if (dirty) {
        dirty = false;
        const w = cv.width, h = cv.height;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(2, 0.004 * w);
        const now = serverNow();
        strokes.forEach((s, id) => {
          if (now - s.t > WALL_TTL) {
            strokes.delete(id);
            return;
          }
          if (s.pts.length < 2) return;
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = 0.95;
          ctx.beginPath();
          ctx.moveTo(s.pts[0].x * w, s.pts[0].y * h);
          for (let i = 1; i < s.pts.length - 1; i++) {
            const mx = ((s.pts[i].x + s.pts[i + 1].x) / 2) * w;
            const my = ((s.pts[i].y + s.pts[i + 1].y) / 2) * h;
            ctx.quadraticCurveTo(s.pts[i].x * w, s.pts[i].y * h, mx, my);
          }
          const l = s.pts[s.pts.length - 1];
          ctx.lineTo(l.x * w, l.y * h);
          ctx.stroke();
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      unsubPrefs();
      unsubLive?.();
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      window.removeEventListener("board:clear", undo);
    };
  }, []);

  const status =
    notice ||
    (live === null && "Connecting to the board…") ||
    (live === true && (count ? `${count} drawing${count === 1 ? "" : "s"} on the board right now. Each one stays 24 hours; the eraser in the toolbar takes back your last stroke for a minute.` : "The board is empty. Draw something; it stays 24 hours and everyone sees it. The eraser in the toolbar takes back your last stroke for a minute.")) ||
    (live === false && "The shared board is not reachable right now; what you draw here stays on your screen.");
  return (
    <div data-no-draw>
      <p className="mb-3 text-sm text-ink-2" role="status" aria-live="polite">
        {status}
      </p>
      <div ref={box} className="panel wall-frame relative overflow-hidden rounded-[8px]" style={{ touchAction: "none" }}>
        <canvas ref={canvas} className="absolute inset-0 w-full h-full cursor-crosshair" aria-label="The open board. Draw with the mouse or a finger; drawings stay for 24 hours and everyone sees them." role="img" />
      </div>
    </div>
  );
}
