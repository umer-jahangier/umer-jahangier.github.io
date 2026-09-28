import type { Metadata } from "next";
import Image from "next/image";
import Strata from "@/components/sections/Strata";
import Close from "@/components/sections/Close";
import { HeatHeading, Slab } from "@/components/ui/Slab";
import { award, languages, site, skills, thesis } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Muhammad Umer: AI and full-stack engineer in Lahore working US hours, BS Computer Science (COMSATS, CGPA 3.68), thesis in deep reinforcement learning for drone navigation, pursuing a research MSc in AI in Europe.",
};

export default function AboutPage() {
  return (
    <>
      <section className="gutter pt-32 md:pt-40">
        <div className="measured gap-y-10 items-end">
          <div className="col-span-10 lg:col-span-6">
            <HeatHeading as="h1" className="text-[clamp(3rem,10vw,11rem)]" floor={0.25}>
              About
            </HeatHeading>
            <div className="prose-chamber mt-8">
              <p>
                I am an AI and full-stack software engineer from Lahore. For over two years I have worked remotely for US companies, in US hours, shipping systems that are in production today: <strong>AlphaVenue.ai</strong>, which I engineer alone, <strong>LogicOne Dialer</strong>, where I am the primary engineer, and <strong>RestaurantOS</strong>, where I lead a team of four.
              </p>
              <p>
                What I like building: LLM agents that take real actions with a human in the loop, real-time voice pipelines where every millisecond shows, and multi-tenant platforms where the data model, the policy layer and the deployment are designed together.
              </p>
              <p>
                I finished a BS in Computer Science at COMSATS University Islamabad in 2026 with a CGPA of 3.68, and I am now pursuing a research-oriented Master's in AI in Europe alongside my engineering work.
              </p>
            </div>
          </div>
          <div className="col-span-10 lg:col-span-3 lg:col-start-8">
            <Slab className="p-2 overflow-hidden">
              <Image src="/images/headshot-1200.jpg" alt="Muhammad Umer" width={1200} height={1200} priority className="block w-full aspect-square object-cover rounded-[2px]" />
            </Slab>
            <p className="mt-3 text-xs text-ash-2">{site.location}</p>
          </div>
        </div>
      </section>

      <Strata />

      <section className="gutter py-[10vh]" aria-labelledby="thesis-heading">
        <div className="measured gap-y-8">
          <div className="col-span-10 lg:col-span-4">
            <HeatHeading className="text-[clamp(2.4rem,5vw,4.6rem)] max-w-[12ch]">
              <span id="thesis-heading">The thesis</span>
            </HeatHeading>
            <p className="mt-4 text-ash">{thesis.title}. Team of three, grade A, entirely in simulation.</p>
          </div>
          <div className="col-span-10 lg:col-span-6 prose-chamber">
            <p>{thesis.summary}</p>
            <p className="text-ash">
              <strong>My part:</strong> {thesis.mine}
            </p>
          </div>
        </div>
      </section>

      <section className="gutter py-[10vh]" aria-labelledby="skills-heading">
        <HeatHeading className="text-[clamp(2.4rem,5vw,4.6rem)] mb-10">
          <span id="skills-heading">What I work with</span>
        </HeatHeading>
        <div className="measured gap-y-10">
          {skills.map((g) => (
            <div key={g.group} className="col-span-10 md:col-span-5 lg:col-span-2 lg:[&:nth-child(1)]:col-span-4">
              <h3 className="font-semibold mb-3">{g.group}</h3>
              <ul className="text-ash text-[0.9375rem] leading-[1.6]">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="measured gap-y-8 mt-[8vh] pt-10 border-t border-basalt-2">
          <div className="col-span-10 md:col-span-5">
            <h3 className="font-semibold mb-3">Languages</h3>
            <ul className="text-ash text-[0.9375rem] leading-[1.6]">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="text-bone">{l.name}</span> · {l.level}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-10 md:col-span-5">
            <h3 className="font-semibold mb-3">Award</h3>
            <p className="text-ash text-[0.9375rem] leading-[1.6]">
              <span className="text-bone">{award.title}</span>
              <br />
              {award.by} · {award.when}
            </p>
          </div>
        </div>
      </section>
      <Close />
    </>
  );
}
