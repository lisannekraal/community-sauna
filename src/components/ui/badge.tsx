import { colors, typography } from '@/lib/design-tokens';

type BadgeVariant = 'default' | 'inverted' | 'outline' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: `${colors.bgPrimary} ${colors.textInverse}`,
  inverted: `${colors.bgSecondary} ${colors.textPrimary} border-2 ${colors.borderPrimary}`,
  outline: `border-2 ${colors.borderPrimary}`,
  muted: `${colors.bgSubtle} ${colors.textSubtle}`,
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 ${typography.mono.tiny} uppercase tracking-widest ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
