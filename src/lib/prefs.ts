"use client";
/**
 * Visitor preferences: theme, sound, marker colour. A tiny store with
 * subscriptions so the board, toolbar and sound engine share one truth.
 */
export type Theme = "day" | "night";
export type Marker = "marker" | "rose" | "ink";

type Prefs = { theme: Theme; sound: boolean; marker: Marker };
const KEY = "umer-prefs";
let prefs: Prefs = { theme: "day", sound: false, marker: "marker" };
const subs = new Set<(p: Prefs) => void>();
let loaded = false;

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

export function loadPrefs(): Prefs {
  if (loaded || typeof window === "undefined") return prefs;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<Prefs>) : {};
    prefs = { theme: saved.theme ?? systemTheme(), sound: saved.sound ?? false, marker: saved.marker ?? "marker" };
  } catch {
    prefs = { ...prefs, theme: systemTheme() };
  }
  apply();
  return prefs;
}

function apply() {
  document.documentElement.dataset.theme = prefs.theme;
  document.documentElement.dataset.marker = prefs.marker;
}

export function getPrefs() {
  return prefs;
}

export function setPrefs(patch: Partial<Prefs>) {
  prefs = { ...prefs, ...patch };
  apply();
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* private mode */
  }
  subs.forEach((fn) => fn(prefs));
}

export function subscribePrefs(fn: (p: Prefs) => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Runs before paint so the first frame is already the right theme. */
export const themeBootScript = `(function(){try{var p=JSON.parse(localStorage.getItem("${KEY}")||"{}");var t=p.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"night":"day");document.documentElement.dataset.theme=t;document.documentElement.dataset.marker=p.marker||"marker";}catch(e){document.documentElement.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"night":"day";}})();`;

export function markerColor(m: Marker = prefs.marker) {
  const cs = getComputedStyle(document.documentElement);
  if (m === "rose") return cs.getPropertyValue("--rose").trim();
  if (m === "ink") return cs.getPropertyValue("--ink").trim();
  return cs.getPropertyValue("--marker").trim();
}
