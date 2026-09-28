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

## The shared board (live strokes, the open board, visitor notes)

Strokes drawn anywhere on the site are shared for about ten seconds; drawings on the open board (`/board/`) stay for 24 hours; visitor notes stay. All of it lives in Firebase Realtime Database (`https://umer-jahangier-default-rtdb.firebaseio.com`), protected by `firebase.rules.json`.

The Web app config is provided at build time as the GitHub Actions secret `NEXT_PUBLIC_FIREBASE_CONFIG` (one line of JSON: apiKey, authDomain, databaseURL, projectId, appId). It is not committed. For local development put the same line in `.env.local`. Without it the site keeps strokes and notes on the visitor's device and says so.

Whenever `firebase.rules.json` changes, paste it into the database's Rules tab in the Firebase console and publish.
