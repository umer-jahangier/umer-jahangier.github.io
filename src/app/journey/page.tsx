import type { Metadata } from "next";
import Image from "next/image";
import Close from "@/components/sections/Close";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext, IconOut } from "@/components/ui/Icons";
import { award, certificates, languages, site, skills, thesis, timeline, volunteering } from "@/content/profile";

export const metadata: Metadata = {
  title: "Journey",
  description: "Muhammad Umer's full journey: roles at Kindwell Solutions, Logicbuilder.ai and ArchiPartnerDesign, freelance work, a BS in Computer Science (COMSATS, CGPA 3.68), a deep-RL thesis, skills, certificates, languages and awards.",
};

export default function JourneyPage() {
  return (
    <>
      <section className="gutter pt-28 md:pt-36">
        <div className="measured gap-y-10 items-end">
          <div className="col-span-12 lg:col-span-7">
            <p className="hand text-[1.2rem]">Every line of the CV</p>
            <h1 className="display text-[clamp(2.8rem,7vw,7rem)] mt-2 max-w-[12ch]">The journey.</h1>
            <div className="prose-board mt-8">
              <p>
                I am an AI and full-stack software engineer from Lahore. For over two years I have worked remotely for US companies, in US hours, shipping systems that are in production today: <strong>AlphaVenue.ai</strong>, which I engineer alone, <strong>LogicOne Dialer</strong>, where I am the primary engineer, and <strong>RestaurantOS</strong>, where I lead a team of four.
              </p>
              <p>I finished a BS in Computer Science at COMSATS University Islamabad in 2026 with a CGPA of 3.68, and I am pursuing a research-oriented Master's in AI in Europe alongside my engineering work.</p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-9">
            <div className="panel p-2 rotate-[1.2deg]">
              <Image src="/images/headshot-1200.jpg" alt="Muhammad Umer" width={1200} height={1200} priority className="block w-full aspect-square object-cover rounded-[6px]" />
            </div>
            <p className="hand text-[1.05rem] mt-3 ml-2">{site.location}</p>
          </div>
        </div>
      </section>

      <section className="gutter py-[10vh]" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="display text-[clamp(2.2rem,5vw,4.6rem)]">
          Roles and education
        </h2>
        <ol className="mt-8">
          {timeline.map((t) => (
            <li key={t.role + t.from} className="measured gap-y-3 py-7 border-t-[1.5px] border-[var(--line)] items-start">
              <span className="mono col-span-12 md:col-span-3 text-sm text-marker">
                {t.from} – {t.to}
              </span>
              <div className="col-span-12 md:col-span-5">
                <h3 className="font-semibold text-[1.15rem] leading-tight">{t.role}</h3>
                <p className="text-ink-2 mt-1 text-[0.9375rem]">
                  {t.org} · {t.where}
                </p>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="text-ink-2 text-[0.9375rem] leading-[1.5]">{t.note}</p>
                {t.slugs.length > 0 && (
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {t.slugs.map((s) => (
                      <TransitionLink key={s} href={`/work/${s}/`} className="ink-link inline-flex items-center gap-1 font-medium">
                        {s.replace(/-/g, " ")} <IconNext size={14} />
                      </TransitionLink>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="gutter py-[8vh]" aria-labelledby="thesis-heading">
        <div className="measured gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="thesis-heading" className="display text-[clamp(2rem,4vw,3.6rem)] max-w-[10ch]">
              The thesis
            </h2>
            <p className="hand text-[1.1rem] mt-3">{thesis.title}</p>
            <TransitionLink href="/work/drone-navigation/" className="btn mt-6">
              See it drawn <IconNext />
            </TransitionLink>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 prose-board">
            <p>{thesis.summary}</p>
            <p>
              <strong>My part:</strong> {thesis.mine}
            </p>
            <p className="text-sm">
              <strong>Relevant modules:</strong> {thesis.modules.join(", ")}.
            </p>
          </div>
        </div>
      </section>

      <section className="gutter py-[8vh]" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="display text-[clamp(2rem,4vw,3.6rem)] mb-8">
          What I work with
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {skills.map((g) => (
            <div key={g.group} className="panel p-5">
              <h3 className="font-semibold mb-3">{g.group}</h3>
              <ul className="text-ink-2 text-[0.9375rem] leading-[1.65]">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="gutter py-[8vh]" aria-labelledby="certs-heading">
        <div className="measured gap-y-10">
          <div className="col-span-12 md:col-span-6">
            <h2 id="certs-heading" className="display text-[clamp(1.8rem,3.4vw,3rem)]">
              Certificates
            </h2>
            <ul className="mt-5 grid gap-3">
              {certificates.map((c) => (
                <li key={c.title} className="text-[0.9375rem]">
                  <span className="font-semibold">{c.title}</span>
                  <span className="text-ink-2">
                    {" "}
                    · {c.by}
                    {c.when && ` · ${c.when}`}
                  </span>
                  {c.url && (
                    <a href={c.url} className="ink-link ml-2 inline-flex items-center gap-1 text-sm" target="_blank" rel="noopener noreferrer">
                      verify <IconOut size={13} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">Languages</h2>
            <ul className="mt-5 grid gap-2 text-[0.9375rem]">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="font-semibold">{l.name}</span> <span className="text-ink-2">· {l.level}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">Award</h2>
            <p className="mt-5 text-[0.9375rem]">
              <span className="font-semibold">{award.title}</span>
              <br />
              <span className="text-ink-2">
                {award.by} · {award.when}
              </span>
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)]">Volunteering</h2>
            <p className="mt-5 text-[0.9375rem]">
              <span className="font-semibold">
                {volunteering.role}, {volunteering.org}
              </span>
              <br />
              <span className="text-ink-2">
                {volunteering.when}. {volunteering.note}
              </span>
            </p>
          </div>
        </div>
      </section>
      <Close />
    </>
  );
}
