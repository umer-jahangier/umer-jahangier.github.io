"use client";
import { Button, HeatHeading } from "@/components/ui/Slab";
import { useHeat } from "@/components/motion/useHeat";
import { IconDownload, IconGithub, IconLinkedin, IconMail } from "@/components/ui/Icons";
import { site } from "@/content/profile";

/** The crucible: every page ends here, at one action. */
export default function Close({ heading = "Bring me the hard problem." }: { heading?: string }) {
  const email = useHeat<HTMLAnchorElement>(0.2);
  return (
    <footer className="relative gutter pt-[16vh] pb-10" aria-labelledby="close-heading">
      <HeatHeading as="h2" className="text-[clamp(3rem,9vw,10rem)] max-w-[10ch]" floor={0.22}>
        <span id="close-heading">{heading}</span>
      </HeatHeading>
      <div className="measured mt-[6vh] gap-y-10">
        <div className="col-span-10 lg:col-span-6">
          <a ref={email} href={`mailto:${site.email}`} className="ember-link heat-text display text-[clamp(1.6rem,4vw,3.4rem)] tracking-[0.01em] normal-case">
            {site.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${site.email}`} primary>
              <IconMail /> Email me
            </Button>
            <Button href={site.cv} download>
              <IconDownload /> Download CV
            </Button>
          </div>
        </div>
        <div className="col-span-10 lg:col-span-4 text-ash text-[0.9375rem] leading-[1.55]">
          <p>{site.location}.</p>
          <p className="mt-2">{site.openTo}</p>
          <div className="mt-6 flex gap-5">
            <a href={site.github} className="ember-link inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              <IconGithub /> GitHub
            </a>
            <a href={site.linkedin} className="ember-link inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              <IconLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="hairline mt-[10vh]" />
      <p className="mt-5 text-xs text-ash-2 flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} Muhammad Umer. Built with Next.js, React Three Fiber, GSAP and Lenis.</span>
        <span>Move the cursor: the rock remembers heat.</span>
      </p>
    </footer>
  );
}
