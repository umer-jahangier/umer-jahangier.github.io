"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tally } from "@/content/profile";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const fmt = new Intl.NumberFormat("en-GB");

/** Production, counted: the numbers write themselves in as you arrive. */
export default function Tally() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.utils.toArray<HTMLElement>(".tally-row").forEach((row) => {
        const num = row.querySelector<HTMLElement>(".tally-num")!;
        const target = Number(num.dataset.value);
        if (reduce) {
          num.textContent = fmt.format(target);
          return;
        }
        const o = { v: 0 };
        gsap.timeline({ scrollTrigger: { trigger: row, start: "top 80%", once: true } })
          .from(row, { y: 18, opacity: 0, duration: 0.8, ease: "expo.out" }, 0)
          .to(o, { v: target, duration: 1.4, ease: "expo.out", onUpdate: () => (num.textContent = fmt.format(Math.round(o.v))) }, 0.1)
          .fromTo(row.querySelector(".tally-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out" }, 0.1);
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="gutter py-[12vh]" aria-labelledby="tally-heading">
      <h2 id="tally-heading" className="display text-[clamp(2.4rem,5.5vw,5.2rem)] max-w-[14ch]">
        Production, counted.
      </h2>
      <p className="mt-4 text-ink-2 max-w-[44ch]">The same numbers as on my CV, every one from a system that is live today.</p>
      <ol className="mt-10 grid gap-y-6">
        {tally.map((t, i) => (
          <li key={i} className="tally-row measured items-baseline">
            <span className="tally-num numeral col-span-12 md:col-span-3 text-[clamp(3.4rem,8vw,7.5rem)] text-marker" data-value={t.value} aria-label={fmt.format(t.value)}>
              0
            </span>
            <p className="col-span-12 md:col-span-7 md:col-start-5 text-ink-2 text-[1.0625rem] leading-[1.5] max-w-[52ch]">{t.label}</p>
            <span className="tally-line col-span-12 h-[1.5px] bg-[var(--line)] origin-left mt-3" aria-hidden />
          </li>
        ))}
      </ol>
    </section>
  );
}
