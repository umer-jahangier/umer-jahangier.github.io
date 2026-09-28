"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/components/three/Chamber";
import { getHeatField } from "@/lib/heat";

gsap.registerPlugin(ScrollTrigger);

const setAmbient = (y: number) => {
  getHeatField().ambient = Math.max(0, Math.min(1, 1 - (y / Math.max(scrollState.vh, 1)) * 1.4));
};

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Lenis drives the scroll; ScrollTrigger and the chamber read from it. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollState.vh = window.innerHeight;
    const onResize = () => {
      scrollState.vh = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    if (reduce) {
      const onScroll = () => {
        scrollState.y = window.scrollY;
        setAmbient(window.scrollY);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", (e: { scroll: number; progress: number }) => {
      scrollState.y = e.scroll;
      scrollState.progress = e.progress;
      setAmbient(e.scroll);
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return null;
}
