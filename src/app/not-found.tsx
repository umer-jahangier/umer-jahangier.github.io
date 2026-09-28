import Close from "@/components/sections/Close";
import { TransitionLink } from "@/components/motion/Eraser";
import { IconNext } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <>
      <section className="gutter pt-28 md:pt-36 min-h-[60dvh]">
        <p className="hand text-[1.2rem]">Nothing drawn here</p>
        <h1 className="display text-[clamp(2.8rem,7vw,7rem)] mt-2 max-w-[10ch]">Blank board.</h1>
        <p className="lead mt-6 max-w-[40ch]">That address has nothing on it. The work, the journey and the services are a click away.</p>
        <TransitionLink href="/" className="btn btn-marker mt-8">
          Back to the start <IconNext />
        </TransitionLink>
      </section>
      <Close />
    </>
  );
}
