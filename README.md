# umer-jahangier.github.io

Muhammad Umer's portfolio: an AI and full-stack software engineer's site built as a magma chamber. Cooled rock carries the content, the cursor is heat, and the rock glows where it moves.

- Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind v4
- React Three Fiber + drei + postprocessing for the chamber; GSAP ScrollTrigger and Lenis for the descent; Motion-ready
- Deployed to GitHub Pages by `.github/workflows/deploy.yml`

## Develop

```bash
pnpm install
pnpm dev
```

## Content

Everything on the site is data: `src/content/profile.ts` (bio, ledger, timeline, skills) and `src/content/projects.ts` (one entry per project). Add a project there and it gets a page, a casting on the work index, and a sitemap entry.

## Textures

Rock and fissure maps are CC0 photoscans from Poly Haven; see `public/textures/SOURCES.md`.
