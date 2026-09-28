---
name: Muhammad Umer, portfolio
description: A keynote given at a whiteboard; every system draws itself in marker.
colors:
  board: "#fafaf7"
  surface: "#ffffff"
  ink: "#111827"
  ink-2: "#4b5563"
  ink-3: "#9ca3af"
  marker: "#2340f0"
  marker-soft: "rgb(35 64 240 / 0.12)"
  rose: "#ff7a9a"
  rose-soft: "rgb(255 122 154 / 0.18)"
  paper: "#fff3c4"
  paper-ink: "#3a2e00"
  grid: "rgb(17 24 39 / 0.11)"
  line: "rgb(17 24 39 / 0.14)"
  board-night: "#0b0f19"
  surface-night: "#111827"
  ink-night: "#f3f4f6"
  ink-2-night: "#9ca3af"
  ink-3-night: "#6b7280"
  marker-night: "#6f87ff"
  marker-soft-night: "rgb(111 135 255 / 0.16)"
  rose-soft-night: "rgb(255 122 154 / 0.2)"
  grid-night: "rgb(243 244 246 / 0.1)"
  line-night: "rgb(243 244 246 / 0.16)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 7vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 96, 'wdth' 100"
  headline:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 96, 'wdth' 100"
  title:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 48, 'wdth' 100"
  numeral:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums lining-nums"
    fontVariation: "'opsz' 96, 'wdth' 100"
  lead:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.2rem, 1.05rem + 0.7vw, 1.6rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 0.95rem + 0.4vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Geist, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
  hand:
    fontFamily: "Shantell Sans, Segoe Print, Bradley Hand, cursive"
    fontSize: "1.2rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0"
  mono:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    fontFeature: "tabular-nums"
rounded:
  tape: "2px"
  control: "6px"
  panel: "8px"
  toolbar: "10px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 64px)"
  column-gap: "clamp(12px, 1.5vw, 24px)"
  act-block: "clamp(64px, 10vh, 120px)"
  section-block: "10vh"
  xs: "8px"
  sm: "16px"
  md: "20px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
components:
  note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.control}"
    padding: "16px 17.6px 16.8px"
    width: "min 12rem"
  note-rose:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.control}"
    padding: "16px 17.6px 16.8px"
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.board}"
  button-marker:
    backgroundColor: "{colors.marker}"
    textColor: "#ffffff"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-marker-hover:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
  tool:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "44px"
  tool-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.board}"
    rounded: "{rounded.control}"
    size: "44px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
  toolbar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.toolbar}"
    padding: "6px"
  ink-link:
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
  chip-read:
    backgroundColor: "{colors.marker-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "4px"
    padding: "2px 6px"
  chip-write:
    backgroundColor: "{colors.rose-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "4px"
    padding: "2px 6px"
---

# Design System: Muhammad Umer, portfolio

## Overview

**Creative North Star: "The Whiteboard Keynote"**

The site is a keynote given at a whiteboard. Each act is one system Umer built, and it draws itself in marker as the visitor arrives: boxes, arrows, hand-written annotations, verified numbers, and a small running demo. The board is the material: a faint dot grid on warm off-white by day or on a dark glass wall by night, a single cobalt marker for everything that is "said", and sticky-note paper for the two calls to action. The interface recedes so the work leads; the visitor's own cursor is a marker that leaves a fading ink trail and can draw on the board.

Density is calm and generous: one twelve-column grid, wide fluid gutters, full-viewport acts centred vertically, and long measure for reading. The two-ink discipline (borrowed from risograph) keeps the palette honest: cobalt is the voice, rose appears only where something is live or gated, and everything else is graphite ink on the board. Physicality comes from small presses and springs rather than depth: notes tilt and lift, buttons press by 1px, dragged diagram nodes snap back elastically, and page changes are a felt eraser that fully covers the screen before the next page draws in.

