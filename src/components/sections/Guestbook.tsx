"use client";
import { useEffect, useState, type FormEvent } from "react";
import { liveReady, publishNote, subscribeNotes, type LiveNote } from "@/lib/live";
import { getPrefs, markerColor } from "@/lib/prefs";
import { sound } from "@/lib/sound";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";

const MAX = 240;
const LOCAL_KEY = "umer-notes-local";
const tilts = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2, -2.6, 0.8];

/**
 * Visitors' notes, pinned to the board: a tool they like, an idea, anything.
 * Shared through the live board when configured; otherwise kept on this device.
 */
export default function Guestbook({ withBoardLink = true }: { withBoardLink?: boolean }) {
  const [notes, setNotes] = useState<LiveNote[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    let off: (() => void) | undefined;
    let alive = true;
    liveReady().then((ok) => {
      if (!alive) return;
      setLive(ok);
      if (ok) {
        subscribeNotes((n) => alive && setNotes(n)).then((u) => (off = u));
      } else {
        try {
          setNotes(JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"));
        } catch {
          /* empty */
        }
      }
    });
    return () => {
      alive = false;
      off?.();
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const m = msg.trim().slice(0, MAX);
    if (!m) return;
    setState("sending");
    const n = { n: name.trim().slice(0, 40), m, c: getPrefs().marker };
    try {
      if (live) {
        const ok = await publishNote(n);
        if (!ok) throw new Error("unavailable");
      } else {
        const next = [{ id: String(Date.now()), t: Date.now(), ...n }, ...notes].slice(0, 60);
        setNotes(next);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      }
      setMsg("");
      setState("sent");
      sound.pop();
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  };

  const colorOf = (c: string) => (c === "rose" ? "var(--rose)" : c === "ink" ? "var(--ink)" : "var(--marker)");

  return (
    <section className="gutter py-[10vh]" aria-labelledby="notes-heading" data-no-draw>
      <div className="measured gap-y-10 items-start">
        <div className="col-span-12 lg:col-span-5">
          <h2 id="notes-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)] max-w-[12ch]">
            Leave a note on the board.
          </h2>
          <p className="lead mt-5 max-w-[36ch]">A tool you like, a technology I should look at, an idea, or just hello.{live ? " Everyone who visits can read it." : ""}</p>
          <form onSubmit={submit} className="mt-8 grid gap-4 max-w-[30rem]">
            <label className="grid gap-1.5 text-sm font-medium">
              Your name <span className="text-ink-3 font-normal">(optional)</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="field" placeholder="Ada" autoComplete="nickname" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Your note
              <textarea value={msg} onChange={(e) => setMsg(e.target.value.slice(0, MAX))} required rows={3} maxLength={MAX} className="field resize-none" placeholder="Try Pipecat with Gemini Live for…" />
              <span className="mono text-xs text-ink-3 justify-self-end">
                {msg.length}/{MAX}
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn" disabled={state === "sending"}>
                {state === "sending" ? "Pinning…" : "Pin it to the board"}
              </button>
              <span className="text-sm text-ink-2" role="status" aria-live="polite">
                {state === "sent" && "Pinned. Thank you."}
                {state === "error" && "The board did not answer. Try again in a moment."}
                {state === "idle" && live === false && "The shared board is not reachable right now, so this note stays on your device."}
              </span>
            </div>
            <p className="text-xs text-ink-3">Notes are public and stay on the board. Keep it kind; no contact details, please.</p>
          </form>
          {withBoardLink && (
            <TransitionLink href="/board/" className="btn mt-8">
              Or draw on the open board <IconNext />
            </TransitionLink>
          )}
        </div>
        <ul className="col-span-12 lg:col-span-7 grid sm:grid-cols-2 gap-x-6 gap-y-8 content-start" aria-live="polite">
          {notes.length === 0 && <li className="hand text-[1.2rem] text-ink-2">Nothing pinned yet. Yours would be the first.</li>}
          {notes.map((n, i) => (
            <li key={n.id} className="note w-full min-w-0" style={{ "--tilt": `${tilts[i % tilts.length]}deg`, "--tab": colorOf(n.c) } as React.CSSProperties}>
              <span className="text-[1.0625rem] leading-[1.45] break-words">{n.m}</span>
              <span className="note-sub mt-1">
                {n.n || "Someone"}
                {n.t ? ` · ${new Date(n.t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
