"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "@/content/profile";
import { HeatHeading } from "@/components/ui/Slab";
import { useHeat } from "@/components/motion/useHeat";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Layer({ t }: { t: (typeof timeline)[number] }) {
  const ref = useHeat<HTMLLIElement>(0.05);
  return (
    <li ref={ref} className="stratum cooling measured items-baseline py-8 border-t border-basalt-2" style={{ "--cool": 0 } as React.CSSProperties}>
      <span className="numeral col-span-10 md:col-span-2 text-[clamp(2rem,3.6vw,3.4rem)] heat-text">
        {t.from}
        <span className="text-ash-2">–{t.to}</span>
      </span>
      <div className="col-span-10 md:col-span-5">
        <h3 className="font-semibold text-[1.25rem] leading-tight">{t.role}</h3>
        <p className="text-ash mt-1">
          {t.org} · {t.where}
        </p>
      </div>
      <p className="col-span-10 md:col-span-3 text-ash text-[0.9375rem] leading-[1.5]">{t.note}</p>
    </li>
  );
}

/** The strata: the years as rock layers, deeper is earlier. The depth gauge pins while the layers scroll. */
export default function Strata() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".stratum", { "--cool": 1 });
        return;
      }
      gsap.utils.toArray<HTMLElement>(".stratum").forEach((el) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } })
          .from(el, { opacity: 0, x: -24, duration: 1, ease: "expo.out" }, 0)
          .fromTo(el, { "--cool": 0 }, { "--cool": 1, duration: 2.2, ease: "power2.inOut" }, 0.2);
      });
      const gauge = root.current?.querySelector<HTMLElement>(".gauge-fill");
      const list = root.current?.querySelector<HTMLElement>(".strata-list");
      if (gauge && list && window.matchMedia("(min-width: 1024px)").matches) {
        ScrollTrigger.create({
          trigger: list,
          start: "top 60%",
          end: "bottom 60%",
          onUpdate: (self) => gsap.set(gauge, { scaleY: self.progress }),
        });
      }
    },
    { scope: root },
  );
  return (
    <section ref={root} className="relative gutter py-[12vh]" aria-labelledby="strata-heading">
      <div className="measured items-start">
        <div className="col-span-10 lg:col-span-3 lg:sticky lg:top-28 mb-10 lg:mb-0">
          <HeatHeading className="text-[clamp(2.75rem,6vw,6rem)]">
            <span id="strata-heading">Strata</span>
          </HeatHeading>
          <p className="prose-chamber text-ash mt-4 max-w-[30ch]">Deeper is earlier. Over two years of remote work for US companies, a degree, and a thesis.</p>
          <div className="mt-8 hidden lg:flex items-stretch gap-4" aria-hidden>
            <span className="relative block w-px h-40 bg-basalt-2 overflow-hidden">
              <span className="gauge-fill absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-core via-magma-2 to-ember" />
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-ash-2 self-end">depth</span>
          </div>
        </div>
        <ol className="strata-list col-span-10 lg:col-span-7 border-b border-basalt-2">
          {timeline.map((t) => (
            <Layer key={t.role + t.from} t={t} />
          ))}
        </ol>
      </div>
    </section>
  );
}