The world rejects the dark hero with a floating 3D object, the icon-card grid, uppercase tracked eyebrows and decorative gradients, and the previous "cooled rock and magma" build.

**Key Characteristics:**
- Everything structural is drawn: SVG marker strokes (2.75px, round caps, a fractal-noise displacement filter) that draw in on scroll, once.
- Two inks: cobalt marker for voice and highlight, rose only for the live or gated moment; graphite ink for text.
- Sticky notes as calls to action, with a coloured tape tab (cobalt for recruiters, rose for clients).
- Bricolage Grotesque at 800 for act titles and tabular numerals; Geist for reading and UI; Shantell Sans strictly for marker annotations.
- Day and night boards share every non-board token; the switch is a 380ms colour fade.
- Optional synthesised sound (squeak, tick, pop, swoosh), off by default, never before a gesture.
- Reduced motion is a complete experience: strokes render finished, no trail, no wipes, demos show a still frame.

## Colors

Two boards, one marker, one sheet of paper: a warm off-white or a dark glass wall, graphite ink in three strengths, a cobalt marker that shifts lighter at night, rose held for the live highlight, and unchanging yellow sticky-note paper.

### Primary
- **Cobalt Marker** (`{colors.marker}` by day, `{colors.marker-night}` by night): the one voice. Numerals, hand annotations, the tape tab on the hire note, the link underline, selection, caret, focus ring, the cursor dot, the current diagram part, and the `.btn-marker` fill. It is the only saturated colour on a default screen.
- **Cobalt Wash** (`{colors.marker-soft}` / `{colors.marker-soft-night}`): a 12–16% tint used only as a chip fill behind "read" states in demos.

### Secondary
- **Rose Marker** (`{colors.rose}`, identical in both themes): the live highlight. The tape on the "Build with me" note, the "write" chip wash (`{colors.rose-soft}`), the lock glyph while a write awaits approval, and the second marker colour the visitor can pick. Never a background, never a heading.

### Tertiary
- **Sticky Paper** (`{colors.paper}`) with **Paper Ink** (`{colors.paper-ink}`): the sticky note only. The same paper in both themes; the note is a physical object, so it does not recolour with the board.

### Neutral
- **Board** (`{colors.board}` / `{colors.board-night}`): page background, scrollbar track, eraser band, and the text colour on inverted controls.
- **Surface** (`{colors.surface}` / `{colors.surface-night}`): the white of panels, buttons and tools pinned to the board.
- **Ink** (`{colors.ink}` / `{colors.ink-night}`): headings, body emphasis, strokes (`currentColor`), and the inverted fill of hovered or pressed controls.
- **Ink 2** (`{colors.ink-2}` / `{colors.ink-2-night}`): running text, sub-labels, diagram sub-lines.
- **Ink 3** (`{colors.ink-3}` / `{colors.ink-3-night}`): footer copyright and meta only.
- **Line** (`{colors.line}` / `{colors.line-night}`): every 1.5px hairline, inset ring and divider; the felt edge of the eraser.
- **Grid** (`{colors.grid}` / `{colors.grid-night}`): the 1.2px dot grid on a 28px pitch.

### Named Rules
**The Two-Ink Rule.** Cobalt is the voice; rose is the live or gated moment. No third hue enters the board. Graphite and line-alpha do all remaining work.
**The Paper Stays Paper Rule.** Sticky-note paper and its ink are the same in day and night; only the board, surface, inks, marker and alpha lines re-theme.
**The Alpha Lines Rule.** Dividers, rings and the grid are alphas of the ink (`rgb(... / 0.10–0.16)`), never a separate grey, so they sit correctly on both boards.

## Typography

**Display Font:** Bricolage Grotesque, variable, with `opsz` and `wdth` axes (with Helvetica Neue, Arial)
**Body Font:** Geist, variable (with Helvetica Neue, Arial)
**Label/Mono Font:** Geist Mono 400/500, tabular (with ui-monospace, Menlo)
**Annotation Font:** Shantell Sans, variable (with Segoe Print, Bradley Hand)

