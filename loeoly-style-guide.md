# Buurtsauna Löyly — Style Guide

*The public-facing brand identity for Buurtsauna Löyly, complementing the internal brutalist platform with warmth, character, and community spirit.*

---

## Brand Overview

### Name
**Buurtsauna Löyly** — Amsterdam Noord
*Löyly (Finnish): the sacred steam that rises when water meets the hot stones in a sauna*

### Brand Personality
- Warm, communal, and welcoming
- Rooted in Finnish sauna tradition, grounded in Dutch neighborhood culture
- DIY spirit with editorial confidence
- Accessible to everyone — not elite, not corporate

### Design Direction
Where the internal platform uses a strict black-and-white brutalist aesthetic, the public brand is warmer: deep wood tones, birch cream, amber fire, with editorial serif typography and honest sans-serif body text. The two identities share structural language (borders, sharp geometry, space-mono accents) but differ in palette and emotional temperature.

---

## Color Palette

| Name | Token | Hex | Usage |
|------|-------|-----|-------|
| Dark Wood | `--color-ly-dark` | `#1A1208` | Hero background, footer, dark sections |
| Birch Cream | `--color-ly-cream` | `#F4EDE4` | Light section backgrounds, primary surface |
| Sauna Amber | `--color-ly-amber` | `#C87941` | CTAs, highlights, accents, featured cards |
| Amber Dark | `--color-ly-amber-dark` | `#9B5C28` | Hover state for amber buttons |
| Sauna Stone | `--color-ly-stone` | `#847060` | Muted text, secondary labels, dividers |
| Steam | `--color-ly-steam` | `#EAE4DC` | Alternate light background (softer than cream) |
| Forest | `--color-ly-forest` | `#3D5A4A` | Reserved accent (Finnish forest green) |

### Color System Principles
- **Dark sections** (`bg-ly-dark`): Text in cream (`text-ly-cream`), accents in amber
- **Light sections** (`bg-ly-cream` / `bg-ly-steam`): Text in dark (`text-ly-dark`), muted text in stone
- **Amber sections** (`bg-ly-amber`): Text always in dark (`text-ly-dark`)
- Opacity variants (`/10`, `/20`, `/30`) used for borders and subtle overlays

---

## Typography

### Logo / Wordmark
- **Font family**: `Cyrene` (primary), `Playfair Display` (fallback), `Georgia`, `serif`
- **Tailwind class**: `font-logo`
- **Usage**: LÖYLY wordmark and headline branding
- **Style**: All caps, generous tracking on sub-labels
- **Font file**: `/public/fonts/Cyrene-Regular.otf` (OTF format)
- *Cyrene was chosen from the required list (Oughter / Devina Garden / Ferron / Cyrene / Ragika) for its ancient, timeless quality — fitting the sacred nature of löyly*

### Heading / Editorial
- **Font family**: `Playfair Display` (self-hosted via `@fontsource/playfair-display`)
- **Tailwind class**: `font-heading-ly`
- **Weights used**: 400 (regular), 400 italic, 600, 700, 800
- **Usage**: Section headings, pull quotes, editorial text, pricing numbers
- **Style**: Mixed case, italic for emphasis, generous leading (`leading-tight` to `leading-relaxed`)
- *Playfair Display is self-hosted (not loaded from Google CDN) — warm, editorial serif with high contrast strokes that evoke quality craftsmanship*

### Body Text
- **Font family**: `Space Grotesk` (shared with internal platform)
- **Tailwind class**: `font-sans` (existing)
- **Usage**: Paragraphs, descriptions, general copy
- **Note**: Intentional continuity with internal platform typography

### Labels / Technical Elements
- **Font family**: `Space Mono` (shared with internal platform)
- **Tailwind class**: `font-mono` (existing)
- **Usage**: Section labels, step numbers, price sub-labels, navigation items, uppercase tracking labels
- **Style**: Always uppercase, `tracking-wider` or `tracking-[0.4em]`, small sizes (10–12px)

### Typography Scale
| Element | Font | Size | Style |
|---------|------|------|-------|
| Hero logo | `font-logo` | `clamp(4rem, 15vw, 12rem)` | Uppercase |
| Hero tagline | `font-heading-ly` | `text-xl md:text-2xl` | Italic |
| Section heading | `font-heading-ly` | `text-4xl md:text-5xl` | Normal |
| Card title | `font-heading-ly` | `text-xl` | Normal |
| Price display | `font-heading-ly` | `text-4xl` | Normal |
| Body paragraph | `font-sans` | `text-base` | Normal |
| Section label | `font-mono` | `text-xs` | Uppercase, wide tracking |
| Step number | `font-mono` | `text-xs` | — |
| Button text | `font-mono` | `text-xs md:text-sm` | Uppercase, `tracking-wider` |

---

## Buttons

### Primary Button (Amber)
```
bg-ly-amber text-ly-dark font-mono text-sm uppercase tracking-wider
hover:bg-ly-amber-dark transition-colors
px-8 py-4
```
*Use for primary CTAs: "Join the community", "Start membership"*

### Secondary Button (Outline on Dark)
```
border border-ly-cream/30 text-ly-cream font-mono text-sm uppercase tracking-wider
hover:bg-ly-cream/10 transition-colors
px-8 py-4
```
*Use on dark backgrounds: "Our story", secondary navigation actions*

