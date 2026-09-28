"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useInView } from "./useInView";

const NAMED = ["Point of sale", "Kitchen display", "Inventory", "Finance", "Purchasing", "HR & payroll", "Reporting"];

/**
 * RestaurantOS request path, animated: a request enters the gateway, OPA decides,
 * an allowed request reaches a service and its tenant's rows; a denied one stops
 * at the gate. Seven of the fifteen services are named on the CV; the rest are drawn unnamed.
 */
export default function ServiceMap() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const dot = useRef<SVGCircleElement>(null);
  const verdict = useRef<SVGTextElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const W = 640, H = 360;
  const cx = 320, cy = 226, R = 112;
  const services = Array.from({ length: 15 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 15) * Math.PI * 2;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, name: NAMED[i] ?? "" };
  });

  useEffect(() => {
    if (!inView || !dot.current || !verdict.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let alive = true;
    const run = () => {
      if (!alive) return;
      const allow = Math.random() < 0.72;
      const i = Math.floor(Math.random() * 15);
      const s = services[i];
      const d = dot.current!, v = verdict.current!;
      gsap.set(d, { attr: { cx: 40, cy: 30 }, opacity: 1 });
      gsap.set(v, { opacity: 0 });
      v.textContent = allow ? "allow" : "deny";
      v.setAttribute("fill", allow ? "var(--marker)" : "var(--rose)");
      const tl = gsap.timeline({ onComplete: () => window.setTimeout(run, 500) });
      tl.to(d, { attr: { cx: cx, cy: 44 }, duration: 0.7, ease: "power2.inOut" })
        .to(v, { opacity: 1, duration: 0.2 })
        .to(d, { attr: { cx: cx, cy: 78 }, duration: 0.25, ease: "power1.inOut" });
      if (allow) {
        tl.to(d, { attr: { cx: s.x, cy: s.y }, duration: 0.6, ease: "power2.inOut" })
          .to(d, { attr: { cx: 560, cy: 320 }, duration: 0.55, ease: "power2.inOut" })
          .to(d, { opacity: 0, duration: 0.2 });
        setLog((l) => [`allowed → ${s.name || "service " + (i + 1)} → rows where tenant_id = mine`, ...l].slice(0, 4));
      } else {
        tl.to(d, { attr: { cx: cx + 22 }, duration: 0.12, yoyo: true, repeat: 3 }).to(d, { opacity: 0, duration: 0.2 });
        setLog((l) => [`denied at the gate, nothing ran`, ...l].slice(0, 4));
      }
    };
    run();
    return () => {
      alive = false;
      gsap.killTweensOf([dot.current, verdict.current]);
    };
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="RestaurantOS request path, animated">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="hand text-[1.15rem]">One request through RestaurantOS</span>
        <span className="mono text-xs text-ink-3">7 of 15 services named</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto text-ink" role="img" aria-label="Gateway, policy gate, fifteen services and the database">
        <text x="40" y="20" className="hand" fontSize="13" fill="var(--marker)">request</text>
        <rect x={cx - 70} y="20" width="140" height="48" rx="8" className="stroke" />
        <text x={cx} y="40" textAnchor="middle" fontSize="12.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">Gateway</text>
        <text x={cx} y="56" textAnchor="middle" fontSize="10.5" fontFamily="var(--font-mono)" fill="var(--ink-2)">JWT · OPA</text>
        <text ref={verdict} x={cx + 84} y="50" className="hand" fontSize="14" opacity="0">allow</text>
        {services.map((s, i) => {
          const above = s.y < cy;
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={s.name ? 13 : 8} className="stroke" style={{ strokeWidth: 2 }} />
              {s.name && (
                <text x={s.x} y={above ? s.y - 20 : s.y + 26} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-text)" fontWeight="600" fill="currentColor">
                  {s.name}
                </text>
              )}
            </g>
          );
        })}
        <ellipse cx="560" cy="300" rx="48" ry="12" className="stroke" style={{ strokeWidth: 2 }} />
        <path d="M512 300 v34 a48 12 0 0 0 96 0 v-34" className="stroke" style={{ strokeWidth: 2 }} />
        <text x="560" y="325" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">RLS · tenant_id</text>
        <circle ref={dot} r="6" fill="var(--marker)" opacity="0" />
      </svg>
      <ul className="mono text-xs text-ink-2 grid gap-1 mt-2 min-h-[4.5rem]" aria-live="polite">
        {log.map((l, i) => (
          <li key={i} style={{ opacity: 1 - i * 0.22 }}>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
