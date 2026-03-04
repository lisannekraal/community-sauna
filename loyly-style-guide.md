# Buurtsauna Löyly — Style Guide

> The public brand identity for Buurtsauna Löyly, the community sauna in Amsterdam Noord.
> This guide complements the internal platform's brutalist black/white aesthetic with warmth, texture and character.

---

## Typography

### Logo Font — Cyrene
Implemented via `@fontsource/cinzel` (classical serif, same antiquity origin as Cyrene).
Use exclusively for the site name "Buurtsauna Löyly" in the header/hero.

```css
font-family: 'Cinzel', serif;
font-weight: 600;
letter-spacing: 0.08em;
```

### Heading Font — Bogart (Fontshare)
Warm editorial serif with personality. Not a Google Font.
Used for section headings, large display text.

```css
font-family: 'Bogart', serif;
font-weight: 600 or 700;
letter-spacing: -0.01em;
```

CSS variable: `--font-loyly-heading`

### Body Font — Satoshi (Fontshare)
Refined grotesque. Friendly and clear. Not a Google Font.
Used for all body text, labels, UI copy.

```css
font-family: 'Satoshi', sans-serif;
font-weight: 400 or 500;
```

CSS variable: `--font-loyly-body`

### Font Scale

| Role          | Size      | Weight | Font     |
|---------------|-----------|--------|----------|
| Logo          | 2.5–5rem  | 600    | Cinzel   |
| Display H1    | 3–4.5rem  | 700    | Bogart   |
| Section H2    | 2–3rem    | 600    | Bogart   |
| Subheading H3 | 1.25rem   | 600    | Satoshi  |
| Body          | 1rem      | 400    | Satoshi  |
| Small/Caption | 0.875rem  | 400    | Satoshi  |
| Label/Tag     | 0.75rem   | 600    | Satoshi  |

---

## Color Palette

Inspired by: charred birch wood, steam and mist, sauna ember glow, birch bark gold, löyly wisps.

| Token                   | Value     | Usage                              |
|-------------------------|-----------|------------------------------------|
| `--loyly-bg`            | `#0d0a07` | Primary dark background            |
| `--loyly-bg-warm`       | `#1c1409` | Alternate dark section background  |
| `--loyly-bg-mid`        | `#2a1f14` | Card/panel dark background         |
| `--loyly-bg-light`      | `#f5ede0` | Light section background (cream)   |
| `--loyly-bg-lighter`    | `#fdf8f0` | Very light cream, forms/cards      |
| `--loyly-text`          | `#f0e4cc` | Primary text on dark               |
| `--loyly-text-muted`    | `#9a7a5a` | Muted/secondary text on dark       |
| `--loyly-text-dark`     | `#1c1409` | Text on light backgrounds          |
| `--loyly-text-mid`      | `#5a4030` | Secondary text on light            |
| `--loyly-fire`          | `#c84a18` | Primary CTA, accent (ember)        |
| `--loyly-fire-hover`    | `#a83c12` | CTA hover state                    |
| `--loyly-steam`         | `#8faa8c` | Accent 2 — löyly steam sage        |
| `--loyly-gold`          | `#c49040` | Accent 3 — birch bark gold         |
| `--loyly-border-dark`   | `rgba(240,228,204,0.12)` | Subtle borders on dark |
| `--loyly-border-light`  | `rgba(28,20,9,0.12)`     | Subtle borders on light |

---

## Buttons

All buttons use Satoshi font, uppercase tracking, and clear state differentiation.

### Primary (Fire)
Used for main CTAs ("Become a member", "Book a session").
```
bg: --loyly-fire  |  text: white  |  border: none
hover: --loyly-fire-hover  |  active: scale(0.98)
disabled: opacity-40, cursor-not-allowed
loading: spinner icon replaces label text
```

