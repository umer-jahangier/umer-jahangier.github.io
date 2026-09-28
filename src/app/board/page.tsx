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
      <section className="gutter pt-24 md:pt-28 pb-5">
        <h1 className="display text-[clamp(2.4rem,5vw,4.4rem)] max-w-[12ch]">The open board.</h1>
        <p className="lead mt-3 max-w-[52ch] text-[1.1rem]">Everywhere else your marker fades in seconds. Here it stays for a day, and whoever visits sees it. Pick a colour from the toolbar, then draw.</p>
      </section>
      <section className="gutter pb-[6vh]" aria-label="Shared drawing board">
        <Wall />
      </section>
      <Guestbook withBoardLink={false} />
      <Close heading="Now write to me." />
    </>
  );
}
