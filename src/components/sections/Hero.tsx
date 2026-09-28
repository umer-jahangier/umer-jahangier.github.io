"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Slab";
import { useHeat } from "@/components/motion/useHeat";
import { IconDownload, IconMail } from "@/components/ui/Icons";
import { hero, site } from "@/content/profile";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const name = useHeat<HTMLHeadingElement>(0.28);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-line", { y: 24, opacity: 0, duration: 1.1, delay: 0.15 })
        .from(".hero-name > span", { yPercent: 110, duration: 1.3, stagger: 0.08 }, "-=0.8")
        .from(".hero-actions > *", { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.9")
        .from(".hero-cue", { opacity: 0, duration: 1 }, "-=0.5");
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative min-h-[100dvh] flex flex-col justify-end pb-[max(6vh,40px)] pt-28 gutter" aria-labelledby="hero-name">
      <p className="hero-line prose-chamber max-w-[52ch] mb-[3vh] text-ash">
        <span className="text-bone">{hero.line}</span>
      </p>
      <h1 id="hero-name" ref={name} className="hero-name heat-text display leading-[0.82] text-[clamp(4.25rem,17.5vw,19rem)] tracking-[-0.02em] -ml-[0.04em]">
        <span className="block overflow-hidden">
          <span className="block">Muhammad</span>
        </span>
        <span className="block overflow-hidden">
          <span className="block">Umer</span>
        </span>
      </h1>
      <div className="hero-actions mt-[4vh] flex flex-wrap items-center gap-3">
        <Button href={`mailto:${site.email}`} primary>
          <IconMail /> Email me
        </Button>
        <Button href={site.cv} download>
          <IconDownload /> Download CV
        </Button>
      </div>
      <div className="hero-cue absolute right-[var(--gutter)] bottom-[max(6vh,40px)] hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-ash" aria-hidden>
        <span>Descend</span>
        <span className="relative block h-10 w-px overflow-hidden bg-basalt-2">
          <span className="descend-bar absolute inset-x-0 top-0 h-1/2 bg-magma-2" />
        </span>
      </div>
    </section>
  );
}
