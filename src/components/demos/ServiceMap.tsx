"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useInView } from "./useInView";

const NAMED = ["Point of sale", "Kitchen", "Inventory", "Finance", "Purchasing", "HR & payroll", "Reporting"];
const W = 640, H = 340;
const COLS = 5, ROWS = 3, BW = 104, BH = 34, GX = 21, GY = 16, X0 = 20, Y0 = 108;
const GATE = { x: 20, y: 20, w: 170, h: 46 }, OPA = { x: 450, y: 20, w: 170, h: 46 }, DB = { x: 470, y: 268, w: 150, h: 60 };

/**
 * One request through RestaurantOS: it enters the gateway, OPA gives a verdict,
 * an allowed request reaches its service and then only its tenant's rows; a
 * denied one stops at the gate. Seven of the fifteen services are named on the CV.
 */
export default function ServiceMap() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const dot = useRef<SVGCircleElement>(null);
  const verdict = useRef<SVGTextElement>(null);
  const lane = useRef<SVGTextElement>(null);
  const [hot, setHot] = useState<number | null>(null);
  const [log, setLog] = useState<{ ok: boolean; text: string }[]>([]);
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ x: X0 + (i % COLS) * (BW + GX), y: Y0 + Math.floor(i / COLS) * (BH + GY), name: NAMED[i] ?? "" }));

  useEffect(() => {
    if (!inView || !dot.current || !verdict.current || !lane.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = dot.current, v = verdict.current, l = lane.current;
    if (reduce) {
      gsap.set(d, { attr: { cx: cells[2].x + BW / 2, cy: cells[2].y + BH / 2 }, opacity: 1 });
      setHot(2);
      v.textContent = "allow";
      gsap.set(v, { opacity: 1 });
      return;
    }
    let alive = true;
    const run = () => {
      if (!alive) return;
      const allow = Math.random() < 0.72;
      const i = Math.floor(Math.random() * cells.length);
      const c = cells[i];
      const tenant = `t_${100 + Math.floor(Math.random() * 900)}`;
      v.textContent = allow ? "allow" : "deny";
      v.setAttribute("fill", allow ? "var(--marker)" : "var(--rose)");
      l.textContent = `where tenant_id = '${tenant}'`;
      gsap.set(d, { attr: { cx: -8, cy: GATE.y + GATE.h / 2 }, opacity: 1 });
      gsap.set([v, l], { opacity: 0 });
      setHot(null);
      const tl = gsap.timeline({ onComplete: () => window.setTimeout(run, 650) });
      tl.to(d, { attr: { cx: GATE.x + GATE.w - 10 }, duration: 0.55, ease: "power2.inOut" })
        .to(d, { attr: { cx: OPA.x + 10 }, duration: 0.5, ease: "power2.inOut" })
        .to(v, { opacity: 1, duration: 0.15 });
      if (allow) {
        tl.to(d, { attr: { cx: c.x + BW / 2, cy: c.y + BH / 2 }, duration: 0.6, ease: "power2.inOut", onStart: () => setHot(i) })
          .to(d, { attr: { cx: DB.x + DB.w / 2, cy: DB.y + 14 }, duration: 0.55, ease: "power2.inOut" })
          .to(l, { opacity: 1, duration: 0.2 }, "<0.3")
          .to(d, { opacity: 0, duration: 0.3 }, "+=0.5")
          .add(() => setLog((x) => [{ ok: true, text: `allowed → ${c.name || `service ${i + 1}`} → rows ${tenant} only` }, ...x].slice(0, 3)));
      } else {
        tl.to(d, { attr: { cx: OPA.x - 26 }, duration: 0.18, ease: "power2.out" })
          .to(d, { attr: { cx: OPA.x - 14 }, duration: 0.12, yoyo: true, repeat: 3 })
          .to(d, { opacity: 0, duration: 0.25 })
          .add(() => setLog((x) => [{ ok: false, text: "denied at the gate; no service ran" }, ...x].slice(0, 3)));
      }
    };
    run();
    return () => {
      alive = false;
      gsap.killTweensOf([d, v, l]);
    };
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="RestaurantOS request path, animated">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="hand text-[1.15rem]">One request through RestaurantOS</span>
        <span className="mono text-xs text-ink-3">7 of 15 services named</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto text-ink" role="img" aria-label="Gateway, policy gate, fifteen services and the database">
        <rect x={GATE.x} y={GATE.y} width={GATE.w} height={GATE.h} rx="8" className="stroke" />
        <text x={GATE.x + GATE.w / 2} y={GATE.y + 20} textAnchor="middle" fontSize="12.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">Spring Cloud Gateway</text>
        <text x={GATE.x + GATE.w / 2} y={GATE.y + 35} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">RS256 JWT · TOTP</text>
        <line x1={GATE.x + GATE.w} y1={GATE.y + GATE.h / 2} x2={OPA.x} y2={OPA.y + OPA.h / 2} className="stroke" strokeDasharray="4 5" style={{ strokeWidth: 1.5, opacity: 0.5 }} />
        <text ref={verdict} x={(GATE.x + GATE.w + OPA.x) / 2} y={OPA.y + OPA.h / 2 - 8} textAnchor="middle" className="hand" fontSize="14" opacity="0">allow</text>
        <rect x={OPA.x} y={OPA.y} width={OPA.w} height={OPA.h} rx="8" className="stroke" />
        <text x={OPA.x + OPA.w / 2} y={OPA.y + 20} textAnchor="middle" fontSize="12.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">OPA · Rego policy</text>
        <text x={OPA.x + OPA.w / 2} y={OPA.y + 35} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">deny unless allowed</text>
        <text x={X0} y={Y0 - 14} fontSize="10.5" fontFamily="var(--font-mono)" fill="var(--ink-2)">15 Spring Boot services</text>
        {cells.map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={c.y} width={BW} height={BH} rx="6" className="stroke" strokeDasharray={c.name ? undefined : "3 4"} fill={hot === i ? "var(--marker-soft)" : "transparent"} style={{ strokeWidth: 1.5, transition: "fill 250ms" }} />
            {c.name ? (
              <text x={c.x + BW / 2} y={c.y + BH / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">{c.name}</text>
            ) : (
              <text x={c.x + BW / 2} y={c.y + BH / 2 + 4} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-3)">service</text>
            )}
          </g>
        ))}
        <ellipse cx={DB.x + DB.w / 2} cy={DB.y + 10} rx={DB.w / 2} ry="10" className="stroke" style={{ strokeWidth: 1.5 }} />
        <path d={`M${DB.x} ${DB.y + 10} v${DB.h - 20} a${DB.w / 2} 10 0 0 0 ${DB.w} 0 v-${DB.h - 20}`} className="stroke" style={{ strokeWidth: 1.5 }} />
        <text x={DB.x + DB.w / 2} y={DB.y + 38} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">PostgreSQL · RLS</text>
        <text ref={lane} x={DB.x + DB.w / 2} y={DB.y + 52} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--marker)" opacity="0">where tenant_id = …</text>
        {[["RabbitMQ", 20], ["Redis", 150], ["ClickHouse", 280]].map(([n, x]) => (
          <g key={n as string}>
            <rect x={x as number} y={DB.y + 14} width="110" height="32" rx="16" className="stroke" style={{ strokeWidth: 1.5, opacity: 0.7 }} />
            <text x={(x as number) + 55} y={DB.y + 34} textAnchor="middle" fontSize="11" fontFamily="var(--font-text)" fill="var(--ink-2)">{n}</text>
          </g>
        ))}
        <circle ref={dot} r="6" fill="var(--marker)" opacity="0" />
      </svg>
      <ul className="mono text-xs grid gap-1 mt-2 min-h-[3.6rem]" aria-live="polite">
        {log.map((l, i) => (
          <li key={i} style={{ opacity: 1 - i * 0.3, color: l.ok ? "var(--ink-2)" : "var(--rose)" }}>
            {l.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
