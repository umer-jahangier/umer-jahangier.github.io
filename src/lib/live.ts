"use client";
/**
 * The shared board. Strokes and visitor notes live in Firebase Realtime
 * Database when a config is present and the database answers; otherwise
 * everything stays on this device. The SDK loads only in the browser, only
 * when configured, and only after a cheap reachability probe.
 *
 * Nothing here is authenticated: the database rules are the whole trust
 * boundary, so every write is shaped to satisfy them, every wait is bounded,
 * and times are aligned to the server's clock before they are stored.
 */
import type { Database } from "firebase/database";

export type LiveStroke = { id: string; cid: string; c: string; t: number; p: number[] }; // p = [x0,y0,x1,y1,...], normalised
export type LiveNote = { id: string; n: string; m: string; t: number; c: string };

const RAW = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
export const liveConfigured = !!RAW;
export const STROKE_TTL = 8000; // ms a stroke stays before fading
export const STROKE_FADE = 2200;
export const STROKE_SWEEP = STROKE_TTL + STROKE_FADE + 12000; // after this, anyone may wipe a stroke
export const WALL_TTL = 24 * 60 * 60 * 1000; // the open board keeps a drawing for a day
const WAIT = 9000; // a write not acknowledged by then is reported as failed

type Cfg = { databaseURL?: string; projectId?: string; emulator?: string; [k: string]: unknown }; // emulator = "host:port", local development only

function parseConfig(): Cfg | null {
  if (!RAW) return null;
  try {
    const cfg = JSON.parse(RAW) as Cfg;
    if (!cfg.databaseURL && cfg.projectId) cfg.databaseURL = `https://${cfg.projectId}-default-rtdb.firebaseio.com`;
    return cfg;
  } catch {
    return null;
  }
}

// Visitors' clocks drift; the rules judge by the server's. The SDK reports the
// difference once connected, and every stored time goes through here.
let offset = 0;
export const serverNow = () => Date.now() + offset;

let dbPromise: Promise<Database | null> | null = null;

/** Resolves to the database, or null when unconfigured or unreachable. Cached per page. */
async function db() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = (async () => {
      const cfg = parseConfig();
      if (!cfg?.databaseURL) return null;
      try {
        const emu = typeof cfg.emulator === "string" ? cfg.emulator : null;
        const ns = new URL(cfg.databaseURL).hostname.split(".")[0];
        // Reachability: a missing database answers 404; a locked one answers 401, which still proves it exists.
        const ctrl = new AbortController();
        const timer = window.setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(emu ? `http://${emu}/notes.json?ns=${ns}&shallow=true` : `${cfg.databaseURL}/notes.json?shallow=true`, { signal: ctrl.signal });
        window.clearTimeout(timer);
        if (res.status === 404) return null;
        const [{ initializeApp, getApps }, { getDatabase, ref, onValue, connectDatabaseEmulator }] = await Promise.all([import("firebase/app"), import("firebase/database")]);
        const app = getApps()[0] ?? initializeApp(cfg);
        const database = getDatabase(app, cfg.databaseURL);
        if (emu) connectDatabaseEmulator(database, emu.split(":")[0], Number(emu.split(":")[1]));
        onValue(ref(database, ".info/serverTimeOffset"), (s) => {
          const v = s.val();
          offset = typeof v === "number" ? v : 0;
        });
        return database;
      } catch (e) {
        console.warn("Shared board unavailable:", e);
        return null;
      }
    })();
  }
  return dbPromise;
}

/** True when the shared board can be used on this page. */
export async function liveReady() {
  return (await db()) !== null;
}

/** The SDK retries a write forever when the realtime channel is down; the visitor should not wait that long. */
const bounded = <T,>(p: Promise<T>) =>
  new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), WAIT);
    p.then(
      (v) => {
        window.clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(timer);
        reject(e);
      },
    );
  });
const isTimeout = (e: unknown) => e instanceof Error && e.message === "timeout";

export const clientId = (() => {
  if (typeof window === "undefined") return "ssr";
  try {
    const k = "umer-cid";
    let v = sessionStorage.getItem(k);
    if (!v) {
      v = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(k, v);
    }
    return v;
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
})();

/* ── Passing strokes: everywhere on the site, gone in seconds ─────────── */

export async function publishStroke(s: Omit<LiveStroke, "id">) {
  const d = await db();
  if (!d) return;
  try {
    const { ref, push, set, remove } = await import("firebase/database");
    const r = push(ref(d, "strokes"));
    await bounded(set(r, s));
    // The writer wipes its own stroke once it has faded everywhere; the rules let any reader do it later.
    window.setTimeout(() => remove(r).catch(() => {}), STROKE_SWEEP);
  } catch {
    /* a refused write is not worth interrupting the visitor for */
  }
}

export async function subscribeStrokes(onStroke: (s: LiveStroke) => void) {
  const d = await db();
  if (!d) return () => {};
  const { ref, query, orderByChild, limitToLast, onChildAdded, remove } = await import("firebase/database");
  const q = query(ref(d, "strokes"), orderByChild("t"), limitToLast(60));
  return onChildAdded(
    q,
    (snap) => {
      const v = snap.val() as Partial<LiveStroke> | null;
      const age = typeof v?.t === "number" ? serverNow() - v.t : Infinity;
      const wellFormed = !!v && Array.isArray(v.p) && typeof v.t === "number" && typeof v.c === "string";
      if (!wellFormed || age > STROKE_SWEEP) {
        // Left behind by a closed tab, or not something this site wrote: any reader may
        // wipe it once the rules allow (20 s after its timestamp).
        const wait = Math.max(0, 20500 - age);
        window.setTimeout(() => remove(snap.ref).catch(() => {}), Number.isFinite(wait) ? wait : 0);
        return;
      }
      if (v.cid === clientId || age > STROKE_TTL + STROKE_FADE) return;
      onStroke({ id: snap.key ?? "", cid: v.cid ?? "", c: v.c!, t: v.t!, p: v.p! });
    },
    () => {},
  );
}

/* ── Notes: pinned until whoever pinned one takes it down ─────────────── */

// A note's removal key never leaves this browser; the database keeps a copy
// nobody can read, and the rules compare the two when the note comes down.
const KEYS = "umer-note-keys";
function readKeys(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(KEYS) || "{}") as unknown;
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}
function writeKeys(k: Record<string, string>) {
  try {
    localStorage.setItem(KEYS, JSON.stringify(k));
  } catch {
    /* no storage: the note simply cannot be taken down later */
  }
}
const newKey = () => {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
};

