'use client';

import { forwardRef } from 'react';
import { buttons } from '@/lib/design-tokens';

type ButtonVariant = 'primary' | 'secondary' | 'panel-primary' | 'panel-secondary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
}

const variantConfig: Record<ButtonVariant, { base: string; style: string }> = {
  primary: { base: buttons.base, style: buttons.primary },
  secondary: { base: buttons.base, style: buttons.secondary },
  'panel-primary': { base: buttons.panel, style: buttons.panelPrimary },
  'panel-secondary': { base: buttons.panel, style: buttons.panelSecondary },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading = false, loadingText, children, disabled, className = '', ...props }, ref) => {
    const { base, style } = variantConfig[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${style} ${className}`}
        {...props}
      >
        {loading ? (loadingText || 'Loading...') : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
