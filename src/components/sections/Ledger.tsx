"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ledger } from "@/content/profile";
import { HeatHeading } from "@/components/ui/Slab";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const fmt = new Intl.NumberFormat("en-GB");

/**
 * The ledger: one seam of numerals running down the rock. Each row is a
 * fissure; as the visitor descends past it, the numeral heats, counts up
 * from zero, and the fissure light travels along the row.
 */
export default function Ledger() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rows = gsap.utils.toArray<HTMLElement>(".ledger-row");
      rows.forEach((row) => {
        const num = row.querySelector<HTMLElement>(".ledger-num");
        const target = Number(num?.dataset.value ?? 0);
        if (!num) return;
        if (reduce) {
          num.textContent = fmt.format(target);
          row.style.setProperty("--cool", "1");
          return;
        }
        const obj = { v: 0 };
        gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } })
          .to(obj, { v: target, duration: 1.6, ease: "expo.out", onUpdate: () => (num.textContent = fmt.format(Math.round(obj.v))) }, 0)
          .fromTo(row, { "--cool": 0 }, { "--cool": 1, duration: 2.2, ease: "power2.inOut" }, 0.4)
          .fromTo(row.querySelector(".fissure"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.out" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative gutter py-[14vh]" aria-labelledby="ledger-heading">
      <HeatHeading className="text-[clamp(2.75rem,7vw,7rem)] max-w-[14ch] mb-[8vh]">
        <span id="ledger-heading">Production, counted</span>
      </HeatHeading>
      <ol className="measured gap-y-[6vh]">
        {ledger.map((row, i) => (
          <li key={i} className="ledger-row cooling col-span-10 grid grid-cols-subgrid items-end" style={{ "--cool": 0 } as React.CSSProperties}>
            <div className="col-span-10 md:col-span-4 lg:col-span-3">
              <span className="ledger-num numeral block text-[clamp(4rem,11vw,11rem)] leading-[0.85]" data-value={row.value} aria-label={fmt.format(row.value)}>
                0
              </span>
            </div>
            <p className="col-span-10 md:col-span-6 lg:col-span-6 lg:col-start-5 prose-chamber text-ash pb-[0.35em]">{row.label}</p>
            <span className="fissure col-span-10 mt-5 block h-px origin-left" aria-hidden />
          </li>
        ))}
      </ol>
    </section>
  );
}
