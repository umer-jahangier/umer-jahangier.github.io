import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import ProjectView from "@/components/sections/ProjectView";
import Close from "@/components/sections/Close";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.name, description: `${p.kicker} ${p.role}, ${p.org}, ${p.period}.` };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === slug);
  const next = projects[(i + 1) % projects.length];
  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    description: p.kicker,
    creator: { "@type": "Person", name: "Muhammad Umer" },
    url: p.url,
    keywords: p.stack.join(", "),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProjectView p={p} next={next} />
      <Close heading="Want something like this?" />
    </>
  );
}
