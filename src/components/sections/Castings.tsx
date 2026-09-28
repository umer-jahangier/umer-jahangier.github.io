"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/motion/Transition";
import { useHeat } from "@/components/motion/useHeat";
import { HeatHeading } from "@/components/ui/Slab";
import { IconOut } from "@/components/ui/Icons";
import type { Project } from "@/content/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** One casting: a product cast in cooled rock. Shares exact scale with every other casting. */
function Casting({ p, wide }: { p: Project; wide: boolean }) {
  const ref = useHeat<HTMLAnchorElement>(0.06);
  return (
    <li className={`casting cooling ${wide ? "col-span-10 lg:col-span-6" : "col-span-10 lg:col-span-4"}`} style={{ "--cool": 0 } as React.CSSProperties}>
      <TransitionLink href={`/work/${p.slug}/`} className="group block h-full">
        <article ref={ref as never} className="slab relative h-full p-6 md:p-8 flex flex-col gap-8 overflow-hidden">
          <span className="fissure absolute inset-x-0 top-0 h-px" aria-hidden />
          <header className="flex items-start justify-between gap-6">
            <h3 className="display text-[clamp(2.4rem,5vw,4.6rem)] heat-text leading-[0.86]">{p.name}</h3>
            <span className="mt-2 shrink-0 text-ash transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-core">
              <IconOut size={26} />
            </span>
          </header>
          <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.5] text-ash">{p.kicker}</p>
          <div className="mt-auto flex flex-wrap items-end gap-x-8 gap-y-4">
            {p.numbers.slice(0, 3).map((n) => (
              <div key={n.label} className="min-w-[7ch]">
                <span className="numeral block text-[clamp(2.2rem,4vw,3.6rem)]">{n.value}</span>
                <span className="block text-xs mt-1 text-ash-2">{n.label}</span>
              </div>
            ))}
            <span className="ml-auto text-xs text-ash-2 text-right">
              {p.role}
              <br />
              {p.org} · {p.period}
            </span>
          </div>
        </article>
      </TransitionLink>
    </li>
  );
}

export default function Castings({ projects, heading = "Cast in production", intro }: { projects: Project[]; heading?: string; intro?: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".casting", { "--cool": 1 });
        return;
      }
      gsap.utils.toArray<HTMLElement>(".casting").forEach((el) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
          .from(el, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out" }, 0)
          .fromTo(el, { "--cool": 0 }, { "--cool": 1, duration: 2.6, ease: "power2.inOut" }, 0.3);
      });
    },
    { scope: root, dependencies: [projects] },
  );
  // The measured grid: 6/4 then 4/6, so the page has rhythm, not a uniform grid.
  return (
    <section ref={root} className="relative gutter py-[12vh]" aria-labelledby="castings-heading">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-[6vh]">
        <HeatHeading className="text-[clamp(2.75rem,7vw,7rem)] max-w-[12ch]">
          <span id="castings-heading">{heading}</span>
        </HeatHeading>
        {intro && <p className="prose-chamber max-w-[40ch] text-ash">{intro}</p>}
      </div>
      <ul className="measured gap-y-6">
        {projects.map((p, i) => (
          <Casting key={p.slug} p={p} wide={i % 4 === 0 || i % 4 === 3} />
        ))}
      </ul>
    </section>
  );
}
