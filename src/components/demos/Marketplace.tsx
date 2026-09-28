"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useInView } from "./useInView";

const STAGES = [
  { who: "Homeowner", what: "posts the job" },
  { who: "Contractor", what: "sends a quote" },
  { who: "Homeowner", what: "approves a milestone" },
  { who: "Contractor", what: "invoices, paid by card" },
  { who: "Vendor", what: "receives a payout" },
];
const W = 640, H = 210, BW = 104, BH = 54, GAP = 22, X0 = 12, Y = 70;

/**
 * Money and work move through Elio in five steps. The token walks the flow;
 * every step is a real state in the platform's ledger. An example flow, not
 * a real project.
 */
export default function Marketplace() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const token = useRef<SVGGElement>(null);
  const [at, setAt] = useState<number>(-1);

  useEffect(() => {
    if (!inView || !token.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = token.current;
    const xs = STAGES.map((_, i) => X0 + i * (BW + GAP) + BW / 2);
    if (reduce) {
      gsap.set(t, { x: xs[2], y: Y - 22, opacity: 1 });
      setAt(2);
      return;
    }
    let alive = true;
    const run = () => {
      if (!alive) return;
      gsap.set(t, { x: xs[0], y: Y - 22, opacity: 0 });
      setAt(-1);
      const tl = gsap.timeline({ onComplete: () => window.setTimeout(run, 1400) });
      tl.to(t, { opacity: 1, duration: 0.3, onStart: () => setAt(0) });
      for (let i = 1; i < xs.length; i++) {
        tl.to(t, { x: xs[i], duration: 0.7, ease: "power2.inOut", onComplete: () => setAt(i) }, "+=0.9");
      }
      tl.to(t, { opacity: 0, duration: 0.4 }, "+=1.1");
    };
    run();
    return () => {
      alive = false;
      gsap.killTweensOf(t);
    };
  }, [inView]);

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="Elio's marketplace flow, animated">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="hand text-[1.15rem]">Work in, money out, in five steps</span>
        <span className="mono text-xs text-ink-3">example flow</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto text-ink" role="img" aria-label="Homeowner posts a job, contractor quotes, milestone approved, invoice paid, vendor paid out">
        {STAGES.map((s, i) => {
          const x = X0 + i * (BW + GAP);
          const on = at === i, past = at > i;
          return (
            <g key={i}>
              {i < STAGES.length - 1 && <path className="stroke" d={`M${x + BW + 3} ${Y + BH / 2} h${GAP - 12} m-5 -5 l5 5 -5 5`} style={{ strokeWidth: 1.5, opacity: past ? 0.9 : 0.35, transition: "opacity 300ms" }} />}
              <rect x={x} y={Y} width={BW} height={BH} rx="8" className="stroke" fill={on ? "var(--marker-soft)" : "transparent"} style={{ strokeWidth: 1.5, opacity: at >= 0 && !on && !past ? 0.45 : 1, transition: "fill 250ms, opacity 300ms" }} />
              <text x={x + BW / 2} y={Y + 22} textAnchor="middle" fontSize="11.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">{s.who}</text>
              <text x={x + BW / 2} y={Y + 39} textAnchor="middle" fontSize="10" fontFamily="var(--font-text)" fill="var(--ink-2)">{s.what}</text>
              <text x={x + BW / 2} y={Y + BH + 22} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-3)">{["project", "quote", "milestone", "invoice · ledger", "vendor payout"][i]}</text>
            </g>
          );
        })}
        <text x={X0} y={H - 12} className="hand" fontSize="12.5" fill="var(--marker)">web and Flutter apps update live over Socket.io</text>
        <text x={W - 12} y={H - 12} textAnchor="end" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">Stripe · Square · 32 data models</text>
        <g ref={token} opacity="0">
          <circle r="9" fill="var(--rose)" />
          <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="var(--font-text)" fill="#fff">$</text>
        </g>
      </svg>
    </div>
  );
}
