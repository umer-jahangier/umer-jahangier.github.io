"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/content/projects";
import { HeatHeading, Button } from "@/components/ui/Slab";
import { useHeat } from "@/components/motion/useHeat";
import { TransitionLink } from "@/components/motion/Transition";
import { IconOut } from "@/components/ui/Icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ProjectView({ p, next }: { p: Project; next: Project }) {
  const root = useRef<HTMLElement>(null);
  const nextRef = useHeat<HTMLAnchorElement>(0.1);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".pv-in", { y: 26, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, delay: 0.1 });
      gsap.utils.toArray<HTMLElement>(".pv-para").forEach((el) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    },
    { scope: root },
  );
  return (
    <article ref={root} className="gutter pt-32 md:pt-40">
      <p className="pv-in text-ash text-[0.9375rem]">
        {p.role} · {p.org} · {p.period}
      </p>
      <HeatHeading as="h1" className="pv-in mt-4 text-[clamp(3rem,10vw,11rem)] max-w-[12ch]" floor={0.25}>
        {p.name}
      </HeatHeading>
      <p className="pv-in prose-chamber mt-8 max-w-[58ch] text-[clamp(1.25rem,1.1rem+0.7vw,1.7rem)] leading-[1.35]">{p.kicker}</p>

      <div className="measured mt-[8vh] gap-y-12">
        <div className="col-span-10 lg:col-span-6 prose-chamber">
          <p className="pv-in text-bone font-medium">{p.summary}</p>
          {p.body.map((para, i) => (
            <p key={i} className="pv-para text-ash">
              {para}
            </p>
          ))}
          {p.url && (
            <div className="pv-para mt-10">
              <Button href={p.url} external>
                Visit {p.url.replace(/^https?:\/\//, "")} <IconOut />
              </Button>
            </div>
          )}
        </div>
        <aside className="col-span-10 lg:col-span-3 lg:col-start-8">
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-8">
            {p.numbers.map((n) => (
              <div key={n.label} className="pv-in">
                <dt className="text-xs text-ash-2 order-2">{n.label}</dt>
                <dd className="numeral text-[clamp(2.6rem,5vw,4.4rem)] heat-text">{n.value}</dd>
              </div>
            ))}
          </dl>
          <div className="pv-in mt-10">
            <h2 className="text-xs uppercase tracking-[0.18em] text-ash-2 mb-3">Stack</h2>
            <ul className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="slab px-3 py-1.5 text-[0.8125rem] text-bone">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <TransitionLink href={`/work/${next.slug}/`} className="group block mt-[14vh] border-t border-basalt-2 pt-8">
        <span ref={nextRef as never} className="heat-text flex items-end justify-between gap-6">
          <span>
            <span className="block text-xs uppercase tracking-[0.18em] text-ash-2">Next casting</span>
            <span className="display block text-[clamp(2.4rem,6vw,6rem)] mt-2">{next.name}</span>
          </span>
          <span className="text-ash transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-core mb-3">
            <IconOut size={32} />
          </span>
        </span>
      </TransitionLink>
    </article>
  );
}
