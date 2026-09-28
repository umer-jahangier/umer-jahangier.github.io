"use client";
import Sketch from "@/components/board/Sketch";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";
import type { Project } from "@/content/projects";

/** Every project on one board. Hover to peek at its drawing; open to see how it is built. */
export default function WorkBoard({ projects }: { projects: Project[] }) {
  return (
    <ul className="measured gap-y-6">
      {projects.map((p, i) => (
        <li key={p.slug} className={`${i % 5 === 0 ? "col-span-12 lg:col-span-7" : i % 5 === 1 ? "col-span-12 lg:col-span-5" : "col-span-12 md:col-span-6 lg:col-span-4"}`}>
          <TransitionLink href={`/work/${p.slug}/`} className="peek panel block h-full p-6 group">
            <div className="flex items-start justify-between gap-4">
              <h3 className="display-md text-[clamp(1.7rem,2.6vw,2.4rem)]">{p.name}</h3>
              <span className="text-ink-2 mt-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-marker">
                <IconNext size={22} />
              </span>
            </div>
            <p className="mt-2 text-ink-2 text-[0.9375rem] leading-[1.5]">{p.kicker}</p>
            <div className="peek-strip mt-4">
              <Sketch def={p.sketch} className="max-h-[150px]" title={`${p.name} system sketch`} eager />
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
              <div className="flex gap-6">
                {p.numbers.slice(0, 2).map((n) => (
                  <div key={n.label}>
                    <span className="numeral text-2xl text-marker block">{n.value}</span>
                    <span className="text-[0.7rem] text-ink-2">{n.label}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-ink-3 text-right">
                {p.role}
                <br />
                {p.org} · {p.period}
              </span>
            </div>
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}
