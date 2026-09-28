import Close from "@/components/sections/Close";
import { HeatHeading, Button } from "@/components/ui/Slab";

export default function NotFound() {
  return (
    <>
      <section className="gutter pt-32 md:pt-40 min-h-[70dvh]">
        <HeatHeading as="h1" className="text-[clamp(3rem,10vw,11rem)]" floor={0.25}>
          No such chamber
        </HeatHeading>
        <p className="prose-chamber mt-8 text-ash max-w-[48ch]">This passage leads nowhere. The work, the timeline and the contact page are all above.</p>
        <div className="mt-8">
          <Button href="/" primary>
            Back to the surface
          </Button>
        </div>
      </section>
      <Close />
    </>
  );
}
