'use client';

import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading = false, loadingText, children, disabled, className = '', ...props }, ref) => {
    const baseStyles = 'w-full p-3 font-medium border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors';

    const variantStyles = {
      primary: 'bg-black text-white border-black hover:bg-gray-800 focus:ring-black disabled:bg-gray-400 disabled:border-gray-400',
      secondary: 'bg-white text-black border-black hover:bg-gray-100 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {loading ? (loadingText || 'Loading...') : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
