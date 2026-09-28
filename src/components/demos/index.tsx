"use client";
import dynamic from "next/dynamic";
import type { Project } from "@/content/projects";
import Sketch from "@/components/board/Sketch";

const ToolApproval = dynamic(() => import("./ToolApproval"), { ssr: false });
const Dialler = dynamic(() => import("./Dialler"), { ssr: false });
const ServiceMap = dynamic(() => import("./ServiceMap"), { ssr: false });
const DroneSim = dynamic(() => import("./DroneSim"), { ssr: false });
const Marketplace = dynamic(() => import("./Marketplace"), { ssr: false });

/** The right-hand graphic for a project: its live demo where one exists, otherwise its drawn system. */
export default function Demo({ p }: { p: Project }) {
  switch (p.demo) {
    case "tool-approval":
      return <ToolApproval />;
    case "dialler":
      return <Dialler />;
    case "service-map":
      return <ServiceMap />;
    case "drone":
      return <DroneSim />;
    case "marketplace":
      return <Marketplace />;
    default:
      return (
        <div className="panel p-4 md:p-5" data-no-draw>
          <Sketch def={p.sketch} title={`${p.name}: how it is built`} />
        </div>
      );
  }
}
