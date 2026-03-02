## Buurtsauna Löyly – UI Concept 1 Style Guide

### 1. Brand & Tone

- **Name**: Buurtsauna Löyly  
- **Essence**: DIY neighborhood sauna – warm, social, a bit rough around the edges but trustworthy and well-organised.  
- **Tone of voice**: Clear, friendly, no jargon, short sentences. First person plural where it fits (“we”, “our sauna”).  
- **Visual attitude**: Brutalist, no-frills, high contrast, minimal decoration. Everything feels like it could be printed on a flyer and taped to a community notice board.

### 2. Typography

We reuse the core project fonts (already wired up in `design-tokens.ts`) and layer the Löyly identity on top.

- **Logo wordmark**:  
  - **Font**: *Ragika* (or similar from the list: Oughter / Devina Garden / Ferron / Cyrene / Ragika).  
  - **Usage**: Only for the “Buurtsauna Löyly” logo in hero/header (treat as a graphic/wordmark, not body font).  
- **Display headings** (H1–H2 hero, key section titles):  
  - **Font**: `font-display` (Archivo Black), uppercase.  
  - **Example classes**: `font-display uppercase tracking-wide` + size (`text-4xl`–`text-5xl` mobile, `text-6xl` desktop).  
- **Section headings / subheads**:  
  - **Font**: `font-display` or `font-sans` depending on visual weight.  
  - **Example classes**: `font-display uppercase text-xl` or `font-sans text-xl font-semibold`.  
- **Body text**:  
  - **Font**: `font-sans` (Space Grotesk).  
  - **Example classes**: `text-base leading-relaxed` + `colors.textPrimary` or `colors.textSubtle`.  
- **Technical / meta elements** (steps, labels, small details):  
  - **Font**: `font-mono` (Space Mono).  
  - **Use tokens**: `typography.mono.label`, `typography.mono.caption`, `typography.mono.tiny`.

### 3. Color System

We stay very close to the brutalist black/white system and add one warm accent for “heat”.

- **Base colors** (from `colors` design tokens):  
  - **Background primary**: `colors.bgSecondary` (`bg-white`) – main landing page background.  
  - **Background emphasis blocks**: `colors.bgSubtle` (`bg-gray-100`) for sections and cards.  
  - **Text primary**: `colors.textPrimary` (`text-black`).  
  - **Text subtle**: `colors.textSubtle` (`text-gray-600`) for supporting copy.  
  - **Borders**: `border-2` + `colors.borderPrimary` for most component outlines.  
- **Disabled states**:  
  - **Background**: `colors.bgDisabled` (`bg-gray-200`).  
  - **Text**: `colors.textDisabled` (`text-gray-400`).  
  - **Border**: `colors.borderDisabled`.  
- **Status colors**:  
  - **Error**: `colors.textError` / `colors.borderError`, or `feedback.errorBox` / `feedback.alertError`.  
  - **Success** (for confirmation banners): `feedback.alertSuccess`.  
- **Accent color (conceptual)**:  
  - A warm sauna accent (e.g. muted orange/clay) can appear in illustrations or images, not as a separate Tailwind token for now. The UI chrome stays mostly black/white/gray.

### 4. Buttons & Interactive States

We build all buttons on top of `buttons` and `interactive` tokens and always keep **`border-2` and sharp corners** (no radius).

- **Primary button**  
  - **Purpose**: Main action in a section (e.g. “Book your first session”).  
  - **Base classes**: `buttons.base buttons.primary`.  
  - **States**:  
    - **Default**: Black background, white text (`bg-black text-white border-black`).  
    - **Hover**: Slightly lighter black (`hover:bg-gray-800`) + `interactive.transition`.  
    - **Active**: Same as hover, optionally add `translate-y-[1px]` for click feedback.  
    - **Disabled**: `disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed`.  
    - **Loading**: Use primary style with inline spinner/text like “Loading…” in `font-mono` small.

- **Secondary button**  
  - **Purpose**: Alternate or lower priority CTA (e.g. “Learn more about memberships”).  
  - **Base classes**: `buttons.base buttons.secondary`.  
  - **States**:  
    - **Default**: White background, black text, black border.  
    - **Hover**: `hover:bg-gray-100`.  
    - **Disabled**: `disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300`.

- **Panel buttons (hero / big CTAs)**  
  - **Purpose**: Large, loud CTAs in hero and schedule teaser.  
  - **Primary variant**: `buttons.panel buttons.panelPrimary`.  
  - **Secondary variant**: `buttons.panel buttons.panelSecondary`.  

