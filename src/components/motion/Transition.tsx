"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink, { type LinkProps } from "next/link";
import gsap from "gsap";
import { getLenis } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });

/**
 * The magma surge. A molten wave rises from the bottom, holds while the route
 * changes, cools to black and sinks away, revealing the next page.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const surge = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navigate = useCallback(
    (href: string) => {
      if (busy || href === pathname) return;
      if (reduce() || !surge.current) {
        router.push(href);
        return;
      }
      setBusy(true);
      pending.current = href;
      getLenis()?.stop();
      const el = surge.current;
      el.classList.remove("cooling-phase");
      gsap
        .timeline()
        .set(el, { yPercent: 118 })
        .to(el, { yPercent: 0, duration: 0.72, ease: "power4.inOut" })
        .add(() => {
          window.scrollTo(0, 0);
          router.push(href);
        });
    },
    [busy, pathname, router],
  );

  // When the new route has rendered, cool the surge and sink it.
  useEffect(() => {
    if (!pending.current || pathname !== pending.current) return;
    pending.current = null;
    const el = surge.current;
    if (!el) return;
    getLenis()?.scrollTo(0, { immediate: true });
    gsap
      .timeline({
        onComplete: () => {
          setBusy(false);
          getLenis()?.start();
        },
      })
      .add(() => el.classList.add("cooling-phase"), "+=0.08")
      .to(el, { yPercent: -118, duration: 0.8, ease: "power4.inOut" }, "+=0.12")
      .set(el, { yPercent: 118 });
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div ref={surge} className="surge" aria-hidden />
    </TransitionCtx.Provider>
  );
}

/** A Next link that triggers the surge for internal routes. */
export function TransitionLink({ href, children, onClick, ...rest }: LinkProps & { children: ReactNode; className?: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; "aria-label"?: string }) {
  const { navigate } = useContext(TransitionCtx);
  const h = typeof href === "string" ? href : href.pathname ?? "/";
  return (
    <NextLink
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (h.startsWith("http") || h.startsWith("#") || h.startsWith("mailto:")) return;
        e.preventDefault();
        navigate(h);
      }}
    >
      {children}
    </NextLink>
  );
}
