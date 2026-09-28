import type { Metadata } from "next";
import Close from "@/components/sections/Close";
import { HeatHeading } from "@/components/ui/Slab";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email Muhammad Umer about AI or full-stack engineering roles, freelance projects, or research collaborations.",
};

export default function ContactPage() {
  return (
    <>
      <section className="gutter pt-32 md:pt-40 pb-[4vh]">
        <HeatHeading as="h1" className="text-[clamp(3rem,10vw,11rem)]" floor={0.25}>
          Contact
        </HeatHeading>
        <div className="prose-chamber mt-8 max-w-[56ch]">
          <p>
            One email is enough. Tell me what you are building, where it hurts, and when you need it. I reply within a day, in US or European hours.
          </p>
          <p className="text-ash">
            For roles: I am open to remote positions in the US and EU and on-site roles in Italy, Germany, Switzerland and France. For research: I am pursuing an MSc in AI in Europe and welcome collaborations on reinforcement learning and agentic systems.
          </p>
        </div>
      </section>
      <Close heading="Say hello." />
    </>
  );
}
