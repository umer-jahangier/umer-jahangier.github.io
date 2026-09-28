import type { Metadata } from "next";
import WorkBoard from "@/components/sections/WorkBoard";
import Close from "@/components/sections/Close";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Nine systems built by Muhammad Umer: AlphaVenue.ai and ELLA, LogicOne Dialer, RestaurantOS, Elio, a deep-RL drone thesis, Terra plugins, an AI take-off pipeline, a donation system and SocialSync.",
};

export default function WorkPage() {
  return (
    <>
      <section className="gutter pt-28 md:pt-36 pb-[6vh]">
        <p className="hand text-[1.2rem]">Everything I have built</p>
        <h1 className="display text-[clamp(2.8rem,7vw,7rem)] mt-2 max-w-[12ch]">Nine systems, one board.</h1>
        <p className="lead mt-6 max-w-[46ch]">Hover a card to see how it is drawn; open it to walk through the build step by step. Newest first.</p>
      </section>
      <section className="gutter pb-[6vh]">
        <WorkBoard projects={projects} />
      </section>
      <Close heading="Want one of these built for you?" />
    </>
  );
}
