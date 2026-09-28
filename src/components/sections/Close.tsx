import Note from "@/components/board/Note";
import { IconDownload, IconGithub, IconLinkedin } from "@/components/ui/Icons";
import { cta, site } from "@/content/profile";

/** Every page ends here: two notes, one for each kind of visitor. */
export default function Close({ heading = "Let's put something on the board." }: { heading?: string }) {
  return (
    <footer className="gutter pt-[14vh] pb-28 md:pb-24" aria-labelledby="close-heading">
      <h2 id="close-heading" className="display text-[clamp(2.6rem,6.5vw,6.4rem)] max-w-[14ch]">
        {heading}
      </h2>
      <div className="measured mt-10 gap-y-10">
        <div className="col-span-12 lg:col-span-7" data-no-draw>
          <div className="flex flex-wrap gap-6 items-start">
            <Note href={cta.hire.href} title={cta.hire.title} sub={cta.hire.sub} tilt={-1.5} />
            <Note href={cta.build.href} title={cta.build.title} sub={cta.build.sub} rose tilt={1.6} />
          </div>
          <a href={site.cv} download className="ink-link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
            <IconDownload size={16} /> Download the CV
          </a>
        </div>
        <div className="col-span-12 lg:col-span-5 text-ink-2 text-[0.9375rem] leading-[1.55]">
          <a href={`mailto:${site.email}`} className="ink-link text-ink text-[1.25rem] font-semibold">
            {site.email}
          </a>
          <p className="mt-4">{site.location}.</p>
          <p className="mt-1">{site.openTo}</p>
          <div className="mt-5 flex gap-5">
            <a href={site.github} className="ink-link inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              <IconGithub /> GitHub
            </a>
            <a href={site.linkedin} className="ink-link inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              <IconLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="hairline mt-[10vh]" />
      <p className="mt-4 text-xs text-ink-3">© {new Date().getFullYear()} Muhammad Umer</p>
    </footer>
  );
}
