"use client";
/**
 * The shared board. Strokes and visitor notes live in Firebase Realtime
 * Database when a config is present and the database answers; otherwise
 * everything stays on this device. The SDK loads only in the browser, only
 * when configured, and only after a cheap reachability probe.
 */
import type { Database } from "firebase/database";

export type LiveStroke = { id: string; cid: string; c: string; t: number; p: number[] }; // p = [x0,y0,x1,y1,...] normalised 0–1
export type LiveNote = { id: string; n: string; m: string; t: number; c: string };

const RAW = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
export const liveConfigured = !!RAW;
export const STROKE_TTL = 8000; // ms a stroke stays before fading
export const STROKE_FADE = 2200;

type Cfg = { databaseURL?: string; projectId?: string; [k: string]: unknown };

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

let dbPromise: Promise<Database | null> | null = null;

/** Resolves to the database, or null when unconfigured or unreachable. Cached per page. */
async function db() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = (async () => {
      const cfg = parseConfig();
      if (!cfg?.databaseURL) return null;
      try {
        // Reachability: a missing database answers 404; a locked one answers 401, which still proves it exists.
        const ctrl = new AbortController();
        const timer = window.setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(`${cfg.databaseURL}/notes.json?shallow=true&limitToLast=1`, { signal: ctrl.signal });
        window.clearTimeout(timer);
        if (res.status === 404) return null;
        const [{ initializeApp, getApps }, { getDatabase }] = await Promise.all([import("firebase/app"), import("firebase/database")]);
        const app = getApps()[0] ?? initializeApp(cfg);
        return getDatabase(app, cfg.databaseURL);
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

export async function publishStroke(s: Omit<LiveStroke, "id">) {
  const d = await db();
  if (!d) return;
  try {
    const { ref, push, set, remove } = await import("firebase/database");
    const r = push(ref(d, "strokes"));
    await set(r, s);
    // The writer cleans up its own stroke once it has faded everywhere.
    window.setTimeout(() => remove(r).catch(() => {}), STROKE_TTL + STROKE_FADE + 12000);
  } catch {
    /* a refused write is not worth interrupting the visitor for */
  }
}

export async function subscribeStrokes(onStroke: (s: LiveStroke) => void) {
  const d = await db();
  if (!d) return () => {};
  const { ref, query, limitToLast, onChildAdded } = await import("firebase/database");
  const q = query(ref(d, "strokes"), limitToLast(60));
  const unsub = onChildAdded(
    q,
    (snap) => {
      const v = snap.val() as Omit<LiveStroke, "id"> | null;
      if (!v || !Array.isArray(v.p) || typeof v.t !== "number" || typeof v.c !== "string" || v.cid === clientId) return;
      if (Date.now() - v.t > STROKE_TTL + STROKE_FADE) return;
      onStroke({ id: snap.key ?? "", ...v });
    },
    () => {},
  );
  return unsub;
}

export async function publishNote(n: Omit<LiveNote, "id" | "t">) {
  const d = await db();
  if (!d) return false;
  try {
    const { ref, push, set, serverTimestamp } = await import("firebase/database");
    const r = push(ref(d, "notes"));
    await set(r, { ...n, t: serverTimestamp() });
    return true;
  } catch {
    return false;
  }
}

export async function subscribeNotes(onNotes: (n: LiveNote[]) => void) {
  const d = await db();
  if (!d) return () => {};
  const { ref, query, limitToLast, onValue } = await import("firebase/database");
  const q = query(ref(d, "notes"), limitToLast(60));
  const unsub = onValue(
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
  return unsub;
}
