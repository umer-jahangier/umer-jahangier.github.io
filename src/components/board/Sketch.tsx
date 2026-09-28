"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type SketchNode = { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string; kind?: "box" | "pill" | "store" | "human" };
export type SketchEdge = { from: string; to: string; label?: string; dashed?: boolean };
export type SketchNote = { x: number; y: number; text: string };
export type SketchDef = { w: number; h: number; nodes: SketchNode[]; edges: SketchEdge[]; notes?: SketchNote[] };

type Pos = Record<string, { x: number; y: number }>;

function edgePath(a: SketchNode, b: SketchNode, pa: { x: number; y: number }, pb: { x: number; y: number }) {
  const ax = a.x + pa.x + a.w / 2, ay = a.y + pa.y + a.h / 2;
  const bx = b.x + pb.x + b.w / 2, by = b.y + pb.y + b.h / 2;
  const clip = (cx: number, cy: number, w: number, h: number, tx: number, ty: number) => {
    const dx = tx - cx, dy = ty - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const sx = dx !== 0 ? (w / 2 + 8) / Math.abs(dx) : Infinity;
    const sy = dy !== 0 ? (h / 2 + 8) / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return { x: cx + dx * s, y: cy + dy * s };
  };
  const p1 = clip(ax, ay, a.w, a.h, bx, by);
  const p2 = clip(bx, by, b.w, b.h, ax, ay);
  // A gentle marker curve: bow the line a little off the straight path.
  const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
  const nx = -(p2.y - p1.y), ny = p2.x - p1.x;
  const len = Math.hypot(nx, ny) || 1;
  const bow = Math.min(18, len * 0.06);
  const cx = mx + (nx / len) * bow, cy = my + (ny / len) * bow;
  const ang = Math.atan2(p2.y - cy, p2.x - cx);
  const head = 9;
  const h1 = { x: p2.x - head * Math.cos(ang - 0.5), y: p2.y - head * Math.sin(ang - 0.5) };
  const h2 = { x: p2.x - head * Math.cos(ang + 0.5), y: p2.y - head * Math.sin(ang + 0.5) };
  return {
    d: `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
    head: `M${h1.x.toFixed(1)} ${h1.y.toFixed(1)} L${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L${h2.x.toFixed(1)} ${h2.y.toFixed(1)}`,
    lx: cx, ly: cy - 6,
  };
}

/**
 * A system drawn in marker. Every path draws itself when it scrolls into view
 * (once), nodes are draggable and spring back, and `current`/`ghost` let an
 * assembly step light up the parts it is talking about.
 */
export default function Sketch({ def, className = "", current, ghost = false, title, eager = false }: { def: SketchDef; className?: string; current?: string[]; ghost?: boolean; title?: string; eager?: boolean }) {
  const root = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState<Pos>({});
  const dragging = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const byId = useMemo(() => Object.fromEntries(def.nodes.map((n) => [n.id, n])), [def]);

  // Draw-in on view.
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = Array.from(svg.querySelectorAll<SVGElement>(".draw"));
    const labels = Array.from(svg.querySelectorAll<SVGElement>(".lbl"));
    if (reduce) {
      paths.forEach((p) => p.classList.add("drawn"));
      gsap.set(labels, { opacity: 1 });
      return;
    }
    gsap.set(labels, { opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(paths, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.07 }, 0).to(labels, { opacity: 1, duration: 0.35, stagger: 0.05, ease: "power1.out" }, 0.25);
    const st = ScrollTrigger.create({ trigger: svg, start: eager ? "top 120%" : "top 82%", once: true, onEnter: () => tl.play() });
    return () => {
      st.kill();
      tl.kill();
    };
  }, [def, eager]);

  // Drag with spring-back.
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const toLocal = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * def.w, y: ((e.clientY - r.top) / r.height) * def.h };
    };
    const onMove = (e: PointerEvent) => {
      const d = dragging.current;
      if (!d) return;
      const l = toLocal(e);
      setPos((p) => ({ ...p, [d.id]: { x: d.ox + (l.x - d.sx), y: d.oy + (l.y - d.sy) } }));
    };
    const onUp = () => {
      const d = dragging.current;
      if (!d) return;
      dragging.current = null;
      const from = { ...(posRef.current[d.id] ?? { x: 0, y: 0 }) };
      gsap.to(from, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", onUpdate: () => setPos((p) => ({ ...p, [d.id]: { x: from.x, y: from.y } })) });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [def]);
  const posRef = useRef<Pos>({});
  posRef.current = pos;

  const isCurrent = (id: string) => !current || current.includes(id);

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${def.w} ${def.h}`}
      className={`block w-full h-auto text-ink ${className}`}
      role="img"
      aria-label={title ?? "System diagram"}
      data-no-draw
      style={{ filter: "url(#marker)" }}
    >
      {title && <title>{title}</title>}
      {def.edges.map((e, i) => {
        const a = byId[e.from], b = byId[e.to];
        if (!a || !b) return null;
        const pa = pos[a.id] ?? { x: 0, y: 0 }, pb = pos[b.id] ?? { x: 0, y: 0 };
        const p = edgePath(a, b, pa, pb);
        const lit = isCurrent(a.id) && isCurrent(b.id);
        return (
          <g key={i} className={`part ${ghost && !lit ? "part-ghost" : ""} ${current && lit ? "part-current" : ""}`}>
            <path className="stroke draw" pathLength={1} d={p.d} strokeDasharray={e.dashed ? "0.06 0.04" : undefined} />
            <path className="stroke draw" pathLength={1} d={p.head} />
            {e.label && (
              <text className="lbl hand" x={p.lx} y={p.ly} textAnchor="middle" fontSize="12.5" fill="var(--marker)">
                {e.label}
              </text>
            )}
          </g>
        );
      })}
      {def.nodes.map((n) => {
        const o = pos[n.id] ?? { x: 0, y: 0 };
        const lit = isCurrent(n.id);
        const r = n.kind === "pill" ? n.h / 2 : 8;
        return (
          <g
            key={n.id}
            transform={`translate(${n.x + o.x} ${n.y + o.y})`}
            className={`part cursor-grab active:cursor-grabbing ${ghost && !lit ? "part-ghost" : ""} ${current && lit ? "part-current" : ""}`}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              const svg = root.current!;
              const rect = svg.getBoundingClientRect();
              const lx = ((e.clientX - rect.left) / rect.width) * def.w, ly = ((e.clientY - rect.top) / rect.height) * def.h;
              dragging.current = { id: n.id, sx: lx, sy: ly, ox: o.x, oy: o.y };
            }}
          >
            {n.kind === "store" ? (
              <path className="stroke draw" pathLength={1} d={`M0 ${n.h * 0.2} a${n.w / 2} ${n.h * 0.2} 0 0 0 ${n.w} 0 v${n.h * 0.6} a${n.w / 2} ${n.h * 0.2} 0 0 1 -${n.w} 0 z M0 ${n.h * 0.2} a${n.w / 2} ${n.h * 0.2} 0 0 1 ${n.w} 0`} />
            ) : n.kind === "human" ? (
              <path className="stroke draw" pathLength={1} d={`M${n.w / 2} 10 a8 8 0 1 0 0.1 0 M${n.w / 2 - 16} ${n.h - 4} c0 -16 32 -16 32 0`} />
            ) : (
              <rect className="stroke draw" pathLength={1} x="0" y="0" width={n.w} height={n.h} rx={r} />
            )}
            <text className="lbl" x={n.w / 2} y={n.sub ? n.h / 2 - 3 : n.h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="13.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">
              {n.label}
            </text>
            {n.sub && (
              <text className="lbl mono sketch-sub" x={n.w / 2} y={n.h / 2 + 13} textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fill="var(--ink-2)">
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
      {def.notes?.map((t, i) => (
        <text key={i} className="lbl hand" x={t.x} y={t.y} fontSize="13.5" fill="var(--marker)">
          {t.text}
        </text>
      ))}
    </svg>
  );
}
