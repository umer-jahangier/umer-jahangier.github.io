---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/work/page.tsx","src/app/journey/page.tsx","src/app/services/page.tsx","src/app/contact/page.tsx"]
---

# Home surface: the Whiteboard Keynote

Scope: `/` plus the shared world for /work, /work/[slug], /journey, /services, /contact. Visitor mode: Experience (the work leads; the interface recedes). Audiences: recruiters and hiring managers (30–90 s) and clients who want an AI agent, SaaS or tool built. Actions, equal weight: Hire me (email + CV) and Build with me (start a project). Proof: verified production numbers and the systems themselves, drawn. Constraints: static export, day and night themes, optional sound, reduced-motion fallback, 60fps on mid-range phones, the complete CV represented.

## Direction contract

THESIS: A keynote given at a whiteboard. Every act is one system Umer built, and it draws itself in marker as you arrive: boxes, arrows, numbers, a running demo. The user pinned the merger of The Whiteboard Session (world) and The Launch Keynote (pacing). It refuses the dark hero with a floating 3D object and the card grid, and it refuses the previous cave.

OWN-WORLD: Day: board #FAFAF7 with a faint dot grid, graphite ink #111827, secondary #4B5563, one cobalt marker #2340F0, rose #FF7A9A only for the live highlight, sticky-note paper #FFF3C4. Night: glass wall #0B0F19, chalk ink #F3F4F6, secondary #9CA3AF, cobalt #6F87FF, same rose and paper. Display: Bricolage Grotesque (opsz, 700–800) for act titles and numerals; Geist for text and UI; Geist Mono for data; Shantell Sans for marker annotations only. Components: marker strokes that draw in (stroke-dashoffset), sticky notes with a physical press, a whiteboard-app toolbar (theme, sound, marker colour, clear), eraser wipes. Corner radius 6px on notes and controls; diagram nodes 8px; no cards with icons, no eyebrows, no decorative gradients.

STORY: In seconds the visitor sees Umer explaining, in his own hand, what he builds and how; the numbers and the drawn systems convince; a recruiter takes the CV or emails, a client starts a project.

FIRST VIEWPORT: The board. Top-left, the name written in marker (draws in). Left third: "I build AI products end to end." in Bricolage at ~7vw with the one-line summary in Geist. Right two-thirds: the capability diagram draws itself: LLM agent → human approval → voice pipeline → multi-tenant SaaS → Kubernetes, with arrows and annotations in Shantell Sans. Bottom-left: two sticky notes, "Hire me" (cobalt tab) and "Build with me" (rose tab). Right edge: the toolbar. A scroll cue drawn as a marker arrow. Mobile: the diagram stacks under the headline at the same module, scaled.

SIGNATURE INTERACTION and MOTION: the cursor is a marker: a fading ink trail follows it, click-drag draws strokes on the board that fade after a few seconds, with a marker squeak when sound is on. Diagrams draw in on scroll (ScrollTrigger, once) and their nodes are draggable with springs. Keynote acts pin briefly while their demo runs. Page transitions: the eraser: a wide felt band wipes across and fully covers the screen before the route changes; the next page's strokes then draw in. Nothing may appear before the wipe has covered the screen. Reduced motion: strokes render complete, no trail, instant transitions.

FORM: The Whiteboard Keynote, candidate 4 of my re-rolled grounded list, seed key 331a696e (re-roll 1), merged with my pick (Launch Keynote) at the user's steer; raised by Build Instructions (numbered assembly steps), Neubrutalist (one grid, few sizes, physical press), Risograph (two-ink discipline), Sneaker Box (peek then open), Teletext (sacred module), Ticket Wallet (visited sections stay ticked).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
