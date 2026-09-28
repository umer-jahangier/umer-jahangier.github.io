import type { Metadata } from "next";
import Castings from "@/components/sections/Castings";
import Close from "@/components/sections/Close";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Production systems built by Muhammad Umer: AlphaVenue.ai and ELLA, LogicOne Dialer, RestaurantOS, Elio, a deep-RL drone thesis, Terra plugins, and freelance work.",
};

export default function WorkPage() {
  return (
    <>
      <div className="pt-32 md:pt-40">
        <Castings projects={projects} heading="Everything cast so far" intro="Eight systems, from a 15-service ERP to a drone that learned to fly through a forest. Newest first." />
      </div>
      <Close heading="Want one of these built for you?" />
    </>
  );
}