/** Ids of the notes this browser pinned and can still take down. */
export function myNoteIds() {
  return new Set(Object.keys(readKeys()));
}

/** Pins a note. Returns its id, or null when the board refused or did not answer. */
export async function publishNote(n: Omit<LiveNote, "id" | "t">): Promise<string | null> {
  const d = await db();
  if (!d) return null;
  try {
    const { ref, push, set, update, serverTimestamp } = await import("firebase/database");
    const r = push(ref(d, "notes"));
    const id = r.key ?? "";
    const note = { m: n.m, c: n.c, ...(n.n ? { n: n.n } : {}), t: serverTimestamp() };
    const key = newKey();
    try {
      // The note and its removal key land together, so a pinned note can always come down again.
      await bounded(update(ref(d), { [`notes/${id}`]: note, [`noteKeys/${id}`]: key }));
      writeKeys({ ...readKeys(), [id]: key });
    } catch (e) {
      if (isTimeout(e)) throw e;
      // Rules published before removal keys existed refuse the pair; the note alone still pins.
      await bounded(set(r, note));
    }
    return id;
  } catch {
    return null;
  }
}

/** Takes down a note this browser pinned: prove the key, remove the note, then tidy up. */
export async function removeNote(id: string) {
  const key = readKeys()[id];
  if (!key) return false;
  const d = await db();
  if (!d) return false;
  try {
    const { ref, set, remove, update } = await import("firebase/database");
    await bounded(set(ref(d, `noteProofs/${id}`), key));
    await bounded(remove(ref(d, `notes/${id}`)));
    const rest = readKeys();
    delete rest[id];
    writeKeys(rest);
    bounded(update(ref(d), { [`noteProofs/${id}`]: null, [`noteKeys/${id}`]: null })).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export async function subscribeNotes(onNotes: (n: LiveNote[]) => void) {
  const d = await db();
  if (!d) return () => {};
  const { ref, query, orderByChild, limitToLast, onValue } = await import("firebase/database");
  const q = query(ref(d, "notes"), orderByChild("t"), limitToLast(60));
  return onValue(
    q,
    (snap) => {
      const out: LiveNote[] = [];
      snap.forEach((c) => {
        const v = c.val() as Partial<LiveNote> | null;
        if (v && typeof v.m === "string") out.push({ id: c.key ?? "", n: typeof v.n === "string" ? v.n : "", m: v.m, t: typeof v.t === "number" ? v.t : 0, c: typeof v.c === "string" ? v.c : "marker" });
      });
      onNotes(out.reverse());
    },
    () => {},
  );
}

/* ── The open board: a drawing stays a day ────────────────────────────── */

/** Returns the stored key, or null when the board refused or did not answer. */
export async function publishWall(s: Omit<LiveStroke, "id">) {
  const d = await db();
  if (!d) return null;
  try {
    const { ref, push, set } = await import("firebase/database");
    const r = push(ref(d, "wall"));
    await bounded(set(r, { c: s.c, t: s.t, p: s.p }));
    return r.key;
  } catch {
    return null;
  }
}

/** Undo: a wall stroke may be removed within a minute of being drawn (the rules enforce the window). */
export async function removeWall(id: string) {
  const d = await db();
  if (!d) return false;
  try {
    const { ref, remove } = await import("firebase/database");
    await bounded(remove(ref(d, `wall/${id}`)));
    return true;
  } catch {
    return false;
  }
}

export async function subscribeWall(onAdd: (s: LiveStroke) => void, onRemove: (id: string) => void) {
  const d = await db();
  if (!d) return () => {};
  const { ref, query, orderByChild, limitToLast, onChildAdded, onChildRemoved, remove } = await import("firebase/database");
  const q = query(ref(d, "wall"), orderByChild("t"), limitToLast(400));
  const a = onChildAdded(
    q,
    (snap) => {
      const v = snap.val() as Partial<LiveStroke> | null;
      if (!v || !Array.isArray(v.p) || typeof v.t !== "number" || typeof v.c !== "string") return;
      if (serverNow() - v.t > WALL_TTL) {
        remove(snap.ref).catch(() => {});
        return;
      }
      onAdd({ id: snap.key ?? "", cid: "", c: v.c, t: v.t, p: v.p });
    },
    () => {},
  );
  const b = onChildRemoved(q, (snap) => onRemove(snap.key ?? ""), () => {});
  return () => {
    a();
    b();
  };
}
