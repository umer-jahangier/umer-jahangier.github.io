"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Lock } from "@phosphor-icons/react/dist/ssr";
import { useInView } from "./useInView";

type Call = { id: number; name: string; write: boolean; state: "queued" | "running" | "waiting" | "approved" | "done" };

const READS = ["get availability", "list bookings", "read venue hours", "search knowledge base", "get invoice", "list vendors", "read contract", "get guest count"];
const WRITES = ["create booking", "send proposal", "update pricing", "issue invoice", "cancel event", "send SMS", "assign staff", "apply discount"];

/**
 * Simulation of ELLA's tool-approval flow. Read tools run straight through;
 * write tools stop at the gate until a person approves them. Tool names are
 * illustrative of the categories, not the real registry.
 */
export default function ToolApproval() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [counts, setCounts] = useState({ reads: 0, writes: 0 });
  const { ref, inView } = useInView<HTMLDivElement>();
  const idRef = useRef(1);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCalls([
        { id: 1, name: READS[0], write: false, state: "done" },
        { id: 2, name: WRITES[0], write: true, state: "waiting" },
        { id: 3, name: READS[3], write: false, state: "done" },
      ]);
      return;
    }
    let alive = true;
    const spawn = () => {
      if (!alive) return;
      const write = Math.random() < 0.4;
      const name = write ? WRITES[Math.floor(Math.random() * WRITES.length)] : READS[Math.floor(Math.random() * READS.length)];
      const id = idRef.current++;
      setCalls((c) => [...c.slice(-6), { id, name, write, state: "queued" }]);
      const set = (state: Call["state"]) => setCalls((c) => c.map((x) => (x.id === id ? { ...x, state } : x)));
      window.setTimeout(() => set("running"), 350);
      if (write) {
        window.setTimeout(() => set("waiting"), 900);
        window.setTimeout(() => set("approved"), 2300 + Math.random() * 900);
        window.setTimeout(() => {
          set("done");
          setCounts((k) => ({ ...k, writes: k.writes + 1 }));
        }, 3400);
      } else {
        window.setTimeout(() => {
          set("done");
          setCounts((k) => ({ ...k, reads: k.reads + 1 }));
        }, 1000 + Math.random() * 500);
      }
      window.setTimeout(spawn, 1100 + Math.random() * 900);
    };
    spawn();
    return () => {
      alive = false;
    };
  }, [inView]);

  return (
    <div ref={ref} className="panel p-5 md:p-6" data-no-draw aria-label="Simulation of the tool-approval flow">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <span className="hand text-[1.15rem]">ELLA's tool calls, simulated</span>
        <span className="mono text-xs text-ink-3">names illustrative</span>
      </div>
      <ul className="grid gap-2 min-h-[228px]" aria-live="polite">
        {calls.map((c) => (
          <li key={c.id} className="flex items-center gap-3 text-[0.9375rem]" style={{ opacity: c.state === "done" ? 0.45 : 1, transition: "opacity 400ms" }}>
            <span className={`mono text-xs px-1.5 py-0.5 rounded ${c.write ? "bg-[var(--rose-soft)] text-ink" : "bg-[var(--marker-soft)] text-ink"}`}>{c.write ? "write" : "read"}</span>
            <span className="flex-1 truncate">{c.name}</span>
            <span className="flex items-center gap-1.5 text-ink-2 text-sm min-w-[9rem] justify-end">
              {c.state === "queued" && "queued"}
              {c.state === "running" && "running"}
              {c.state === "waiting" && (
                <>
                  <Lock size={14} className="text-rose" aria-hidden /> awaiting approval
                </>
              )}
              {c.state === "approved" && (
                <>
                  <Check size={14} className="tick" aria-hidden /> human approved
                </>
              )}
              {c.state === "done" && (
                <>
                  <Check size={14} className="tick" aria-hidden /> done
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="hairline my-4" />
      <div className="flex gap-8">
        <div>
          <span className="numeral text-3xl block">{counts.reads}</span>
          <span className="text-xs text-ink-2">reads, ran on their own</span>
        </div>
        <div>
          <span className="numeral text-3xl block">{counts.writes}</span>
          <span className="text-xs text-ink-2">writes, approved by a person</span>
        </div>
      </div>
    </div>
  );
}