**Character:** Loud, tight Bricolage at 800 for what is being presented; quiet Geist for what is being read; a real handwriting face, in marker colour, only for what a presenter would scribble beside a diagram.

### Hierarchy
- **Display** (800, `clamp(2.8rem, 7vw, 7rem)`, 0.96, -0.03em, `opsz` 96): one page title per page; the home headline runs `clamp(2.75rem, 6.4vw, 6.2rem)` and project titles up to `clamp(2.8rem, 8vw, 8.5rem)` at a 12ch measure. `text-wrap: balance`.
- **Headline** (800, `clamp(2.2rem, 5vw, 4.6rem)`, 0.96): section titles ("Production, counted.", "Also on the board."), capped at 14–16ch.
- **Title** (700, 1.2–2.4rem, 1.02, -0.025em, `opsz` 48): card and panel titles inside `.panel`.
- **Numeral** (800, `clamp(2rem, 3.6vw, 3.2rem)` in acts, up to `clamp(3.4rem, 8vw, 7.5rem)` in the tally, 0.95, tabular lining): every verified number, always in cobalt, counted in with expo.out where motion is allowed.
- **Lead** (400, `clamp(1.2rem, 1.05rem + 0.7vw, 1.6rem)`, 1.4): the one-sentence claim under a title, 36–54ch, `text-wrap: pretty`.
- **Body** (400, `clamp(1.0625rem, 0.95rem + 0.4vw, 1.2rem)`, 1.6): running prose in Ink 2 at a 64ch measure; `strong` returns to Ink at 600.
- **UI** (500–600, 0.9375rem): buttons, nav links, card copy.
- **Label** (400, 0.875rem) and **Caption** (400, 0.75rem): dt/dd labels, meta, chip text; always sentence case, never tracked.
- **Hand** (500, 1.05–1.35rem, cobalt): act numbers, the presenter's name, "drag any box; it springs back", diagram edge labels (12.5–13.5px in SVG).
- **Mono** (400, 0.75rem, tabular): timeline dates, diagram sub-lines (10.5px in SVG), demo chips.

### Named Rules
**The Marker-Only Handwriting Rule.** Shantell Sans is always in marker colour and never sets a heading, a button, body text or a number. It annotates.
**The Tabular Numbers Rule.** Every production number is Bricolage 800 with tabular lining figures, in cobalt, so counters do not jitter and the proof reads as one voice.
**The No Eyebrow Rule.** No uppercase, letter-spaced label sits above a title. What sits above a title is a hand annotation ("Act 3", the role) in Shantell Sans, sentence case.

## Layout

One grid, few sizes. Every section is `.gutter` (`padding-inline: clamp(16px, 4vw, 64px)`) containing `.measured`, a 12-column grid with `column-gap: clamp(12px, 1.5vw, 24px)`. Text columns take 5 of 12 on `lg` and the drawn system takes 7; acts alternate sides (`flip`). Below `lg` everything stacks to 12 columns and the diagram sits under its headline at the same module, scaled by its viewBox.

Keynote acts are `.act`: `min-height: 100dvh`, content vertically centred, `padding-block: clamp(64px, 10vh, 120px)`. Supporting sections use `py-[10vh]` (the tally `12vh`, the close `pt-[14vh]`). Within a column the vertical rhythm is 8 / 16 / 20 / 24 / 32 / 40px (`mt-2` to `mt-10`); grid row gaps are 24px (`gap-y-6`) or 40px (`gap-y-10`). Panels pad 20px (24px on `md` for demos and work cards). The fixed nav is 64px tall (72px on `md`) and floats on a board-coloured scrim; page content starts at `pt-28` / `pt-32`. The toolbar is fixed bottom-right at 16px, centred at the bottom on small screens. Breakpoints are Tailwind's `md` (768px) and `lg` (1024px) only.