- **Text links & inline actions**  
  - **Base**: `interactive.link` (underline, remove underline on hover).  
  - **Use cases**: “Already a member? Log in”, subtle navigation links.  

- **General interaction rules**  
  - Always include `interactive.transition` for color state changes.  
  - Do not use drop-shadows or rounded corners, except allowed `rounded-full` for very specific elements (not used on this landing yet).

### 5. Layout & Grid

- **Page container**:  
  - **Max width**: `max-w-6xl mx-auto`.  
  - **Padding**: `px-4 py-10` (mobile), `md:px-6 lg:px-8`.  
- **Section spacing**:  
  - Vertical rhythm: `py-10` or `py-12`, separated with `sections.divider` when needed.  
- **Cards / blocks**:  
  - `bg-gray-100 border-2 border-black p-4 md:p-6`.  
  - Content stacked vertically with small gaps (`space-y-2` / `space-y-3`).  
- **Responsive grid**:  
  - Use `grid grid-cols-1 md:grid-cols-2` or `md:grid-cols-3` for membership and info blocks.  
  - Avoid overly complex layouts; keep stacks and simple grids.

### 6. Landing Page Sections & Components (for `/` when logged out)

The public landing for guests should include **at least five sections** that together tell the story and exercise the design system.

- **1. Hero – “Neighborhood sauna for everyone”**  
  - Centered or left-aligned block.  
  - Contains:  
    - Logo wordmark “Buurtsauna Löyly” (Ragika-style logo, rendered as text for now).  
    - H1 in `font-display` uppercase.  
    - Short intro sentence referencing the vision from the crowdfunding text.  
    - Primary CTA button: “Book your first session”.  
    - Secondary CTA: “Learn about memberships” (link or secondary button).  

- **2. Story & Vision section**  
  - Two-column on desktop (text + supporting list or highlight card), stacked on mobile.  
  - Content:  
    - Short “Who we are” summary (Barnaby & Camille, community sauna in Amsterdam Noord).  
    - Bullet list for “Why a neighborhood sauna?” emphasising accessibility & community.  

- **3. “How it works” steps**  
  - 3–4 step cards in a grid: “Join”, “Book”, “Sauna”, “Belong”.  
  - Each step card uses mono label (`typography.mono.label`) and small body text.  
  - One card shows a **disabled** button to demonstrate disabled style.  

- **4. Membership & pricing snapshot**  
  - Simple table or card grid showing a subset of membership types (e.g. Trial, 4/month, Unlimited, Punch card).  
  - Each card has: name, short description, price, “Credits” line, and a secondary CTA (e.g. “View all plans”).  
  - Uses cards with `border-2`, no radius, black/white only.  

- **5. Schedule teaser & CTA**  
  - Block that hints at the internal week view schedule (e.g. simplified list of “This week at Löyly”).  
  - Includes: text description + primary CTA “View schedule” (to `/schedule` or `/login` depending on auth).  
  - Demonstrates link style and primary button in one place.

- **6. Community & footer strip** (can be merged into a single section)  
  - Short text about volunteers/hosts and inclusive sessions (ties to crowdfunding copy).  
  - Inline links for “Host a session” or “Get in touch”.  
  - Simple footer-style line with address or placeholder location text.

### 7. Accessibility & Interaction Guidelines

- **Contrast**: Always maintain strong contrast (black on white or white on black). Avoid light gray text on white for essential copy.  
- **Focus states**: Use the existing `focus:ring-*` styles from `buttons` and `inputs` (e.g. `focus:ring-black focus:ring-offset-1`).  
- **Hit areas**: Minimum `h-10` for buttons and important CTAs.  
- **Keyboard**: All interactive elements must be focusable and activatable via keyboard (`button` / `a` with `href`).

### 8. Implementation Notes for `/src/app/(main)/page.tsx`

- Only guests (no session) see the full landing layout described above.  
- Signed-in users keep the current “internal dashboard” style home.  
- Use the existing design tokens (`colors`, `buttons`, `typography`, `interactive`, `sections`) wherever possible; avoid raw Tailwind for colors and borders unless it is a one-off layout utility.  
- Keep the **brutalist** rules: black/white palette, `border-2` outlines, no generic gradients, minimal decoration, and no rounded corners except explicit `rounded-full` where conceptually needed (not required for this page).

