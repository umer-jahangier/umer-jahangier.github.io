"use client";
import type { ReactNode } from "react";
import { useHeat } from "@/components/motion/useHeat";
import { TransitionLink } from "@/components/motion/Transition";

/** A heat-bound container: cooled rock that glows along its top fissure. */
export function Slab({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "article" | "section" | "li" }) {
  const ref = useHeat<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={`slab ${className}`}>
      {children}
    </Tag>
  );
}

export function Button({
  href,
  children,
  primary = false,
  download = false,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  download?: boolean;
  external?: boolean;
  className?: string;
}) {
  const ref = useHeat<HTMLAnchorElement>();
  const cls = `btn ${primary ? "btn-primary" : ""} ${className}`;
  if (external || download || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a ref={ref} href={href} className={cls} download={download || undefined} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={cls}>
      <span ref={ref as never} className="contents">{children}</span>
    </TransitionLink>
  );
}

export function HeatHeading({ children, className = "", as: Tag = "h2", floor = 0.12 }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3"; floor?: number }) {
  const ref = useHeat<HTMLHeadingElement>(floor);
  return (
    <Tag ref={ref as never} className={`heat-text display ${className}`}>
      {children}
    </Tag>
  );
}
