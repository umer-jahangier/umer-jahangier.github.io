import type { Metadata } from "next";
import Close from "@/components/sections/Close";
import Guestbook from "@/components/sections/Guestbook";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email Muhammad Umer about AI or full-stack engineering roles, or to have an AI agent, SaaS product or tool built.",
};

export default function ContactPage() {
  return (
    <>
      <section className="gutter pt-28 md:pt-36 pb-[2vh]">
        <p className="hand text-[1.2rem]">One email is enough</p>
        <h1 className="display text-[clamp(2.8rem,7vw,7rem)] mt-2 max-w-[10ch]">Contact.</h1>
        <div className="prose-board mt-8">
          <p>Tell me what you are building, where it hurts, and when you need it. I reply within a day, in US or European hours.</p>
          <p>
            <strong>Roles:</strong> remote positions in the US and EU, and on-site roles in Italy, Germany, Switzerland and France. <strong>Products:</strong> AI agents, voice AI, SaaS platforms, internal tools, and web, mobile or desktop apps. <strong>Research:</strong> I am pursuing an MSc in AI in Europe and welcome collaborations on reinforcement learning and agentic systems.
          </p>
        </div>
      </section>
      <Guestbook />
      <Close heading="Say hello." />
    </>
  );
}
