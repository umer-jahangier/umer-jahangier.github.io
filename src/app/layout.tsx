import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders } from "next/font/google";
import "./globals.css";
import Chamber from "@/components/three/ChamberLoader";
import SmoothScroll from "@/components/motion/SmoothScroll";
import HeatCursor from "@/components/motion/HeatCursor";
import { TransitionProvider } from "@/components/motion/Transition";
import Nav from "@/components/ui/Nav";
import { site } from "@/content/profile";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s · Muhammad Umer" },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: "Muhammad Umer",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Muhammad Umer, AI Engineer & Full-Stack Software Engineer" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.jpg"] },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#08070b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "AI Engineer & Full-Stack Software Engineer",
  description: site.description,
  image: `${site.url}/images/headshot-1200.jpg`,
  sameAs: [site.github, site.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "COMSATS University Islamabad" },
  worksFor: [
    { "@type": "Organization", name: "Kindwell Solutions" },
    { "@type": "Organization", name: "Logicbuilder.ai" },
  ],
  knowsAbout: ["LLM agents", "Retrieval-augmented generation", "Model Context Protocol", "Real-time voice AI", "Multi-tenant SaaS", "Kubernetes", "Deep reinforcement learning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${archivo.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-core focus:px-4 focus:py-2 focus:text-obsidian">
          Skip to content
        </a>
        <Chamber />
        <SmoothScroll />
        <HeatCursor />
        <TransitionProvider>
          <Nav />
          <main id="main" className="relative z-10">
            {children}
          </main>
        </TransitionProvider>
      </body>
    </html>
  );
}
