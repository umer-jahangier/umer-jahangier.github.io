"use client";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/motion/Transition";
import { useHeat } from "@/components/motion/useHeat";
import { site } from "@/content/profile";

const links = [
  { href: "/work/", label: "Work" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const ref = useHeat<HTMLAnchorElement>(active ? 0.35 : 0);
  return (
    <TransitionLink href={href} className="ember-link text-[0.9375rem] font-medium tracking-[0.01em]" aria-current={active ? "page" : undefined}>
      <span ref={ref} className="heat-text inline-block">{label}</span>
    </TransitionLink>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const mark = useHeat<HTMLSpanElement>(0.15);
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-[72px] nav-scrim">
      <div className="gutter flex h-full items-center justify-between">
        <TransitionLink href="/" aria-label={`${site.name}, home`} className="flex items-center gap-3">
          <span ref={mark} className="heat-text inline-flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden className="shrink-0">
              <rect width="64" height="64" rx="4" fill="var(--basalt)" />
              <path d="M12 46V18l10 14 10-14v28M40 18v20a8 8 0 0 0 16 0V18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            </svg>
            <span className="display text-[1.05rem] tracking-[0.02em] hidden sm:inline">Muhammad Umer</span>
          </span>
        </TransitionLink>
        <nav aria-label="Primary" className="flex items-center gap-6 md:gap-9">
          {links.map((l) => (
            <NavLink key={l.href} {...l} active={pathname.startsWith(l.href)} />
          ))}
        </nav>
      </div>
    </header>
  );
}
