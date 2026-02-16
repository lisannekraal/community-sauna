'use client';

import { forwardRef } from 'react';
import { buttons } from '@/lib/design-tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading = false, loadingText, children, disabled, className = '', ...props }, ref) => {
    const variantStyles = {
      primary: buttons.primary,
      secondary: buttons.secondary,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${buttons.base} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {loading ? (loadingText || 'Loading...') : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
