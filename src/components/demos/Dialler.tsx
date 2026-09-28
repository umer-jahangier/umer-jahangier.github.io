"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";

type Line = { id: number; num: string; state: "dialling" | "ringing" | "connected" | "voicemail" | "no answer" | "ended"; hint?: string; bars: number[] };
const HINTS = ["Ask about their current process", "Mention the free trial", "Confirm the decision maker", "Offer a demo this week", "Summarise next steps"];

/** Simulation of a predictive dialler: several lines dial ahead so a rep is always on a live call. Numbers are masked and invented. */
export default function Dialler() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stats, setStats] = useState({ dials: 0, connects: 0 });
  const { ref, inView } = useInView<HTMLDivElement>();
  const idRef = useRef(1);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mask = () => `+1 (${200 + Math.floor(Math.random() * 700)}) ··· ${String(1000 + Math.floor(Math.random() * 9000)).slice(0, 4)}`;
    if (reduce) {
      setLines([
        { id: 1, num: mask(), state: "connected", hint: HINTS[0], bars: [4, 8, 6, 10, 5, 7] },
        { id: 2, num: mask(), state: "ringing", bars: [] },
        { id: 3, num: mask(), state: "dialling", bars: [] },
      ]);
      setStats({ dials: 3, connects: 1 });
      return;
    }
    let alive = true;
    const spawn = () => {
      if (!alive) return;
      const id = idRef.current++;
      setLines((l) => [...l.slice(-4), { id, num: mask(), state: "dialling", bars: [] }]);
      setStats((s) => ({ ...s, dials: s.dials + 1 }));
      const set = (patch: Partial<Line>) => setLines((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      window.setTimeout(() => set({ state: "ringing" }), 700);
      const r = Math.random();
      if (r < 0.5) {
        window.setTimeout(() => {
          set({ state: "connected", hint: HINTS[Math.floor(Math.random() * HINTS.length)] });
          setStats((s) => ({ ...s, connects: s.connects + 1 }));
        }, 2000);
        window.setTimeout(() => set({ state: "ended" }), 6500 + Math.random() * 2000);
      } else if (r < 0.75) window.setTimeout(() => set({ state: "voicemail" }), 2400);
      else window.setTimeout(() => set({ state: "no answer" }), 3200);
      window.setTimeout(spawn, 1400 + Math.random() * 1200);
    };
    spawn();
    const wave = window.setInterval(() => {
      setLines((l) => l.map((x) => (x.state === "connected" ? { ...x, bars: Array.from({ length: 14 }, () => 2 + Math.random() * 12) } : x)));
    }, 140);
    return () => {
      alive = false;
      window.clearInterval(wave);
    };
  }, [inView]);

  const rate = stats.dials ? Math.round((stats.connects / stats.dials) * 100) : 0;
  return (
    <div ref={ref} className="panel p-5 md:p-6" data-no-draw aria-label="Simulation of a predictive dialler">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <span className="hand text-[1.15rem]">The dialler, simulated</span>
        <span className="mono text-xs text-ink-3">numbers invented</span>
      </div>
      <ul className="grid gap-2.5 min-h-[228px]">
        {lines.map((l) => (
          <li key={l.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-[0.9375rem]" style={{ opacity: l.state === "ended" || l.state === "voicemail" || l.state === "no answer" ? 0.45 : 1, transition: "opacity 400ms" }}>
            <span className="mono text-sm">{l.num}</span>
            <span className="flex items-center gap-2 min-w-0">
              {l.state === "connected" ? (
                <>
                  <span className="flex items-end gap-[2px] h-4" aria-hidden>
                    {l.bars.map((b, i) => (
                      <span key={i} className="w-[3px] rounded-sm bg-marker" style={{ height: `${b}px` }} />
                    ))}
                  </span>
                  <span className="hand text-[0.95rem] truncate">{l.hint}</span>
                </>
              ) : (
                <span className="text-ink-2 text-sm">{l.state}</span>
              )}
            </span>
            <span className={`mono text-xs ${l.state === "connected" ? "text-marker" : "text-ink-3"}`}>{l.state === "connected" ? "live" : ""}</span>
          </li>
        ))}
      </ul>
      <div className="hairline my-4" />
      <div className="flex gap-8">
        <div>
          <span className="numeral text-3xl block">{stats.dials}</span>
          <span className="text-xs text-ink-2">dials</span>
        </div>
        <div>
          <span className="numeral text-3xl block">{stats.connects}</span>
          <span className="text-xs text-ink-2">connected</span>
        </div>
        <div>
          <span className="numeral text-3xl block">{rate}%</span>
          <span className="text-xs text-ink-2">connect rate</span>
        </div>
      </div>
    </div>
  );
}
