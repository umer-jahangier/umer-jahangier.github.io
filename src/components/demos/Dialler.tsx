"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";

type State = "idle" | "dialling" | "ringing" | "connected" | "voicemail" | "no answer";
type Slot = { num: string; state: State; until: number; hint: string; bars: number[]; started: number };

const HINTS = ["Ask about their current process", "Mention the free trial", "Confirm the decision maker", "Offer a demo this week", "Summarise the next steps", "Ask what they tried before"];
const mask = () => `+1 (${200 + Math.floor(Math.random() * 700)}) ··· ${String(1000 + Math.floor(Math.random() * 9000)).slice(0, 4)}`;
const blank = (): Slot => ({ num: mask(), state: "idle", until: 0, hint: "", bars: [], started: 0 });

/**
 * A predictive dialler keeps four lines busy so a rep is always on a live call.
 * Four fixed slots cycle through dialling, ringing and an outcome; connected
 * calls show the live coaching hint. A simulation with invented numbers.
 */
export default function Dialler() {
  const [slots, setSlots] = useState<Slot[]>(() => Array.from({ length: 4 }, blank));
  const [stats, setStats] = useState({ dials: 0, connects: 0, seconds: 0 });
  const { ref, inView } = useInView<HTMLDivElement>();
  const hintIdx = useRef(0);
  const ended = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSlots([
        { ...blank(), state: "connected", hint: HINTS[0], bars: [4, 8, 6, 10, 5, 7, 9, 4, 6, 8, 5, 7] },
        { ...blank(), state: "ringing" },
        { ...blank(), state: "dialling" },
        { ...blank(), state: "voicemail" },
      ]);
      setStats({ dials: 4, connects: 1, seconds: 42 });
      return;
    }
    let list: Slot[] = Array.from({ length: 4 }, (_, i) => ({ ...blank(), until: performance.now() + 300 + i * 900 }));
    let last = 0;
    let raf = 0;
    const loop = (t: number) => {
      if (t - last < 80) {
        raf = requestAnimationFrame(loop);
        return;
      }
      last = t;
      list = list.map((s) => {
        if (t < s.until) {
          if (s.state === "connected") s.bars = Array.from({ length: 12 }, () => 2 + Math.random() * 12);
          return s;
        }
        switch (s.state) {
          case "idle":
            setStats((k) => ({ ...k, dials: k.dials + 1 }));
            return { ...s, num: mask(), state: "dialling", until: t + 700 + Math.random() * 400, hint: "", bars: [] };
          case "dialling":
            return { ...s, state: "ringing", until: t + 1200 + Math.random() * 1400 };
          case "ringing": {
            const r = Math.random();
            if (r < 0.5) {
              setStats((k) => ({ ...k, connects: k.connects + 1 }));
              return { ...s, state: "connected", hint: HINTS[hintIdx.current++ % HINTS.length], until: t + 5000 + Math.random() * 3000, started: t };
            }
            return { ...s, state: r < 0.78 ? "voicemail" : "no answer", until: t + 1400 };
          }
          case "connected":
            ended.current += (t - s.started) / 1000;
            return { ...s, state: "idle", until: t + 500, bars: [] };
          default:
            return { ...s, state: "idle", until: t + 400 };
        }
      });
      const talking = list.filter((s) => s.state === "connected").reduce((a, s) => a + (t - s.started) / 1000, 0);
      setStats((k) => ({ ...k, seconds: Math.round(ended.current + talking) }));
      setSlots(list.map((s) => ({ ...s })));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const rate = stats.dials ? Math.round((stats.connects / stats.dials) * 100) : 0;
  const label = (s: State) => ({ idle: "next number", dialling: "dialling", ringing: "ringing", connected: "live", voicemail: "voicemail", "no answer": "no answer" })[s];

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="Simulation of a predictive dialler">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="hand text-[1.15rem]">Four lines, one rep always on a live call</span>
        <span className="mono text-xs text-ink-3">simulation · numbers invented</span>
      </div>
      <ol className="grid grid-cols-2 gap-2.5">
        {slots.map((s, i) => {
          const on = s.state === "connected";
          const off = s.state === "idle" || s.state === "voicemail" || s.state === "no answer";
          return (
            <li key={i} className="rounded-[8px] p-3 min-h-[92px] flex flex-col gap-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${on ? "var(--marker)" : "var(--line)"}`, background: on ? "var(--marker-soft)" : "transparent", transition: "box-shadow 300ms, background-color 300ms", opacity: off ? 0.55 : 1 }}>
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[0.8125rem]">{s.num}</span>
                <span className={`mono text-[0.6875rem] uppercase tracking-[0.06em] ${on ? "text-marker" : s.state === "ringing" || s.state === "dialling" ? "text-ink" : "text-ink-3"}`}>{label(s.state)}</span>
              </div>
              {on ? (
                <>
                  <span className="flex items-end gap-[3px] h-4" aria-hidden>
                    {s.bars.map((b, k) => (
                      <span key={k} className="w-[3px] rounded-sm bg-marker" style={{ height: `${b}px`, transition: "height 80ms linear" }} />
                    ))}
                  </span>
                  <span className="hand text-[0.95rem] leading-tight">{s.hint}</span>
                </>
              ) : (
                <span className="flex items-end gap-[3px] h-4" aria-hidden>
                  {Array.from({ length: 12 }, (_, k) => (
                    <span key={k} className="w-[3px] rounded-sm" style={{ height: "2px", background: "var(--line)" }} />
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="hairline my-4" />
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <div>
          <span className="numeral text-3xl block">{stats.dials}</span>
          <span className="text-xs text-ink-2">dials placed</span>
        </div>
        <div>
          <span className="numeral text-3xl block">{stats.connects}</span>
          <span className="text-xs text-ink-2">connected</span>
        </div>
        <div>
          <span className="numeral text-3xl block">{rate}%</span>
          <span className="text-xs text-ink-2">connect rate</span>
        </div>
        <div>
          <span className="numeral text-3xl block">{Math.floor(stats.seconds / 60)}:{String(stats.seconds % 60).padStart(2, "0")}</span>
          <span className="text-xs text-ink-2">talk time</span>
        </div>
      </div>
    </div>
  );
}
