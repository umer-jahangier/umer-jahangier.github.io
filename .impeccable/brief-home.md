# Home surface: the Magma Chamber

Scope: `/` (the experience), plus the shared world for /work, /work/[slug], /about, /contact. Visitor mode: Experience (the work leads; the interface recedes). Audience: recruiters, hiring managers and engineering leads with 30–90 seconds; secondary clients and MSc committees. Job: decide Umer is worth a conversation. Action: Email me / Download CV. Proof: verified production numbers from the CV. Constraints: static export, reduced-motion fallback, WebGL-less fallback, 60fps on mid-range phones.

## Direction contract

THESIS: The visitor is underground in a magma chamber; cooled black rock carries the content and the cursor is heat, so wherever it moves the rock warms and glows. Scrolling descends. It refuses the category default of a floating 3D primitive over a centred dark hero with a card grid.

OWN-WORLD: Obsidian #08070B ground, basalt #17151C/#2A2731 surfaces, ash #9B96A6 secondary, bone #F2EEF6 text; magma ramp ember #7A1A0E → #FF3D1F → #FF8A3D → core #FFE8B0. Display: Big Shoulders Display (heavy, industrial, condensed). Text: Archivo. Components are slabs of cooled rock: 2px radius, hairline fissure borders that glow with heat; buttons melt (fill rises from ember to core) on hover; links carry an ember underline; focus is a core-white fissure. No cards-with-icons, no eyebrows, no gradients as decoration: every glow is heat from data or pointer.

STORY: Within seconds the visitor knows this is Muhammad Umer, an AI and full-stack engineer who ships production systems; the numbers convince, the chamber makes it memorable; they descend through the work, then email or download the CV.

FIRST VIEWPORT: Full-bleed WebGL basalt floor with faint magma fissures, a persistent heat map warming under the pointer. Lower third: MUHAMMAD UMER at ~18vw in Big Shoulders, lit from beneath by a vent glow; above it one line: "I build AI products end to end: LLM agents, real-time voice, multi-tenant SaaS." Two slab actions bottom-left: Email me (primary, molten) and Download CV. Top: a minimal wordmark (MU mark) left, nav right (Work, About, Contact). Bottom-right: "Descend" cue with a scroll indicator. Mobile: same, name at 24vw wrapping to two lines, touch warms the rock.

SIGNATURE INTERACTION and MOTION: one 2D heat map (ping-pong render target) accumulates pointer heat and cools each frame; it displaces and lights the basalt (emissive fissures), and its value at each DOM element (sampled once per frame) drives CSS `--heat` for text glow and button melt. Scroll (Lenis + ScrollTrigger) descends the camera down a shaft; sections are ledges; project castings cool from core-orange to black as they settle into view. Page transitions: a magma surge (a molten wave rises from the bottom, holds, cools into the next page). Reduced motion: static floor image, no heat map, instant transitions.

FORM: Magma Chamber, candidate 7 of my ordered list (the literal reading of the brief), seed key 331a696e; raised by Oscilloscope (measured grid), Teen Quiz (persistent ember marks), Botanical (registered project scale), Crease (one 2D source drives all), Film (artifacts tied to data).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
