"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Sketch, { type SketchDef } from "@/components/board/Sketch";
import Note from "@/components/board/Note";
import { cta, intro, site } from "@/content/profile";
import { IconDownload } from "@/components/ui/Icons";

gsap.registerPlugin(useGSAP);

const capability: SketchDef = {
  w: 640, h: 420,
  nodes: [
    { id: "agent", x: 30, y: 40, w: 170, h: 62, label: "LLM agent", sub: "tools · RAG · MCP" },
    { id: "human", x: 260, y: 42, w: 60, h: 58, label: "", kind: "human" },
    { id: "voice", x: 400, y: 40, w: 210, h: 62, label: "Real-time voice", sub: "Deepgram → LLM → Cartesia" },
    { id: "saas", x: 180, y: 190, w: 280, h: 66, label: "Multi-tenant SaaS", sub: "data model · API · web · workers" },
    { id: "tests", x: 30, y: 320, w: 170, h: 54, label: "Tests & CI", sub: "sharded GitHub Actions" },
    { id: "k8s", x: 260, y: 320, w: 160, h: 54, label: "Kubernetes", sub: "Helm · Argo CD" },
    { id: "apps", x: 460, y: 320, w: 150, h: 54, label: "Web · mobile · desktop" },
  ],
  edges: [
    { from: "agent", to: "human" },
    { from: "human", to: "saas" },
    { from: "voice", to: "saas" },
    { from: "agent", to: "saas" },
    { from: "saas", to: "tests" },
    { from: "saas", to: "k8s" },
    { from: "saas", to: "apps" },
  ],
  notes: [{ x: 40, y: 140, text: "a person approves every write" }, { x: 470, y: 140, text: "live, over Twilio" }],
};

export default function Intro() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".in", { y: 22, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09, delay: 0.1 });
      gsap.from(".hello .draw", { strokeDashoffset: 1, duration: 1.1, ease: "power2.inOut", stagger: 0.12, delay: 0.05 });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="act gutter pt-28 md:pt-32" aria-labelledby="intro-heading">
      <div className="measured gap-y-10 items-center">
        <div className="col-span-12 lg:col-span-5">
          <p className="hand text-[1.35rem] mb-3">
            Muhammad Umer, AI engineer
            <svg className="hello block w-[240px] h-[10px] text-marker" viewBox="0 0 240 10" aria-hidden>
              <path className="stroke draw drawn" pathLength={1} d="M2 6 C 40 2, 80 8, 120 5 S 200 3, 238 6" />
            </svg>
          </p>
          <h1 id="intro-heading" className="in display text-[clamp(2.75rem,6.4vw,6.2rem)]">
            {intro.headline}
          </h1>
          <p className="in lead mt-6 max-w-[38ch]">{intro.line}</p>
          <p className="in mt-4 text-ink-2 max-w-[38ch]">{intro.since}</p>
          <div className="in mt-9 flex flex-wrap gap-5 items-start" data-no-draw>
            <div className="flex flex-col gap-3 items-start">
              <Note href={cta.hire.href} title={cta.hire.title} sub={cta.hire.sub} />
              <a href={site.cv} download className="ink-link ml-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                <IconDownload size={16} /> Download the CV
              </a>
            </div>
            <Note href={cta.build.href} title={cta.build.title} sub={cta.build.sub} rose />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 in">
          <Sketch def={capability} title="What I build: an LLM agent with a person approving writes, real-time voice, a multi-tenant SaaS, tests, Kubernetes, and apps" eager />
          <p className="hand text-[1.05rem] mt-2 text-right">drag any box; it springs back</p>
        </div>
      </div>
      <div className="in mt-10 flex items-center gap-3 text-ink-2 text-sm" aria-hidden>
        <svg width="46" height="30" viewBox="0 0 46 30" className="text-marker">
          <path className="stroke" d="M4 6 c 14 -2, 30 4, 36 20 M34 18 l 6 8 l 4 -9" />
        </svg>
        <span>keep going, it draws as you scroll</span>
      </div>
    </section>
  );
}
