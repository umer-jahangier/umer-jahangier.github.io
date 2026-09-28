import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/services/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/journey/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/contact/`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/board/`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
