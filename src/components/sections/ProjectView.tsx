"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/content/projects";
import Sketch from "@/components/board/Sketch";
import Demo from "@/components/demos";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext, IconOut } from "@/components/ui/Icons";

gsap.registerPlugin(useGSAP);

/**
 * A project, explained as an assembly: numbered steps on the left, the drawn
 * system on the right. The step in view lights its parts; the rest are ghosted.
 */
export default function ProjectView({ p, next }: { p: Project; next: Project }) {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [engaged, setEngaged] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".pv-in", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.1 });
    },
    { scope: root },
  );

  useEffect(() => {
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>(".step") ?? []);
    if (!items.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStep(Number((e.target as HTMLElement).dataset.i));
            setEngaged(true);
          }
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = engaged ? p.steps[step]?.nodes : undefined;

  return (
    <article ref={root} className="gutter pt-28 md:pt-36">
      <h1 className="pv-in display text-[clamp(2.8rem,8vw,8.5rem)] max-w-[12ch]">{p.name}</h1>
      <p className="pv-in lead mt-6 max-w-[54ch]">{p.kicker}</p>
      <p className="pv-in mt-3 text-ink-2">
        {p.role} · {p.org} · {p.period}
        {p.url && (
          <>
            {" · "}
            <a href={p.url} className="ink-link inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer">
              {p.url.replace(/^https?:\/\//, "")} <IconOut size={14} />
            </a>
          </>
        )}
      </p>

      <dl className="pv-in mt-10 flex flex-wrap gap-x-10 gap-y-5">
        {p.numbers.map((n) => (
          <div key={n.label}>
            <dd className="numeral text-[clamp(2.4rem,4.5vw,4rem)] text-marker">{n.value}</dd>
            <dt className="text-sm text-ink-2 mt-1">{n.label}</dt>
          </div>
        ))}
      </dl>

      {p.demo && (
        <div className="pv-in mt-14">
          <Demo p={p} />
        </div>
      )}

      <section className="mt-[12vh]" aria-labelledby="how-heading">
        <h2 id="how-heading" className="display-md text-[clamp(2rem,4vw,3.4rem)]">
          How it is built, step by step
        </h2>
        <div className="measured mt-8 gap-y-8 items-start">
          <ol className="col-span-12 lg:col-span-5 grid gap-y-[28vh] py-[8vh]">
            {p.steps.map((s, i) => (
              <li key={i} data-i={i} className={`step transition-opacity duration-300 ${engaged && step !== i ? "opacity-40" : ""}`}>
                <span className="hand text-[1.15rem]">Step {i + 1}</span>
                <h3 className="display-md text-[clamp(1.5rem,2.4vw,2.1rem)] mt-1">{s.title}</h3>
                <p className="mt-3 text-ink-2 text-[1.0625rem] leading-[1.55] max-w-[42ch]">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="col-span-12 lg:col-span-7 lg:sticky lg:top-24 panel p-4 md:p-6" data-no-draw>
            <Sketch def={p.sketch} current={current} ghost={engaged} title={`${p.name}: system sketch`} />
          </div>
        </div>
      </section>

      <section className="measured mt-[10vh] gap-y-10" aria-labelledby="detail-heading">
        <div className="col-span-12 lg:col-span-7 prose-board">
          <h2 id="detail-heading" className="display-md text-[clamp(1.8rem,3.4vw,2.8rem)] text-ink mb-6">
            In detail
          </h2>
          <p className="text-ink font-medium">{p.summary}</p>
          {p.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
          <h2 className="display-md text-[1.3rem] mb-3">Stack</h2>
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="panel px-3 py-1.5 text-[0.8125rem]">
                {s}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <TransitionLink href={`/work/${next.slug}/`} className="group block mt-[12vh] pt-8 border-t-[1.5px] border-[var(--line)]">
        <span className="flex items-end justify-between gap-6">
          <span className="display text-[clamp(2rem,5vw,4.8rem)]">
            <span className="text-ink-2">Next: </span>
            {next.name}
          </span>
          <span className="text-ink-2 mb-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-marker">
            <IconNext size={30} />
          </span>
        </span>
      </TransitionLink>
    </article>
  );
}