### Secondary Button (Outline on Light)
```
border-2 border-ly-dark text-ly-dark font-mono text-sm uppercase tracking-wider
hover:bg-ly-dark hover:text-ly-cream transition-colors
px-8 py-4
```
*Use on cream/steam backgrounds: "View the schedule", "Book now"*

### Card CTA (Amber)
```
block text-center px-4 py-3 bg-ly-amber text-ly-dark
font-mono text-xs uppercase tracking-wider
hover:bg-ly-amber-dark transition-colors
```
*Use on featured/popular membership cards*

### Card CTA (Outline)
```
block text-center px-4 py-3 border border-ly-dark text-ly-dark
font-mono text-xs uppercase tracking-wider
hover:bg-ly-dark hover:text-ly-cream transition-colors
```
*Use on standard membership cards*

### Button States
| State | Appearance |
|-------|------------|
| Default | As described above |
| Hover | Darkened or inverted (per variant) |
| Active | Same as hover |
| Disabled | `opacity-50 cursor-not-allowed` |
| Loading | Add spinner icon, `opacity-70`, no hover effect |

---

## Spacing & Layout

### Section Padding
- Vertical: `py-24` (standard sections)
- Horizontal: `px-6` (sections), `px-4` (cards)
- Max width container: `max-w-6xl mx-auto`

### Grid Patterns
- **2-column** (story, etc.): `grid grid-cols-1 lg:grid-cols-2 gap-16`
- **4-column** (features, steps, cards): `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0` with border dividers
- **4 membership cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`

### Dividers
- Thick amber accent: `w-12 h-0.5 bg-ly-amber` (under headings)
- Thin stone rule: `border-b border-ly-stone/20`
- Horizontal rule with label: thin line + centered font-mono label

---

## Borders & Geometry

Inherits the internal platform's sharp border language:
- **Card borders**: `border border-ly-stone/30` (default), `border border-ly-amber` (featured)
- **Featured highlight**: absolute positioned label tag `-top-3 left-6 bg-ly-amber px-3 py-1`
- **Step indicators**: `w-8 h-8 border border-ly-amber` square with number inside
- **No border-radius** — maintains consistency with internal platform's no-radius principle
- Decorative rings: `rounded-full border border-ly-amber/10` for hero background atmosphere

---

## Navigation (Landing Page)

Fixed top nav on public landing page (distinct from internal AppShell):
```
bg-ly-dark/95 backdrop-blur-sm
Fixed, full-width, z-50
Logo: font-logo text-ly-cream text-xl tracking-widest uppercase
Links: font-mono text-xs uppercase tracking-wider text-ly-cream/70 → text-ly-cream
Login button: bordered pill variant in ly-cream
```

---

## Component Inventory (Landing Page)

| # | Component | Section | Background |
|---|-----------|---------|------------|
| 1 | Hero | Full-screen hero with logo, tagline, CTAs | `bg-ly-dark` |
| 2 | Story | Two-column editorial section | `bg-ly-cream` |
| 3 | Löyly Definition + Feature grid | Brand explanation + 4-col features | `bg-ly-dark` |
| 4 | How it works | 4-step numbered process | `bg-ly-steam` |
| 5 | Membership tiers | 4 pricing cards | `bg-ly-cream` |
| 6 | Join CTA | Full-width conversion section | `bg-ly-amber` |
| 7 | Footer | Address, nav, brand | `bg-ly-dark` |

---

## Section Rhythm

The page alternates between dark and light backgrounds:
`Dark → Light → Dark → Light → Light → Amber → Dark`

This creates visual breathing room and natural scroll momentum. Amber is reserved for the final CTA, giving it maximum impact.

---

## Decorative Elements

### Hero Background Texture
Subtle repeating gradient lines at 5% opacity — evokes wood grain or sauna slats.

### Concentric Rings
Two large `rounded-full` rings centered in hero using `border-ly-amber/10` — evoke warmth radiating outward.

### Scroll Indicator
Animated bounce with `font-mono` "SCROLL" label + gradient-faded vertical line.

### Amber Accent Dash
`—` (em-dash) in amber used as list bullet and decorative inline marker.

### Section Label Pattern
```
— Label text
```
Small `font-mono uppercase tracking-[0.4em] text-ly-stone/amber` followed by large heading — consistent across all sections.

---

## Relationship to Internal Platform

| Aspect | Public Brand (Löyly) | Internal Platform |
|--------|---------------------|-------------------|
| Background | Warm cream / dark brown | White / black |
| Accent | Amber `#C87941` | Black |
| Heading font | Playfair Display + Cyrene | Archivo Black |
| Body font | Space Grotesk (shared) | Space Grotesk |
| Label font | Space Mono (shared) | Space Mono |
| Border radius | None (strict) | None (strict, except rounded-full) |
| Border weight | `border` (1px) / `border-2` | `border-2` |
| Language | English + Finnish/Dutch words | English |

---

## Fonts to Install

```bash
# Already installed (shared with internal):
@fontsource/space-grotesk
@fontsource/space-mono
@fontsource/archivo-black

# New for Löyly brand:
@fontsource/playfair-display   # npm install @fontsource/playfair-display

# Manual (already in /public/fonts/):
Cyrene-Regular.otf             # Cyrene Regular
```

---

*Style guide version 1.0 — Buurtsauna Löyly, 2024*