The work board uses a repeating 7 / 5 / 4 / 4 / 4 column pattern across five cards so the grid reads as pinned paper rather than a card grid.

## Elevation & Depth

Depth is board and paper, not layered glass. There are exactly two soft shadows and they belong to things physically pinned to the board: panels (`--shadow`) and sticky notes (`--note-shadow`), both tight negative-spread drops that darken and lengthen by night. Every other edge is a 1.5px inset ring in Line (rest) or Ink (hover, pressed, peek), which lets the same control sit on either board with no separate border colour. Inversion is the strongest state: a hovered button or pressed tool fills with Ink and its text becomes Board.

### Shadow Vocabulary
- **Pinned panel** (`box-shadow: inset 0 0 0 1.5px var(--line), var(--shadow)`; day `0 14px 34px -16px rgb(17 24 39 / 0.4)`, night `0 18px 44px -18px rgb(0 0 0 / 0.85)`): every `.panel`, the toolbar, demo frames, work cards.
- **Sticky note** (`var(--note-shadow)`; day `0 10px 24px -10px rgb(17 24 39 / 0.45)`, night `0 14px 30px -12px rgb(0 0 0 / 0.8)`): notes at rest.
- **Note lifted** (`0 22px 40px -14px rgb(17 24 39 / 0.5)`): hover and focus, with the tilt removed and a 3px lift.
- **Ring, rest** (`inset 0 0 0 1.5px var(--line)`) and **Ring, engaged** (`inset 0 0 0 1.5px var(--ink)`): tools, panels, buttons, peeked cards.

### Named Rules
**The Pinned Things Cast Shadows Rule.** Only objects a presenter could pin to a board cast a shadow: notes and panels. Text, strokes, chips and links never do.
**The Ring Not Border Rule.** Edges are inset box-shadow rings of 1.5px, never `border`, so hover can swap Line for Ink without a layout shift.

## Shapes

Small, consistent radii by role: 6px on anything the hand touches (notes, buttons, tools, the focus ring), 8px on things pinned to the board (panels, diagram boxes), 10px on the toolbar shell, 2px on the tape, and full circles for the marker swatches and the cursor dot. Diagram "pill" nodes take `h/2`; stores are drawn as cylinders and people as a head-and-shoulders stroke. Strokes are 2.75px, round-capped, `vector-effect: non-scaling-stroke`, bowed slightly off the straight line (up to 18 units) with a 9-unit open arrowhead, and run through the shared `#marker` fractal-noise displacement filter so they read as marker, not vector. Dashed edges use `0.06 0.04` of the path length. Notes rest at a slight tilt (`--tilt`, -1.2° cobalt, +1.4° rose) and straighten on hover.

## Components

### Sticky Notes (calls to action)
Paper you can press. A `.note` is an inline-flex column on Sticky Paper with Paper Ink, 6px radius, `padding: 1rem 1.1rem 1.05rem`, `min-width: 12rem`, the note shadow, and a 54×16px tape at top centre coloured by `--tab` (cobalt by default, rose via `.note-rose`) at 85% opacity, rotated -2°.
- **Title:** Shantell Sans 600 at 1.35rem, line-height 1.1. **Sub:** 0.875rem at 75% Paper Ink.
- **Hover / Focus:** rotate to 0°, `translateY(-3px) scale(1.02)`, lifted shadow, 260ms ease-out. **Active:** `translateY(1px) scale(0.99)`. Plays `pop` on pointer enter.
- **Rule:** exactly two notes per surface, hire (cobalt tab) and build (rose tab), in the first viewport and again at the close.

