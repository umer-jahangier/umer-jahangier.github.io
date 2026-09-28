"use client";
import { useEffect, useState } from "react";

export type Tier = "off" | "low" | "high";

/** Decide once how much of the chamber this device can carry. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) as WebGL2RenderingContext | null;
    if (!gl) return "off";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const weak = /swiftshader|llvmpipe|software/i.test(renderer);
    if (weak) return "off";
    if (small || cores <= 4 || mem <= 4) return "low";
    return "high";
  } catch {
    return "off";
  }
}

export function useTier() {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => {
    setTier(detectTier());
  }, []);
  return tier;
}
