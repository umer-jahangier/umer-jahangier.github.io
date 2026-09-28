import type { Metadata } from "next";
import Close from "@/components/sections/Close";
import Note from "@/components/board/Note";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";
import { cta, process, services } from "@/content/profile";

export const metadata: Metadata = {
  title: "Services",
  description: "What Muhammad Umer builds for clients: AI agents and assistants, real-time voice AI, multi-tenant SaaS platforms, internal tools and automations, and web, mobile and desktop apps, each backed by a system already in production.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="gutter pt-28 md:pt-36">
        <div className="measured gap-y-10 items-end">
          <div className="col-span-12 lg:col-span-7">
            <h1 className="display text-[clamp(2.8rem,7vw,7rem)] mt-2 max-w-[12ch]">What I can build for you.</h1>
            <p className="lead mt-6 max-w-[46ch]">Five kinds of product, each backed by something I have already shipped and run. You get working software every week, tests and CI from the first one, and you own the code.</p>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9" data-no-draw>
            <Note href={cta.build.href} title={cta.build.title} sub={cta.build.sub} rose tilt={1.4} />
          </div>
        </div>
      </section>

      <section className="gutter py-[10vh]" aria-label="Services">
        <ul className="ruled">
          {services.map((s) => (
            <li key={s.id} className="measured gap-y-4 items-start !py-7">
              <div className="col-span-12 md:col-span-5">
                <h2 className="display-md text-[clamp(1.5rem,2.6vw,2.2rem)]">{s.title}</h2>
                <p className="mt-3 text-ink-2 leading-[1.55]">{s.what}</p>
              </div>
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                <p className="text-[0.9375rem] leading-[1.55]">
                  <span className="hand text-[1.05rem]">In production: </span>
                  {s.proof}
                </p>
                <TransitionLink href={`/work/${s.slug}/`} className="ink-link mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                  See the build <IconNext size={14} />
                </TransitionLink>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="gutter py-[8vh]" aria-labelledby="process-heading">
        <h2 id="process-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)] max-w-[12ch]">
          How it starts.
        </h2>
        <ol className="ruled ruled-cols mt-8 lg:grid-cols-3">
          {process.map((p) => (
            <li key={p.n}>
              <span className="numeral text-5xl text-marker block">{p.n}</span>
              <h3 className="display-md text-[1.35rem] mt-3">{p.title}</h3>
              <p className="mt-2 text-ink-2 text-[0.9375rem] leading-[1.55]">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <Close heading="Tell me what you want built." />
    </>
  );
}
