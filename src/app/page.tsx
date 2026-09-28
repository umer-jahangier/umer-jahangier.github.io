import Intro from "@/components/sections/Intro";
import Tally from "@/components/sections/Tally";
import Act from "@/components/sections/Act";
import Close from "@/components/sections/Close";
import Guestbook from "@/components/sections/Guestbook";
import Note from "@/components/board/Note";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";
import { featuredProjects, getProject, projects } from "@/content/projects";
import { services, site, timeline } from "@/content/profile";

export default function Home() {
  const acts = [...featuredProjects, getProject("drone-navigation")!];
  const rest = projects.filter((p) => !acts.includes(p));
  return (
    <>
      <Intro />
      <p className="sr-only">
        {site.name} is an AI and full-stack software engineer in Lahore, Pakistan, working remotely for US companies. Sole engineer of AlphaVenue.ai and primary engineer of LogicOne Dialer; technical lead of RestaurantOS; BS Computer Science, COMSATS, CGPA 3.68. Available for roles and for building AI agents, SaaS products and tools. Contact: {site.email}.
      </p>
      <Tally />
      {acts.map((p, i) => (
        <Act key={p.slug} p={p} index={i + 1} flip={i % 2 === 1} />
      ))}

      <section className="gutter py-[10vh]" aria-labelledby="more-heading">
        <h2 id="more-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)] max-w-[16ch]">
          Also on the board.
        </h2>
        <ul className="ruled mt-8">
          {rest.map((p) => (
            <li key={p.slug} className="!p-0">
              <TransitionLink href={`/work/${p.slug}/`} className="group measured items-baseline gap-y-2 px-5 py-5 hover:bg-[var(--marker-soft)] transition-colors">
                <h3 className="display-md text-[1.35rem] col-span-12 md:col-span-4">{p.name}</h3>
                <p className="text-sm text-ink-2 leading-[1.5] col-span-12 md:col-span-6">{p.kicker}</p>
                <span className="col-span-12 md:col-span-2 md:justify-self-end inline-flex items-center gap-1.5 text-sm font-semibold text-marker group-hover:translate-x-1 transition-transform">
                  How it is built <IconNext size={16} />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <TransitionLink href="/work/" className="btn mt-8">
          All nine, on one board <IconNext />
        </TransitionLink>
      </section>

      <section className="gutter py-[10vh]" aria-labelledby="clients-heading">
        <div className="measured gap-y-8 items-end">
          <div className="col-span-12 lg:col-span-6">
            <h2 id="clients-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)] max-w-[14ch]">
              What I can build for you.
            </h2>
            <p className="lead mt-5 max-w-[40ch]">Each of these is something already running in production, not a promise.</p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8" data-no-draw>
            <Note href="/services/" title="Build with me" sub="How an engagement starts, and what you get." rose tilt={1.2} />
          </div>
        </div>
        <ul className="ruled ruled-cols mt-10 lg:grid-cols-5">
          {services.map((s) => (
            <li key={s.id}>
              <h3 className="display-md text-[1.2rem]">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-2 leading-[1.5]">{s.what}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="gutter py-[10vh]" aria-labelledby="journey-heading">
        <h2 id="journey-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)] max-w-[14ch]">
          The journey so far.
        </h2>
        <ol className="mt-8 grid gap-3">
          {timeline.slice(0, 4).map((t) => (
            <li key={t.role + t.from} className="measured items-baseline py-4 border-t-[1.5px] border-[var(--line)]">
              <span className="mono col-span-12 md:col-span-3 text-sm text-ink-2">
                {t.from} – {t.to}
              </span>
              <span className="col-span-12 md:col-span-5 font-semibold">{t.role}</span>
              <span className="col-span-12 md:col-span-4 text-sm text-ink-2">{t.org}</span>
            </li>
          ))}
        </ol>
        <TransitionLink href="/journey/" className="btn mt-8">
          The whole journey, education and skills <IconNext />
        </TransitionLink>
      </section>

      <Guestbook />
      <Close />
    </>
  );
}
