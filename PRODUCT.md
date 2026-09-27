# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, React 19, TypeScript, Tailwind v4) as a fully static export, chosen by the user for SEO/AEO and free hosting. 3D and motion: Three.js via React Three Fiber and drei, postprocessing, GSAP (ScrollTrigger) with @gsap/react, Lenis smooth scroll, Motion for component-level physics. Deploy: GitHub Pages through GitHub Actions at https://umer-jahangier.github.io now; a custom domain (umerjahangier.com) later, switched by DNS and a CNAME file without a rebuild.

## Users

- Primary: recruiters and hiring managers at US and EU remote-first companies, and engineering leads who click through from LinkedIn, GitHub or a CV. They arrive with 30–90 seconds, on desktop or phone, deciding whether Umer is worth a conversation.
- Secondary: prospective freelance clients (small businesses wanting AI or full-stack software), and professors or admissions committees for research MSc programmes in Europe (Italy, Germany, Switzerland, France).
- Tertiary: peers in the AI and web engineering community who find the site through a post.

## Product Purpose

Muhammad Umer's personal portfolio site. It exists so that someone who has only seen a CV line or a LinkedIn headline can experience, in one visit, that he builds AI products end to end and that he does it with unusual engineering depth and taste. Success: the visitor emails him or downloads the CV, and remembers the site an hour later.

The site is also itself a demonstration: an engineer who ships LLM agents, real-time voice and multi-tenant SaaS should have a site whose 3D, motion and performance prove the same craft.

## Positioning

The mechanism a neighbouring portfolio cannot copy: real, verified production scale from someone two years into his career. Sole engineer of AlphaVenue.ai (132 data models, 179 pages, ~1,450 test files), ELLA with 104 operational tools and human approval on every write, an MCP server for external agents, a real-time voice agent (Deepgram → LLM → Cartesia over Twilio), primary engineer of LogicOne Dialer (62→96 models, 271→429 routes), technical lead of RestaurantOS (15 Spring Boot microservices, row-level security, fail-closed OPA), plus a deep-RL drone-navigation thesis. Most portfolios show side projects; this one shows systems in production with numbers.

## Operating Context

- Visitors come from LinkedIn (linkedin.com/in/muhammad-umer-jahangier), GitHub (github.com/umer-jahangier, a self-updating "skyline" profile), the Europass CVs, and LinkedIn posts.
- Umer works remotely from Lahore, Pakistan, in US hours, for US companies. He is open to remote roles in the US and EU and to on-site roles in Italy, Germany, Switzerland and France, and is pursuing a research-oriented MSc in AI in Europe alongside work.
- The site is maintained by Umer with Claude; content updates should be data-driven (one content file per project) so it stays current without redesign.

## Capabilities and Constraints

- Pages: home (the experience), work (project index), one page per project, about (timeline, education, thesis), contact. A CV download and email are the conversion.
- Primary call to action (confirmed): email umer.jahangier@gmail.com and download the Industry CV PDF. No booking tool.
- Must be a static export (no server), fast on mid-range phones, fully keyboard-accessible, and respect prefers-reduced-motion with a complete non-3D fallback so recruiters on any device get the content.
- SEO/AEO: every page is static HTML with real text, structured data (Person, CreativeWork), Open Graph images, sitemap and robots. Answer-engine friendly: a plain-language summary of who he is and what he built appears in the HTML, not only in WebGL.
- Truth constraints: every number and claim comes from the verified CV. Praivox is excluded from the site. The research paper stays off until submitted; the thesis is shown. Private employer repositories are named only as products (AlphaVenue.ai, LogicOne Dialer, Elio, RestaurantOS, HRIA-DMS as "donation-management system", SocialSync, AI take-off pipeline). Never claim "4+ years" (it is "over two years"), never Next.js/React Native for Elio, never SocialSync lead, never real flight for the thesis.
- Terminology: "LLM agents", "RAG", "MCP", "real-time voice AI", "multi-tenant SaaS".

## Brand Commitments

- Name: Muhammad Umer. Handle: umer-jahangier. Headline family: "AI Engineer & Full-Stack Software Engineer".
- Existing identity to stay coherent with, not to copy: the GitHub "Cyclorama" skyline (night navy #03040A–#2A3DE0, rose #FF7A9A, warm windows #FFC4D2 for private work, cool windows #8FA2FF for public), the LinkedIn banner and the "by the numbers" post graphic, and the MU avatar mark (`work/avatar/avatar-mark.svg`). The site may evolve this world; it must not contradict it.
- Voice: first person, direct, specific, numbers over adjectives, no hype words. British spelling.
- User-pinned brief (binding): the site must feel like a heavily engineered, immersive, game-like 3D experience: scroll-driven 3D, parallax, lighting that responds to the cursor (the user's image: glowing lava that lights up where the mouse hovers), surprising page transitions, and interactive components. Award-level ambition (Awwwards/FWA class). GSAP, Lenis, Motion and a Three.js stack are required.

## Evidence on Hand

- CVs: `../Muhammad_Umer_Europass_CV_Industry.pdf` and `_Academic.pdf` (source of truth for all facts).
- Headshot: `../Muhammad_Umer_Headshot.jpg` (2000×2000, AI-generated professional headshot approved by Umer).
- Avatar marks: `../work/avatar/avatar-night.svg`, `avatar-day.svg`, `avatar-mark.svg`.
- GitHub profile generator and its SVG output: `../work/github-profile/` (skyline, rhythm, activity, work cards; fonts Archivo subsets in `assets/fonts/`).
- LinkedIn banner and post graphic: `../linkedin/linkedin-banner.png`, `../linkedin/post-1-by-the-numbers.png`.
- Public product URLs: logicone.ai, elio.care, github.com/juno-fx/Terra-Official-Plugins, github.com/umer-jahangier.
- Absent, do not fabricate: testimonials, client logos beyond the employers named, screenshots of private products (AlphaVenue.ai, RestaurantOS internals), benchmarks not in the CV, awards beyond the HEC laptop-scheme merit award.

## Product Principles

1. Prove with production numbers, never adjectives.
2. The site is a demonstration of the engineering it describes: 3D and motion must run at 60fps on a mid-range phone or degrade gracefully; nothing decorative may cost the content.
3. Every visit ends at one action: email or CV.
4. Content is data; the design is a system that any new project drops into.
5. Truthful and current: what is on the site is verified, and the site can be updated without a redesign.

## Accessibility & Inclusion

Keyboard navigation for every interactive element; visible focus; `prefers-reduced-motion` gives a complete static experience with the same content; colour contrast AA; all 3D is decorative or duplicated in HTML text. Recruiters may be on locked-down corporate laptops without WebGL: the site must still read.
