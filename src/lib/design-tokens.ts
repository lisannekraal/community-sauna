// Design tokens for the brutalist UI system.
// Import from here instead of repeating raw Tailwind classes across components.

// --- Colors (class strings) ---

export const colors = {
  // Backgrounds
  bgPrimary: 'bg-black',
  bgSecondary: 'bg-white',
  bgSubtle: 'bg-gray-100',
  bgDisabled: 'bg-gray-200',
  bgOverlay: 'bg-black/60',

  // Text
  textPrimary: 'text-black',
  textInverse: 'text-white',
  textMuted: 'text-black/50',
  textSubtle: 'text-gray-600',
  textDisabled: 'text-gray-400',
  textError: 'text-red-600',

  // Borders
  borderPrimary: 'border-black',
  borderSubtle: 'border-black/10',
  borderDisabled: 'border-gray-300',
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
  hoverInvert: 'hover:bg-black hover:text-white',
  link: 'underline hover:no-underline',
  cursorPointer: 'cursor-pointer',
  cursorDisabled: 'cursor-not-allowed',
} as const;

// --- Nav item styles ---

export const nav = {
  activeState: 'bg-black text-white',
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
    heading: 'font-display uppercase',
  },
} as const;

// --- Button patterns ---

export const buttons = {
  base: 'w-full border-2 p-3 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1',
  primary: 'bg-black text-white border-black hover:bg-gray-800 focus:ring-black disabled:bg-gray-400 disabled:border-gray-400',
  secondary: 'bg-white text-black border-black hover:bg-gray-100 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400',
  panel: 'border-2 border-black px-4 py-3 font-display uppercase text-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  panelPrimary: 'bg-black text-white hover:bg-gray-800',
  panelSecondary: 'hover:bg-black hover:text-white',
  textAction: 'text-[12px] tracking-wide cursor-pointer',
} as const;

// --- Input patterns ---

export const inputs = {
  base: 'w-full border-2 p-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1',
  label: 'block font-medium mb-1',
  hint: 'text-sm text-gray-600 mt-1',
  error: 'text-sm text-red-600 mt-1',
  requiredMark: 'text-red-600 ml-1',
} as const;

// --- Feedback patterns ---

export const feedback = {
  errorBox: 'border-2 border-red-600 bg-red-50 px-4 py-2',
  errorText: 'font-mono text-sm text-red-600',
  alertError: 'border-2 border-red-600 bg-red-50 p-4 text-red-600',
  alertSuccess: 'border-2 border-green-600 bg-green-50 p-4 text-green-800',
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
