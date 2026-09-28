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

## The shared board (live strokes and visitor notes)

Strokes drawn on the board and the visitor notes are shared through Firebase Realtime Database. The Web app config lives in `.env.production` (it is a public identifier; access is governed by the rules). Until the database exists and answers, the site keeps strokes and notes on the visitor's device and says so.

One-time setup in the Firebase console (project `umer-jahangier`):

1. Build → **Realtime Database** → Create database → location **United States (us-central1)** so the URL is `https://umer-jahangier-default-rtdb.firebaseio.com` (any other region: put its URL in `.env.production` as `databaseURL`) → start in **locked mode**.
2. Rules tab → paste the contents of `firebase.rules.json` → Publish.

Nothing else to deploy; the live site picks the database up on the next page load.
