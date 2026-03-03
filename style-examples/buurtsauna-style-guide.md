# Buurtsauna Löyly — Style Guide

> The visual identity for the public-facing landing page of Buurtsauna Löyly.
> This style is **distinct from** the internal booking platform's brutalist black/white identity — but deliberately adjacent to it.

---

## Brand Positioning

Buurtsauna Löyly is a community-owned neighbourhood sauna in Amsterdam Noord, run by volunteers from the van der Pekbuurt. The visual identity should feel:

- **Warm** — earthy, wood-fire colours, not cold or corporate
- **Artisanal** — hand-crafted, community-made, not polished tech-startup
- **Inclusive** — inviting to all neighbours, accessible pricing reflected in the design tone
- **Nordic** — Finnish sauna tradition, spare and purposeful aesthetics
- **Real** — the story is genuine; the design should not be over-designed

---

## Logo

**Font choice: Ragika**
Chosen from the shortlist (Oughter, Devina Garden, Ferron, Cyrene, **Ragika**) for its warm, slightly organic display character that balances handcrafted warmth with legibility.

**Usage:**
- Display the brand name as two stacked lines: `Buurtsauna` (in cream/white) + `Löyly` (in ember orange)
- Always uppercase
- Never scale below 2rem in any context
- The Ragika font file must be placed at `/public/fonts/ragika.woff2` (download from fontsquirrel.com or similar). Cinzel is used as the system fallback.

**CSS class:** `font-loly-logo`
**CSS variable:** `--font-loly-logo: 'Ragika', 'Cinzel', Georgia, serif`

---

## Typography

### Header Font — Cinzel
A classical Roman display serif by Natanael Gama. Self-hosted via `@fontsource/cinzel`. Not served from Google CDN.

Cinzel's letterforms evoke carved stone inscriptions — appropriate for a brand with Nordic/Finnish gravity and permanence. It reads as both timeless and artisanal.

- **Weights installed:** 400 (regular), 700 (bold)
- **Usage:** Section headings, labels, button text, all-caps navigation elements
- **Always uppercase** with generous letter-spacing (`tracking-[0.2em]` to `tracking-widest`)
- **CSS class:** `font-loly-heading`
- **CSS variable:** `--font-loly-heading: 'Cinzel', Georgia, serif`

### Body/Text Font — Lora
A warm humanist serif by Cyreal. Self-hosted via `@fontsource/lora`. Not served from Google CDN.

Lora's slightly calligraphic quality suits the storytelling nature of the brand — block quotes, community narrative, descriptive copy.

- **Weights installed:** 400 (regular), 400 italic, 700 (bold)
- **Usage:** Body paragraphs, descriptions, quotes, subtitles
- **Italic is used** for taglines and block quotes
- **CSS class:** `font-loly-body`
- **CSS variable:** `--font-loly-body: 'Lora', Georgia, serif`

### Internal App Fonts (not for landing page)
- **Archivo Black** (`font-display`) — app headings
- **Space Mono** (`font-mono`) — technical elements
- **Space Grotesk** (`font-sans`) — app body text

---

## Colour Palette

All colours are defined as CSS custom properties in `:root` and exposed as Tailwind utility classes via `@theme inline`.

| Name        | Variable              | Hex       | Tailwind class       | Usage                                    |
|-------------|-----------------------|-----------|----------------------|------------------------------------------|
| Cream       | `--loly-cream`        | `#F4EDE2` | `bg/text-loly-cream` | Primary light background                 |
| Steam       | `--loly-steam`        | `#FDFAF6` | `bg/text-loly-steam` | Near-white, elevated surfaces            |
| Birch       | `--loly-birch`        | `#D9C4A8` | `bg/text-loly-birch` | Borders, subtle elements, warm grey      |
| Wood        | `--loly-wood`         | `#2C1A0E` | `bg/text-loly-wood`  | Primary dark (text, dark sections)       |
| Ember       | `--loly-ember`        | `#C4612A` | `bg/text-loly-ember` | **Primary accent** — CTAs, highlights    |
| Ember Dark  | `--loly-ember-dark`   | `#A04E22` | `bg/text-loly-ember-dark` | Ember hover/active state            |
| Stone       | `--loly-stone`        | `#7A6960` | `bg/text-loly-stone` | Muted text, secondary copy               |
| Moss        | `--loly-moss`         | `#3A5A37` | `bg/text-loly-moss`  | Reserved accent (future use)             |

### Section Background Rhythm

The landing page alternates section backgrounds for visual rhythm:

```
Hero          → bg-loly-wood (darkest)
Het Verhaal   → bg-loly-cream (warm light)
De Ervaring   → bg-loly-steam (near white)
Sessies       → bg-loly-wood (dark again)
Lidmaatschap  → bg-loly-cream (warm light)
Meedoen       → bg-loly-ember (accent colour)
```

---

## Spacing & Layout

- **Max content width:** `max-w-5xl` (64rem) for main content, `max-w-3xl` for centered CTA sections
- **Section padding:** `py-24 px-6` (top/bottom 6rem, sides 1.5rem)
- **Grid gaps:** `gap-5` to `gap-12` depending on section
- **No border-radius** on blocks/cards (connects to brutalist parent style)
- `rounded-full` only for the loading spinner

---

## Borders

Borders are a key design motif (inherited from the brutalist internal site):

