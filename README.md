# umer-jahangier.github.io

Muhammad Umer's portfolio: a keynote given at a whiteboard. Every system he built draws itself in marker as you scroll, with live demos of the biggest ones, day and night boards, optional sound, and the whole CV on the board.

- Next.js (App Router, static export), React, TypeScript, Tailwind v4
- GSAP ScrollTrigger and Lenis for the drawing and the descent; canvas for the marker; Web Audio for the sounds
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`

## Develop

```bash
pnpm install
pnpm dev
```

## Content

Everything is data: `src/content/profile.ts` (intro, numbers, timeline, skills, certificates, services) and `src/content/projects.ts` (one entry per project, with its sketch and assembly steps). Add a project there and it gets a page, a card on the work board and a sitemap entry.
