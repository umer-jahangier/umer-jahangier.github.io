import type { Metadata } from "next";
import Close from "@/components/sections/Close";
import Guestbook from "@/components/sections/Guestbook";
import Wall from "@/components/board/Wall";

export const metadata: Metadata = {
  title: "The open board",
  description: "Draw on Muhammad Umer's open board. Drawings stay for 24 hours and every visitor sees them; leave a note about a tool, a technology or an idea.",
};

export default function BoardPage() {
  return (
    <>
      <section className="gutter pt-28 md:pt-36 pb-[4vh]">
        <h1 className="display text-[clamp(2.8rem,7vw,7rem)] max-w-[12ch]">The open board.</h1>
        <p className="lead mt-6 max-w-[46ch]">Everywhere else on this site your marker fades in seconds. Here it stays for a day, and whoever visits sees what you drew. Pick a colour from the toolbar, then draw.</p>
      </section>
      <section className="gutter pb-[6vh]" aria-label="Shared drawing board">
        <Wall />
      </section>
      <Guestbook withBoardLink={false} />
      <Close heading="Now write to me." />
    </>
  );
}
