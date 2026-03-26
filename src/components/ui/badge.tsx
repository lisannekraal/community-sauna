import { colors, typography } from '@/lib/design-tokens';

type BadgeVariant = 'default' | 'inverted' | 'outline' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-forest-green text-paper',
  inverted: `${colors.bgPrimary} ${colors.textPrimary} border ${colors.borderPrimary}`,
  outline: 'border border-deep-crimson text-deep-crimson',
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
