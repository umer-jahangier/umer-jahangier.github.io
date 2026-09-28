"use client";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/motion/Eraser";
import { site } from "@/content/profile";

const links = [
  { href: "/work/", label: "Work" },
  { href: "/journey/", label: "Journey" },
  { href: "/services/", label: "Services" },
  { href: "/contact/", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-[72px] nav-scrim" data-no-draw>
      <div className="gutter flex h-full items-center justify-between">
        <TransitionLink href="/" aria-label={`${site.name}, home`} className="hand text-[1.25rem] md:text-[1.5rem] leading-none whitespace-nowrap">
          <span className="md:hidden">M. Umer</span>
          <span className="hidden md:inline">Muhammad Umer</span>
        </TransitionLink>
        <nav aria-label="Primary" className="flex items-center gap-4 md:gap-8 text-[0.875rem] md:text-[0.9375rem] font-medium">
          {links.map((l) => (
            <TransitionLink key={l.href} href={l.href} className="ink-link" aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
              {l.label}
            </TransitionLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
