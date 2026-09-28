"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/** A small ember that follows the pointer with a little lag. Hidden on touch. */
export default function HeatCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });
    const s = gsap.quickTo(el, "scale", { duration: 0.35, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest("a, button, [role=button], input, textarea, label");
      s(interactive ? 2.4 : 1);
    };
    const onDown = () => s(0.6);
    const onUp = () => s(1);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);
  return <div ref={ref} className="ember-cursor" aria-hidden />;
}
