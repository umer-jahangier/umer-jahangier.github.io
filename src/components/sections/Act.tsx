"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/content/projects";
import Demo from "@/components/demos";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** One act of the keynote: one system, its numbers, and its demo running. */
export default function Act({ p, index, flip = false }: { p: Project; index: number; flip?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".act-in", { y: 26, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="act gutter" aria-labelledby={`act-${p.slug}`}>
      <div className={`measured gap-y-10 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="col-span-12 lg:col-span-5">
          <p className="act-in hand text-[1.2rem]">Act {index}</p>
          <h2 id={`act-${p.slug}`} className="act-in display text-[clamp(2.6rem,6vw,5.6rem)] mt-2">
            {p.name}
          </h2>
          <p className="act-in lead mt-5 max-w-[36ch]">{p.kicker}</p>
          <p className="act-in mt-4 text-ink-2 max-w-[40ch]">{p.summary}</p>
          <dl className="act-in mt-7 flex flex-wrap gap-x-8 gap-y-4">
            {p.numbers.slice(0, 3).map((n) => (
              <div key={n.label}>
                <dd className="numeral text-[clamp(2rem,3.6vw,3.2rem)] text-marker">{n.value}</dd>
                <dt className="text-xs text-ink-2 mt-1">{n.label}</dt>
              </div>
            ))}
          </dl>
          <p className="act-in mt-7 text-sm text-ink-2">
            {p.role} · {p.org} · {p.period}
          </p>
          <TransitionLink href={`/work/${p.slug}/`} className="act-in btn mt-6">
            How it is built <IconNext />
          </TransitionLink>
        </div>
        <div className="col-span-12 lg:col-span-7 act-in">
          <Demo p={p} />
        </div>
      </div>
    </section>
  );
}