### Buttons
- **Shape:** 6px radius, 48px min height, `padding: 0 1.25rem`, gap 0.55em, Geist 600 at 0.9375rem, arrow glyph at 18px trailing.
- **Default (`.btn`):** Surface fill, Ink text, 1.5px Ink ring.
- **Hover / Focus:** inverts to Ink fill with Board text, 200ms; **Active:** `translateY(1px) scale(0.985)`, 140ms.
- **Marker (`.btn-marker`):** Cobalt fill, white text, cobalt ring; hover inverts to Ink.

### Tools (toolbar buttons)
- 44×44px, 6px radius, Surface fill, Line ring. Hover swaps the ring to Ink; active scales to 0.94; `aria-pressed="true"` inverts to Ink fill and Board icon. Icons are Phosphor at 20px. Marker swatches are 18px circles with a 2px Board inset ring and 1.5px Line outer ring; pressed swaps them.

### Panels
- **Corner:** 8px. **Background:** Surface. **Edge:** 1.5px Line ring plus the panel shadow. **Padding:** 20px (24px on `md` for demos). Contain demos, service cards, project cards and the tally. `.hairline` (1.5px Line) divides inside a panel.
- **Peek (`.peek`):** a panel that is also a link lifts 4px on hover or focus-within, swaps its ring to Ink (320ms) and unfolds a `.peek-strip` from `0fr` to `1fr` (420ms) to reveal the project sketch. Title arrow slides 4px and turns cobalt.

### Chips
- `mono` 0.75rem on a 4px radius with `padding: 2px 6px`; Cobalt Wash for reads, Rose Wash for writes. Used inside demo panels only; no filter or selection chips exist.

### Links
- **Ink link (`.ink-link`):** Ink text, no underline, a 2px cobalt stroke that grows left to right from 0 to 100% width on hover, focus, or `aria-current="page"` (320ms ease-out).

### Navigation
- Fixed, 64/72px, on a board-coloured `.nav-scrim` gradient that fades out 28px below. Left: the name in Shantell Sans at 1.25/1.5rem in cobalt (abbreviated to "M. Umer" below `md`). Right: four ink links at 0.875/0.9375rem, weight 500, gap 16/32px. Every internal link is a `TransitionLink` that triggers the eraser and plays `tick` on pointer enter. A "Skip to content" link appears on focus as a cobalt block with white text.

### The Board (signature)
A fixed 28px dot grid (1.2px dots in Grid) behind everything, a full-viewport canvas at `z-index: 5` and a 10px cobalt cursor dot. On fine pointers the cursor follows with `quickTo` (160ms power3.out), scales to 2.2 over interactive elements and 0.6 while drawing. Moving leaves a 350ms trail (4px, 45% alpha); press-drag on non-interactive areas draws a 5px stroke at 95% alpha in the chosen marker (cobalt, rose or graphite), held 3.2s after the pen lifts and faded over 1.4s. `board:clear` wipes all strokes. Elements marked `data-no-draw` opt out.

### Sketch (signature)
A system drawn in marker from data: `SketchDef { w, h, nodes[], edges[], notes[] }`, `SketchNode { id, x, y, w, h, label, sub?, kind?: box | pill | store | human }`, `SketchEdge { from, to, label?, dashed? }`, `SketchNote { x, y, text }`. Nodes render Geist 600 at 13.5px with an optional mono sub-line at 10.5px in Ink 2; edge labels and notes render in Shantell Sans at 12.5–13.5px in cobalt. Every path has `pathLength=1` and the `.draw` class; on entering view (`top 82%`, or `top 120%` when `eager`) a paused timeline draws all strokes over 0.7s (`power2.inOut`, stagger 0.07) and fades labels in over 0.35s from 0.25s. Nodes are draggable and spring back with `elastic.out(1, 0.45)` over 0.9s. `current` and `ghost` light the parts an assembly step is describing (`.part-current` in cobalt, `.part-ghost` at 28% opacity, 320ms).

