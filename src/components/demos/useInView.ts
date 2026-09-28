"use client";
import { useEffect, useRef, useState } from "react";

/** Starts a demo when it scrolls into view and pauses it when it leaves. */
export function useInView<T extends HTMLElement>(margin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin, threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}
