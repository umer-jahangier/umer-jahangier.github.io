"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";

type Chip = { id: number; name: string; write: boolean; x: number; born: number; gateAt: number; released: boolean; done: boolean; stamped: boolean };

const READS = ["get availability", "list bookings", "venue hours", "search docs", "get invoice", "list vendors", "read contract", "guest count"];
const WRITES = ["create booking", "send proposal", "update pricing", "issue invoice", "cancel event", "send SMS", "assign staff", "apply discount"];

const W = 640, H = 230, TRACK_Y = 118, START_X = 110, GATE_X = 318, END_X = 486, CHIP_W = 150, CHIP_H = 30, SPACING = 162;

/**
 * ELLA's tool calls travel a track from the assistant to the platform. Read
 * calls pass the gate; write calls stop at it until a person stamps them.
 * A simulation; the tool names stand for the real registry's categories.
 */
export default function ToolApproval() {
  const [chips, setChips] = useState<Chip[]>([]);
  const [counts, setCounts] = useState({ reads: 0, writes: 0 });
  const { ref, inView } = useInView<HTMLDivElement>();
  const idRef = useRef(1);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mk = (write: boolean, x: number, gateAt = 0, released = false): Chip => ({ id: idRef.current++, name: write ? WRITES[idRef.current % WRITES.length] : READS[idRef.current % READS.length], write, x, born: performance.now(), gateAt, released, done: false, stamped: released });
    if (reduce) {
      setChips([mk(false, END_X - 40, 1, true), mk(true, GATE_X, 1, false), mk(false, START_X + 60)]);
      setCounts({ reads: 12, writes: 4 });
      return;
    }
    let list: Chip[] = [];
    let last = 0, nextSpawn = 400;
    let raf = 0;
    const loop = (t: number) => {
      const dt = Math.min(50, t - (last || t));
      last = t;
      if (t > nextSpawn && list.filter((c) => !c.done).length < 4) {
        list.push(mk(Math.random() < 0.42, START_X - 20));
        nextSpawn = t + 1300 + Math.random() * 900;
      }
      // Order on the track: earlier chips are further along.
      const active = list.filter((c) => !c.done);
      active.forEach((c, i) => {
        // The first chip that has not been released owns the gate; the ones behind it queue.
        const ahead = active.slice(0, i).filter((a) => !a.released).length;
        let target = c.released ? END_X + 50 : GATE_X - ahead * SPACING;
        target = Math.min(target, c.released ? END_X + 50 : GATE_X);
        c.x += (target - c.x) * (1 - Math.pow(0.001, dt / 1000));
        if (!c.released && ahead === 0 && Math.abs(c.x - GATE_X) < 2) {
          if (!c.gateAt) c.gateAt = t;
          const hold = c.write ? 1500 + (c.id % 3) * 350 : 380;
          if (t - c.gateAt > hold) {
            c.released = true;
            c.stamped = true;
            setCounts((k) => (c.write ? { ...k, writes: k.writes + 1 } : { ...k, reads: k.reads + 1 }));
          }
        }
        if (c.x > END_X + 30) c.done = true;
      });
      list = list.filter((c) => !c.done || t - c.born < 12000);
      setChips(list.filter((c) => !c.done).map((c) => ({ ...c })));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className="panel p-4 md:p-5" data-no-draw aria-label="Simulation of ELLA's tool-approval flow">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="hand text-[1.15rem]">Every write waits for a person</span>
        <span className="mono text-xs text-ink-3">simulation · tool names illustrative</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto text-ink" role="img" aria-label="Tool calls travel from ELLA to the platform; write calls stop at a human gate until approved">
        {/* Track */}
        <line x1={START_X - 30} y1={TRACK_Y + CHIP_H / 2 + 8} x2={END_X + 66} y2={TRACK_Y + CHIP_H / 2 + 8} className="stroke" style={{ strokeWidth: 1.5, opacity: 0.35 }} />
        {/* ELLA */}
        <rect x="14" y={TRACK_Y - 12} width="84" height="54" rx="8" className="stroke" />
        <text x="56" y={TRACK_Y + 12} textAnchor="middle" fontSize="13.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">ELLA</text>
        <text x="56" y={TRACK_Y + 28} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">104 tools</text>
        {/* Gate */}
        <line x1={GATE_X + CHIP_W / 2 + 10} y1={40} x2={GATE_X + CHIP_W / 2 + 10} y2={TRACK_Y + CHIP_H + 14} className="stroke" strokeDasharray="4 5" style={{ strokeWidth: 1.5 }} />
        <g transform={`translate(${GATE_X + CHIP_W / 2 - 14} 14)`}>
          <path className="stroke" d="M24 8 a8 8 0 1 0 0.1 0 M8 44 c0 -16 32 -16 32 0" style={{ strokeWidth: 2 }} />
        </g>
        <text x={GATE_X + CHIP_W / 2 + 22} y="30" className="hand" fontSize="13" fill="var(--marker)">a person approves writes</text>
        {/* Platform */}
        <rect x={END_X + 66} y={TRACK_Y - 12} width="78" height="54" rx="8" className="stroke" />
        <text x={END_X + 105} y={TRACK_Y + 12} textAnchor="middle" fontSize="13.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">Platform</text>
        <text x={END_X + 105} y={TRACK_Y + 28} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-2)">API · workers</text>
        {/* Chips */}
        {chips.map((c) => {
          const atGate = !c.released && Math.abs(c.x - GATE_X) < 3;
          const fade = c.released ? Math.max(0, 1 - (c.x - END_X + 30) / 60) : 1;
          return (
            <g key={c.id} transform={`translate(${c.x.toFixed(1)} ${TRACK_Y})`} opacity={fade}>
              <rect width={CHIP_W} height={CHIP_H} rx="6" fill={c.write ? "var(--rose-soft)" : "var(--marker-soft)"} stroke={c.write && atGate ? "var(--rose)" : "currentColor"} strokeWidth="1.5" />
              <text x="9" y="19" fontSize="11.5" fontWeight="600" fontFamily="var(--font-text)" fill="currentColor">{c.name}</text>
              <text x={CHIP_W - 8} y="19" textAnchor="end" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--ink-2)">{c.write ? "write" : "read"}</text>
              {c.write && atGate && !c.stamped && (
                <g transform={`translate(${CHIP_W / 2 - 34} -22)`}>
                  <path className="stroke" d="M8 4 v-2 a3 3 0 0 1 6 0 v2 M5 4 h12 v8 h-12 z" style={{ strokeWidth: 1.5, stroke: "var(--rose)" }} />
                  <text x="24" y="12" fontSize="10.5" fontFamily="var(--font-text)" fill="var(--rose)">awaiting approval</text>
                </g>
              )}
              {c.write && c.stamped && (
                <g transform={`translate(${CHIP_W - 14} -12)`}>
                  <circle r="9" fill="var(--surface)" stroke="var(--marker)" strokeWidth="1.5" />
                  <path d="M-4 0 l3 3 l6 -6" fill="none" stroke="var(--marker)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </g>
          );
        })}
        {/* Counters */}
        <text x="14" y={H - 14} fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink-2)">{`reads ran on their own: ${counts.reads}`}</text>
        <text x={W - 14} y={H - 14} textAnchor="end" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink-2)">{`writes approved by a person: ${counts.writes}`}</text>
      </svg>
    </div>
  );
}
