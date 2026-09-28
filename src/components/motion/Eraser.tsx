"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink, { type LinkProps } from "next/link";
import gsap from "gsap";
import { getLenis } from "./SmoothScroll";
import { sound } from "@/lib/sound";

type Ctx = { navigate: (href: string) => void };
const EraserCtx = createContext<Ctx>({ navigate: () => {} });

/**
 * The eraser. On navigation a felt band wipes across and fully covers the
 * screen; only then does the route change. When the new page has painted,
 * the band wipes off the other way. Nothing new is ever visible early.
 */
export function EraserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const el = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current) return;
      const target = href.replace(/\/?$/, "/");
      if (target === pathname.replace(/\/?$/, "/")) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !el.current) {
        router.push(href);
        return;
      }
      busyRef.current = true;
      setBusy(true);
      pending.current = target;
      getLenis()?.stop();
      sound.swoosh();
      const e = el.current;
      e.classList.remove("reveal");
      gsap
        .timeline()
        .set(e, { "--l": "0%", "--r": "100%" })
        .to(e, { "--r": "0%", duration: 0.55, ease: "power3.inOut" })
        .add(() => {
          window.scrollTo(0, 0);
          router.push(href);
          // Safety: if the route never changes, reveal anyway.
          window.setTimeout(() => {
            if (pending.current) reveal();
          }, 2500);
        });
    },
    [pathname, router],
  );

  const reveal = useCallback(() => {
    const e = el.current;
    pending.current = null;
    if (!e) return;
    getLenis()?.scrollTo(0, { immediate: true });
    e.classList.add("reveal");
    gsap
      .timeline({
        onComplete: () => {
          busyRef.current = false;
          setBusy(false);
          getLenis()?.start();
          e.classList.remove("reveal");
          gsap.set(e, { "--l": "0%", "--r": "100%" });
        },
      })
      .to(e, { "--l": "100%", duration: 0.62, ease: "power3.inOut" }, "+=0.08");
  }, []);

  // The new route has rendered: wait two frames so it has painted, then wipe off.
  useEffect(() => {
    if (!pending.current || pathname.replace(/\/?$/, "/") !== pending.current) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => reveal());
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, reveal]);

  return (
    <EraserCtx.Provider value={{ navigate }}>
      {children}
      <div ref={el} className="eraser" aria-hidden data-busy={busy || undefined} />
    </EraserCtx.Provider>
  );
}

export function TransitionLink({ href, children, onClick, className, style, onPointerEnter, ...rest }: LinkProps & { children: ReactNode; className?: string; style?: CSSProperties; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; onPointerEnter?: () => void; "aria-label"?: string; "aria-current"?: "page" }) {
  const { navigate } = useContext(EraserCtx);
  const h = typeof href === "string" ? href : href.pathname ?? "/";
  return (
    <NextLink
      href={href}
      className={className}
      style={style}
      onPointerEnter={() => {
        sound.tick();
        onPointerEnter?.();
      }}
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
