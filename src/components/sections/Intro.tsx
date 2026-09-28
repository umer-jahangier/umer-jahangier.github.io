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
    { id: "tests", x: 20, y: 320, w: 180, h: 54, label: "Tests & CI", sub: "sharded GitHub Actions" },
    { id: "k8s", x: 240, y: 320, w: 160, h: 54, label: "Kubernetes", sub: "Helm · Argo CD" },
    { id: "apps", x: 440, y: 320, w: 190, h: 54, label: "Web · mobile · desktop" },
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

const capabilityMobile: SketchDef = {
  w: 380, h: 620,
  nodes: [
    { id: "agent", x: 20, y: 20, w: 170, h: 62, label: "LLM agent", sub: "tools · RAG · MCP" },
    { id: "human", x: 260, y: 22, w: 60, h: 58, label: "", kind: "human" },
    { id: "voice", x: 20, y: 150, w: 210, h: 62, label: "Real-time voice", sub: "Deepgram → LLM → Cartesia" },
    { id: "saas", x: 20, y: 290, w: 340, h: 66, label: "Multi-tenant SaaS", sub: "data model · API · web · workers" },
    { id: "tests", x: 20, y: 430, w: 160, h: 54, label: "Tests & CI", sub: "sharded GitHub Actions" },
    { id: "k8s", x: 200, y: 430, w: 160, h: 54, label: "Kubernetes", sub: "Helm · Argo CD" },
    { id: "apps", x: 20, y: 545, w: 340, h: 54, label: "Web · mobile · desktop" },
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
  notes: [{ x: 24, y: 118, text: "a person approves every write" }, { x: 245, y: 200, text: "live, over Twilio" }],
};

export default function Intro() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".in", { y: 22, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.09, delay: 0.1 });
          },
    { scope: root },
  );
  return (
    <section ref={root} className="act-intro gutter" aria-labelledby="intro-heading">
      <div className="measured gap-y-10 items-center">
        <div className="col-span-12 lg:col-span-5">
          <h1 id="intro-heading" className="in display text-[clamp(2.75rem,6vw,5.6rem)]">
            {intro.headline}
          </h1>
          <p className="in lead mt-5 max-w-[38ch]">{intro.line}</p>
          <p className="in mt-3 text-ink-2 max-w-[38ch]">{intro.since}</p>
          <div className="in mt-8 flex flex-wrap gap-x-5 gap-y-6 items-start" data-no-draw>
            <div className="flex flex-col gap-3 items-start">
              <Note href={cta.hire.href} title={cta.hire.title} sub={cta.hire.sub} />
              <a href={site.cv} download className="ink-link ml-1 inline-flex items-center gap-1.5 text-sm font-semibold">
                <IconDownload size={16} /> Download the CV
              </a>
            </div>
            <Note href={cta.build.href} title={cta.build.title} sub={cta.build.sub} rose />
          </div>
          <div className="in mt-5 flex flex-wrap items-center gap-6" data-no-draw>
            <span className="inline-flex items-center gap-2 text-sm text-ink-2" aria-hidden>
              <svg width="34" height="22" viewBox="0 0 34 22" className="text-marker">
                <path className="stroke" d="M3 4 c 10 -2, 22 3, 27 14 M25 13 l 5 6 l 3 -7" />
              </svg>
              scroll
            </span>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 in">
          <Sketch def={capability} mobile={capabilityMobile} pan={false} title="What I build: an LLM agent with a person approving writes, real-time voice, a multi-tenant SaaS, tests, Kubernetes, and apps" eager />
        </div>
      </div>
    </section>
  );
}
