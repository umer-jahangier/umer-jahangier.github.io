import type { Metadata } from "next";
import { TransitionLink } from "@/components/motion/Eraser";

export const metadata: Metadata = { title: "About", robots: { index: false } };

/** The old address; the page moved to /journey. */
export default function AboutRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/journey/" />
      <section className="gutter pt-36">
        <p className="lead">
          This page moved to{" "}
          <TransitionLink href="/journey/" className="ink-link">
            the journey
          </TransitionLink>
          .
        </p>
      </section>
    </>
  );
}
