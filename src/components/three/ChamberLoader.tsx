"use client";
import dynamic from "next/dynamic";

/**
 * The chamber (Three.js, postprocessing) is the heaviest code on the site, and
 * it is decoration. Load it after the content so the words paint first; the
 * static chamber stands in until the WebGL one arrives.
 */
const Chamber = dynamic(() => import("./Chamber"), {
  ssr: false,
  loading: () => <div className="chamber-static" aria-hidden />,
});

export default function ChamberLoader() {
  return <Chamber />;
}
