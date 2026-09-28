"use client";
import { useEffect, useRef } from "react";
import { getHeatField } from "@/lib/heat";

/**
 * Bind an element to the heat field: once per frame it receives `--heat`
 * (0–1) sampled at its own screen rect. Costs one getBoundingClientRect
 * per frame per element, so use it on the few elements that should glow.
 */
export function useHeat<T extends HTMLElement>(floor = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const field = getHeatField();
    let last = -1;
    let rect: DOMRect | null = null;
    let frame = 0;
    const unsub = field.subscribe((f) => {
      // Refresh the rect every 8 frames; scrolling moves it, but not fast enough to matter.
      if (frame++ % 8 === 0) rect = el.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      const h = Math.max(floor, f.sampleRect(rect.left, rect.top, rect.width, rect.height));
      const q = Math.round(h * 100) / 100;
      if (q !== last) {
        last = q;
        el.style.setProperty("--heat", String(q));
      }
    });
    return unsub;
  }, [floor]);
  return ref;
}