| Border type       | Class                      | Usage                         |
|-------------------|----------------------------|-------------------------------|
| Subtle / birch    | `border-2 border-loly-birch` | Cards, info blocks, inputs  |
| Strong / wood     | `border-2 border-loly-wood`  | Secondary buttons, dividers |
| Accent / ember    | `border-2 border-loly-ember` | Featured cards, focus states|
| Light / ghost     | `border border-loly-birch/25`| Session tiles on dark bg    |

---

## Button System

All button text uses `font-loly-heading` uppercase with letter-spacing. Transitions use `transition-all` and active states scale down with `active:scale-95` for tactile feedback.

### Primary (Ember)
```html
bg-loly-ember text-white border-2 border-loly-ember
hover:bg-loly-ember-dark hover:border-loly-ember-dark
active:scale-95 transition-all
px-7 py-3 font-loly-heading uppercase tracking-wider text-sm
```
**Use for:** main CTAs, featured pricing sign-up, hero actions

### Secondary (Outlined on dark bg)
```html
bg-transparent text-loly-cream border-2 border-loly-cream
hover:bg-loly-cream hover:text-loly-wood
active:scale-95 transition-all
px-7 py-3 font-loly-heading uppercase tracking-wider text-sm
```
**Use for:** secondary hero action, alternative CTAs on dark sections

### Outlined (on light bg)
```html
bg-transparent text-loly-wood border-2 border-loly-wood
hover:bg-loly-wood hover:text-loly-cream
active:scale-95 transition-all
px-7 py-3 font-loly-heading uppercase tracking-wider text-sm
```
**Use for:** pricing card sign-up, standard actions on light backgrounds

### Accent (Ember outline)
```html
bg-transparent text-loly-ember border-2 border-loly-ember
hover:bg-loly-ember hover:text-white
active:scale-95 transition-all
px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs
```
**Use for:** small accent actions, inline callouts

### Disabled
```html
bg-loly-birch/50 text-loly-stone border-2 border-loly-birch
cursor-not-allowed opacity-60
px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs
```
**Attribute:** always add `disabled` HTML attribute

### Loading
```html
inline-flex items-center gap-2
bg-loly-ember/70 text-white border-2 border-loly-ember/70
cursor-wait opacity-80
px-5 py-2.5 font-loly-heading uppercase tracking-wider text-xs
```
Spinner: `<span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />`
**Attribute:** always add `disabled` HTML attribute when loading

### Inverted (for ember section)
```html
bg-white text-loly-ember border-2 border-white
hover:bg-loly-cream hover:border-loly-cream
active:scale-95 transition-all
px-9 py-3.5 font-loly-heading uppercase tracking-wider text-sm
```

---

## Icons

Library: **iconoir-react** (consistent with internal app)

| Icon          | Usage                          |
|---------------|--------------------------------|
| `FireFlame`   | Authentic Finnish sauna feature|
| `Group`       | Community feature              |
| `Heart`       | Welcoming for all feature      |
| `Leaf`        | Volunteer hosting feature      |
| `Clock`       | Session duration               |
| `MapPin`      | Location                       |
| `ArrowRight`  | CTA links, navigation          |
| `Community`   | Community story block          |

Icon stroke width for landing page: `strokeWidth={1.5}` (slightly lighter than internal app's nav icons)

---

## Landing Page Sections

The landing page contains 6 sections:

| # | Section          | Background      | Key components                          |
|---|------------------|-----------------|-----------------------------------------|
| 1 | **Hero**         | `loly-wood`     | Logo, tagline, Primary + Secondary CTA  |
| 2 | **Het Verhaal**  | `loly-cream`    | Pull quote, 3 info blocks, story copy   |
| 3 | **De Ervaring**  | `loly-steam`    | 4 feature cards with icons              |
| 4 | **Sessies**      | `loly-wood`     | 4 mock session tiles, schedule CTA      |
| 5 | **Lidmaatschap** | `loly-cream`    | Button showcase, 4 pricing cards        |
| 6 | **Meedoen**      | `loly-ember`    | Final CTA, location, Löyly explanation  |

---

## Design Principles

1. **Warmth over polish** — earthy colours, serif fonts, imperfect authenticity over tech-startup clean
2. **Typography as decoration** — the large logo and section headers are themselves design elements
3. **Borders everywhere** — inherited from brutalist parent; borders ground the components
4. **Contrast rhythm** — alternating dark/light/dark sections keep the page dynamic
5. **Dutch language** — the landing page speaks to local Amsterdam Noord residents in Dutch
6. **Complementary to internal app** — same border system, no border-radius (except spinners), same iconoir library; fonts and colours differ

---

## Files

| Path                                         | Purpose                              |
|----------------------------------------------|--------------------------------------|
| `src/app/globals.css`                        | Font-face, CSS vars, @theme colours  |
| `src/app/layout.tsx`                         | Cinzel + Lora fontsource imports     |
| `src/components/landing/landing-page.tsx`    | Full landing page component          |
| `src/app/(main)/page.tsx`                    | Renders LandingPage for guests       |
| `public/fonts/ragika.woff2`                  | **Must be added manually** (see note)|

### Font file note
The Ragika logo font requires a manual step: download the `.woff2` file and place it at `public/fonts/ragika.woff2`. Until then, the brand name renders in **Cinzel** (a graceful fallback with a similar weight and classical character).
