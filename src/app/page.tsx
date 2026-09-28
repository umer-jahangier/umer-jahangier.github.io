import Hero from "@/components/sections/Hero";
import Ledger from "@/components/sections/Ledger";
import Castings from "@/components/sections/Castings";
import Strata from "@/components/sections/Strata";
import Close from "@/components/sections/Close";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/profile";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Plain-language summary for readers and answer engines; the chamber is decoration. */}
      <p className="sr-only">
        {site.name} is an AI and full-stack software engineer in Lahore, Pakistan, working remotely for US companies. Sole engineer of AlphaVenue.ai and primary engineer of LogicOne Dialer; technical lead of RestaurantOS; BS Computer Science, COMSATS, CGPA 3.68. Contact: {site.email}.
      </p>
      <Ledger />
      <Castings projects={featuredProjects} intro="Four systems I built or lead, each in production. The numbers are the same ones on my CV." />
      <Strata />
      <Close />
    </>
  );
}
