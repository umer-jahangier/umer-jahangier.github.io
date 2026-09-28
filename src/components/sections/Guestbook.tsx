"use client";
import { useEffect, useState, type FormEvent } from "react";
import { liveReady, myNoteIds, publishNote, removeNote, subscribeNotes, type LiveNote } from "@/lib/live";
import { getPrefs } from "@/lib/prefs";
import { sound } from "@/lib/sound";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";

const MAX = 240;
const LOCAL_KEY = "umer-notes-local";
const tilts = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2, -2.6, 0.8];
// A note keeps its tilt for life: hash the id, not its position in the list.
const tiltOf = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return tilts[h % tilts.length];
};
const colorOf = (c: string) => (c === "rose" ? "var(--rose)" : c === "ink" ? "var(--ink)" : "var(--marker)");
const dateOf = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function readLocal(): LiveNote[] {
  try {
    const v = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]") as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .filter((n): n is Record<string, unknown> => !!n && typeof n === "object" && typeof (n as Record<string, unknown>).m === "string")
      .map((n) => ({ id: String(n.id ?? Math.random()), m: n.m as string, n: typeof n.n === "string" ? n.n : "", t: typeof n.t === "number" ? n.t : 0, c: typeof n.c === "string" ? n.c : "marker" }));
  } catch {
    return [];
  }
}
function writeLocal(notes: LiveNote[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(notes));
  } catch {
    /* no storage: the note lives until the page is left */
  }
}

/**
 * Visitors' notes, pinned to the board: a tool they like, an idea, anything.
 * Shared through the live board when configured; otherwise kept on this device.
 * A note can be taken down again from the browser that pinned it.
 */
export default function Guestbook({ withBoardLink = true }: { withBoardLink?: boolean }) {
  const [notes, setNotes] = useState<LiveNote[] | null>(null); // null until the board has answered
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "empty">("idle");
  const [live, setLive] = useState<boolean | null>(null);
  const [mine, setMine] = useState<Set<string>>(() => new Set());
  const [confirming, setConfirming] = useState<string | null>(null); // a note waiting for its second click
  const [removing, setRemoving] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let off: (() => void) | undefined;
    let alive = true;
    setMine(myNoteIds());
    liveReady().then((ok) => {
      if (!alive) return;
      setLive(ok);
      if (ok) {
        subscribeNotes((n) => alive && setNotes(n)).then((u) => (alive ? (off = u) : u()));
      } else {
        setNotes(readLocal());
      }
    });
    return () => {
      alive = false;
      off?.();
    };
  }, []);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3200);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    const m = msg.trim().slice(0, MAX);
    if (!m) {
      setState("empty");
      return;
    }
    setState("sending");
    const n = { n: name.trim().slice(0, 40), m, c: getPrefs().marker };
    try {
      // A submit before the reachability probe has answered waits for it instead of guessing.
      const ok = live ?? (await liveReady());
      if (ok) {
        const id = await publishNote(n);
        if (!id) throw new Error("unavailable");
        setMine(myNoteIds());
      } else {
        const next = [{ id: "local-" + Date.now(), t: Date.now(), ...n }, ...(notes ?? [])].slice(0, 60);
        setNotes(next);
        writeLocal(next);
      }
      setMsg("");
      setState("sent");
      sound.pop();
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  };

  const takeDown = async (id: string) => {
    if (removing) return;
    if (confirming !== id) {
      setConfirming(id);
      window.setTimeout(() => setConfirming((c) => (c === id ? null : c)), 4000);
      return;
    }
    setConfirming(null);
    setRemoving(id);
    let ok = true;
    if (live) {
      ok = await removeNote(id);
    } else {
      const next = (notes ?? []).filter((n) => n.id !== id);
      setNotes(next);
      writeLocal(next);
    }
    setRemoving(null);
    setMine(myNoteIds());
    if (ok) sound.tick();
    flash(ok ? "Your note is off the board." : "The board would not let that note go. Try again in a moment.");
  };

  const status =
    notice ||
    (state === "sending" && "Pinning your note…") ||
    (state === "sent" && "Pinned. Thank you.") ||
    (state === "empty" && "Write something first.") ||
    (state === "error" && "The board did not answer, so nothing was pinned. Try again in a moment.") ||
    (state === "idle" && live === false && "The shared board is not reachable right now, so this note stays on your device.") ||
    "";

  return (
    <section className="gutter py-[10vh]" aria-labelledby="notes-heading" data-no-draw>
      <div className="measured gap-y-10 items-start">
        <div className="col-span-12 lg:col-span-5">
          <h2 id="notes-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)] max-w-[12ch]">
            Leave a note on the board.
          </h2>
          <p className="lead mt-5 max-w-[36ch]">
            A tool you like, a technology I should look at, an idea, or just hello.{live ? " Everyone who visits can read it, and you can take yours down again from this browser." : ""}
          </p>
          <form onSubmit={submit} noValidate className="mt-8 grid gap-4 max-w-[30rem]">
            <div className="grid gap-1.5 text-sm font-medium">
              <label htmlFor="note-name" className="whitespace-nowrap">
                Your name <span className="text-ink-3 font-normal">(optional)</span>
              </label>
              <input id="note-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="field" placeholder="Ada" autoComplete="nickname" />
            </div>
            <div className="grid gap-1.5 text-sm font-medium">
              <label htmlFor="note-msg">Your note</label>
              <textarea id="note-msg" value={msg} onChange={(e) => setMsg(e.target.value.slice(0, MAX))} rows={3} maxLength={MAX} aria-describedby="note-count" className="field resize-none" placeholder="Try Pipecat with Gemini Live for…" />
              <span id="note-count" className="mono text-xs text-ink-3 justify-self-end">
                {msg.length}/{MAX}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn" aria-disabled={state === "sending"}>
                {state === "sending" ? "Pinning…" : "Pin it to the board"}
              </button>
              <span className="text-sm text-ink-2" role="status" aria-live="polite">
                {status}
              </span>
            </div>
            <p className="text-xs text-ink-3">Notes are public and stay on the board until you take yours down. Keep it kind; no contact details, please.</p>
          </form>
          {withBoardLink && (
            <TransitionLink href="/board/" className="btn mt-8">
              Or draw on the open board <IconNext />
            </TransitionLink>
          )}
        </div>
        <ul className="col-span-12 lg:col-span-7 grid sm:grid-cols-2 gap-x-6 gap-y-8 content-start">
          {notes === null && <li className="hand text-[1.2rem] text-ink-2">Fetching the board…</li>}
          {notes?.length === 0 && <li className="hand text-[1.2rem] text-ink-2">Nothing pinned yet. Yours would be the first.</li>}
          {notes?.map((n) => {
            const yours = live ? mine.has(n.id) : true;
            return (
              <li key={n.id} className="note note-wide min-w-0" style={{ "--tilt": `${tiltOf(n.id)}deg`, "--tab": colorOf(n.c) } as React.CSSProperties}>
                <span className="text-[1.0625rem] leading-[1.45] break-words">{n.m}</span>
                <span className="note-sub mt-1">
                  {n.n || "Someone"}
                  {n.t ? (
                    <>
                      {" · "}
                      <time dateTime={new Date(n.t).toISOString()}>{dateOf(n.t)}</time>
                    </>
                  ) : null}
                  {yours && (
                    <button type="button" className="note-act" data-confirm={confirming === n.id || undefined} onClick={() => takeDown(n.id)} aria-disabled={removing === n.id}>
                      {removing === n.id ? "Taking it down…" : confirming === n.id ? "Sure? Take it down" : "Take down"}
                    </button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
