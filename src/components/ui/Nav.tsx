"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/motion/Eraser";
import { site } from "@/content/profile";

const links = [
  { href: "/work/", label: "Work" },
  { href: "/journey/", label: "Journey" },
  { href: "/services/", label: "Services" },
  { href: "/contact/", label: "Contact" },
];

const KEY = "umer-visited";

export default function Nav() {
  const pathname = usePathname();
  const [visited, setVisited] = useState<string[]>([]);
  // Nothing disappears: a page you have seen keeps a small tick for the visit.
  useEffect(() => {
    try {
      const v = new Set<string>(JSON.parse(sessionStorage.getItem(KEY) || "[]"));
      v.add(pathname.replace(/\/?$/, "/"));
      const arr = Array.from(v);
      sessionStorage.setItem(KEY, JSON.stringify(arr));
      setVisited(arr);
    } catch {
      /* private mode */
    }
  }, [pathname]);
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-[72px] nav-scrim" data-no-draw>
      <div className="gutter flex h-full items-center justify-between">
        <TransitionLink href="/" aria-label={`${site.name}, home`} className="hand text-[1.25rem] md:text-[1.5rem] leading-none whitespace-nowrap">
          <span className="md:hidden">M. Umer</span>
          <span className="hidden md:inline">Muhammad Umer</span>
        </TransitionLink>
        <nav aria-label="Primary" className="flex items-center gap-4 md:gap-8 text-[0.875rem] md:text-[0.9375rem] font-medium">
          {links.map((l) => (
            <TransitionLink key={l.href} href={l.href} className="ink-link inline-flex items-center gap-1" aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
              {l.label}
              {visited.includes(l.href) && !pathname.startsWith(l.href) && (
                <svg width="11" height="10" viewBox="0 0 11 10" aria-hidden className="text-marker">
                  <path className="stroke" style={{ strokeWidth: 2 }} d="M1 5.5 L4 8.5 L10 1.5" />
                </svg>
              )}
            </TransitionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