### Toolbar (signature)
A fixed `.panel` at 10px radius, 6px padding, 8px gap: theme (sun/moon), sound (speaker), a 1px Line divider, three marker swatches, and clear. Theme and marker preferences persist in `localStorage["umer-prefs"]`, default to the system colour scheme, and a `beforeInteractive` boot script sets `data-theme` and `data-marker` before first paint.

### Eraser (page transition, signature)
A fixed board-coloured band clipped with `inset(0 var(--r) 0 var(--l))` and a 22px Line-gradient felt edge. On navigation: Lenis stops, `swoosh` plays, the band covers left to right over 0.55s `power3.inOut`, and only then does the route change and scroll reset. After the new route has painted (two frames), the band reveals left to right over 0.62s `power3.inOut` after an 0.08s hold, then Lenis restarts. A 2.5s safety reveal exists. Reduced motion routes immediately with no band.

### Motion grammar
- **Easing tokens:** `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` for every CSS state change; `--ease-in-out: cubic-bezier(0.83, 0, 0.17, 1)` reserved.
- **Entrances:** `y: 22–26px, opacity: 0 → 1`, 0.9–1s `expo.out`, stagger 0.07–0.09; on scroll via ScrollTrigger at `top 70%`, once.
- **Draw-in:** `stroke-dashoffset` 1 → 0, 0.7s `power2.inOut`, stagger 0.07 (the intro's name stroke 1.1s, stagger 0.12).
- **Counters:** 1.4s `expo.out` with the hairline scaling in from the left over 0.9s `power3.out`.
- **Presses:** transforms in 140ms, colours in 200ms, notes in 260ms, peeks in 320/420ms, theme swap 380ms.
- **Scroll:** Lenis `lerp 0.1`, `smoothWheel`, driving ScrollTrigger from the GSAP ticker with lag smoothing off.

### Sound
Synthesised with the Web Audio API, nothing downloaded, master gain 0.5, off by default, unlocked only by the toolbar gesture. `tick` (sine 1400→900Hz, 60ms) on link and toggle hover; `pop` (triangle 260→520Hz, 140ms) on notes and on switching sound on; `squeak` (band-pass noise, 1500Hz + speed × 1800Hz, Q 9, throttled to one per 70ms) while drawing; `swoosh` (low-pass noise sweep 400→2600→300Hz, 0.58s) on the eraser and on clear.

### Reduced motion
`prefers-reduced-motion: reduce` renders every `.draw` stroke complete, removes the cursor dot and trail, disables drawing, sets transitions on notes, buttons, tools, links, peeks and parts to none, skips Lenis and the eraser, shows counters at their final value, and gives demos a still frame.

## Do's and Don'ts

### Do:
- **Do** put every diagram through `Sketch` from a `SketchDef` so it draws in, drags, springs back and honours reduced motion for free.
- **Do** use cobalt for anything that speaks (numbers, annotations, the link stroke, focus) and rose only for a live or gated moment.
- **Do** end every page with `Close`: the two sticky notes, the CV link, the email as an ink link.
- **Do** set edges as 1.5px inset rings in Line and let hover swap them to Ink; keep radii at 6px (touch) / 8px (pinned).
- **Do** write in first person, British spelling, sentence case, numbers over adjectives; every number comes from the verified CV.
- **Do** mark interactive and dense regions `data-no-draw` so the marker cursor cannot draw over them.

### Don't:
- **Don't** add uppercase, letter-spaced eyebrows or kickers above titles; a hand annotation in Shantell Sans is the world's only label-above-title.
- **Don't** introduce cards with decorative icons, image heroes, floating 3D objects, or decorative gradients; the only gradients are the nav scrim and the eraser's felt edge.
- **Don't** let anything from the next page appear before the eraser has covered the screen.
- **Don't** set Shantell Sans in any colour but the marker, or use it for headings, buttons, body copy or numbers.
- **Don't** recolour sticky-note paper by theme or add a third hue to the board.
- **Don't** ship self-referential filler ("Built with Next.js, GSAP and Lenis") or autoplay sound.
