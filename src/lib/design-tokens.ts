// Design tokens for the brutalist UI system.
// Import from here instead of repeating raw Tailwind classes across components.

// --- Colors (class strings) ---

export const colors = {
  // Backgrounds
  bgPrimary: 'bg-ink',
  bgSecondary: 'bg-paper',
  bgSubtle: 'bg-timber/10',
  bgDisabled: 'bg-ash/30',
  bgOverlay: 'bg-ink/60',

  // Text
  textPrimary: 'text-ink',
  textInverse: 'text-paper',
  textMuted: 'text-timber',
  textSubtle: 'text-timber',
  textDisabled: 'text-ash',
  textError: 'text-red-600',

  // Borders
  borderPrimary: 'border-ink',
  borderSubtle: 'border-ink/10',
  borderDisabled: 'border-ash/60',
  borderError: 'border-red-600',
} as const;

// --- Icon sizes (numeric values for component props) ---

export const icons = {
  nav: { size: 20, strokeWidth: 1.5 },
  navSmall: { size: 18, strokeWidth: 1.5 },
  navMobile: { size: 22, strokeWidth: 1.5 },
  action: { size: 16, strokeWidth: 1.5 },
  strokeActive: 2,
} as const;

// --- Interactive state patterns ---

export const interactive = {
  transition: 'transition-colors',
  hoverInvert: 'hover:bg-ink hover:text-paper',
  link: 'underline hover:no-underline',
  cursorPointer: 'cursor-pointer',
  cursorDisabled: 'cursor-not-allowed',
} as const;

// --- Nav item styles ---

export const nav = {
  activeState: 'bg-ink text-paper',
  item: {
    main: 'flex items-center gap-3 px-3 py-2.5 transition-colors',
    secondary: 'flex items-center gap-3 px-3 py-2 transition-colors',
    tab: 'flex flex-col items-center gap-0.5 pt-2.5 pb-2',
    tabLabel: 'text-[11px] tracking-wide',
  },
  text: {
    main: 'text-[15px]',
    secondary: 'text-[13px]',
  },
} as const;

// --- Typography patterns ---

export const typography = {
  mono: {
    label: 'font-mono text-xs uppercase tracking-wider',
    caption: 'font-mono text-sm',
    tiny: 'font-mono text-[10px]',
  },
  display: {
    heading: 'font-display',
  },
} as const;

// --- Button patterns ---

export const buttons = {
  base: 'w-full border p-3 font-mono text-sm uppercase tracking-wider transition-colors cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1',
  primary: 'bg-ember text-ink border-ember hover:bg-ember-dark focus:ring-ember disabled:bg-ash/50 disabled:border-ash/50 disabled:text-ash',
  secondary: 'bg-ink text-paper border-ink hover:bg-ink-hover focus:ring-ink disabled:bg-ash/30 disabled:border-ash/30 disabled:text-ash',
  // Landing-style inline CTAs — two types only, both solid-fill (no transparent/outline-only)
  cta: 'inline-flex items-center gap-2 border px-8 py-4 font-mono text-sm uppercase tracking-wider transition-colors',
  ctaPrimary: 'border-ember bg-ember text-ink hover:bg-ember-dark',
  ctaSecondary: 'border-ink bg-ink text-paper hover:bg-ink-hover',
  ctaOnDark: 'border-ember bg-ember text-ink hover:bg-ember-dark',
  ctaSmall: 'inline-flex items-center gap-2 border border-ink bg-ink text-paper px-6 py-3 font-mono text-[11px] uppercase tracking-wider hover:bg-ink-hover transition-colors',
  panel: 'border border-ink px-4 py-3 font-display text-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  panelPrimary: 'bg-ember text-ink hover:bg-ember-dark',
  panelSecondary: 'hover:bg-ink hover:text-paper',
  textAction: 'text-[12px] tracking-wide cursor-pointer',
} as const;

// --- Input patterns ---

export const inputs = {
  base: 'w-full border p-2 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-1',
  label: 'block font-medium mb-1',
  hint: 'text-sm text-timber mt-1',
  error: 'text-sm text-red-600 mt-1',
  requiredMark: 'text-red-600 ml-1',
} as const;

// --- Feedback patterns ---

export const feedback = {
  errorBox: 'border border-red-600 bg-red-50 px-4 py-2',
  errorText: 'font-mono text-sm text-red-600',
  alertError: 'border border-red-600 bg-red-50 p-4 text-red-600',
  alertSuccess: 'border border-timber/50 bg-timber/10 p-4 text-timber',
} as const;

// --- Section patterns ---

export const sections = {
  divider: `border-b ${colors.borderSubtle}`,
} as const;

// --- Animation ---

export const animation = {
  fadeIn: 'animate-[fadeIn_150ms_ease-out]',
  slideUp: 'animate-[slideUp_200ms_ease-out]',
  scaleIn: 'animate-[scaleIn_150ms_ease-out]',
} as const;