### Secondary (Outline Dark)
Used on dark backgrounds for secondary CTAs.
```
bg: transparent  |  text: --loyly-text  |  border: 1px solid --loyly-border-dark
hover: bg --loyly-bg-mid, border --loyly-text  |  active: scale(0.98)
disabled: opacity-40
```

### Secondary (Outline Light)
Used on light backgrounds.
```
bg: transparent  |  text: --loyly-text-dark  |  border: 1px solid --loyly-border-light
hover: bg --loyly-bg-light, border --loyly-text-dark
```

### Ghost
Used for tertiary actions, navigation links.
```
bg: transparent  |  text: --loyly-text-muted
hover: text --loyly-text  |  underline on hover
```

### Button States Summary
- **Default**: Standard appearance above
- **Hover**: Color shift or invert
- **Active**: `transform: scale(0.98)`
- **Focus**: `outline: 2px solid --loyly-gold; outline-offset: 3px`
- **Disabled**: `opacity: 0.4; cursor: not-allowed`
- **Loading**: Spinning circle icon, text hidden, full-width button doesn't shift in size

---

## Spacing

Based on an 8px grid.

| Token | Value |
|-------|-------|
| `--s-1` | 8px  |
| `--s-2` | 16px |
| `--s-3` | 24px |
| `--s-4` | 32px |
| `--s-6` | 48px |
| `--s-8` | 64px |
| `--s-12` | 96px |
| `--s-16` | 128px |

Section vertical padding: `96px–128px` desktop, `64px–80px` mobile.

---

## Decorative Elements

### Steam Wisps
CSS-animated translucent oval elements that drift upward with gentle sway.
Used in the Hero section background. Pure CSS, no JavaScript.

```css
@keyframes steamRise {
  0%   { opacity: 0; transform: translateY(0) scaleX(1) rotate(0deg); }
  30%  { opacity: 0.5; }
  80%  { opacity: 0.15; transform: translateY(-100px) scaleX(1.6) rotate(3deg); }
  100% { opacity: 0; transform: translateY(-150px) scaleX(2) rotate(-2deg); }
}
```

### Borders & Dividers
- Section dividers: 1px solid `--loyly-border-dark` or `--loyly-border-light`
- Card borders: 1px solid (slightly more visible than dividers)
- No box-shadows (matches brutalist internal aesthetic)

### Texture
A subtle SVG noise texture overlay on dark sections at 3–5% opacity adds warmth.

---

## Landing Page Sections

### 1. Hero
- Full-viewport height, dark background (`--loyly-bg`)
- Logo "BUURTSAUNA LÖYLY" in Cinzel
- Tagline in Bogart
- Two CTAs (Primary fire + Secondary outline)
- Steam wisps animation
- Minimal top nav with logo + Login link

### 2. Our Story
- Light cream background
- Side-by-side text + decorative visual
- About Barnaby & Camille, community vision
- Stat tiles (members, hosts, sessions)

### 3. How It Works
- Dark background
- 3-step numbered process
- Icons from iconoir-react

### 4. Memberships
- Light background
- Pricing cards for each plan tier
- Most popular highlighted in fire accent

### 5. Community & Hosts
- Dark background
- About the volunteer host system
- "Become a host" secondary CTA

### 6. Join CTA
- Dark background with ember gradient
- Large heading
- Primary CTA button
- Login link below

---

## Relationship to Internal Design System

| Aspect          | Internal (Brutalist)       | Löyly (Public Brand)            |
|-----------------|----------------------------|---------------------------------|
| Background      | Pure white / pure black    | Warm charcoal + cream           |
| Typography      | Archivo Black, Space Mono  | Cinzel (logo), Bogart, Satoshi  |
| Borders         | 2px solid black            | 1px warm tint or none           |
| Border-radius   | None (0px)                 | 4px for small elements          |
| Color accents   | Black/white binary         | Ember orange, steam sage, gold  |
| Tone            | Raw, functional, DIY       | Warm, inviting, communal        |
