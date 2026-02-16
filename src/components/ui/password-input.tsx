'use client';

import { forwardRef, useState } from 'react';
import { inputs, colors } from '@/lib/design-tokens';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  hint?: string;
  showStrength?: boolean;
}

function getPasswordStrength(password: string): { label: string; color: string } {
  if (!password) return { label: '', color: '' };

  let score = 0;

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: colors.textError };
  if (score <= 4) return { label: 'Medium', color: 'text-yellow-600' };
  return { label: 'Strong', color: 'text-green-600' };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, required, showStrength = false, className = '', id, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;

    const strength = showStrength && typeof value === 'string' ? getPasswordStrength(value) : null;

    return (
      <div>
        <label htmlFor={inputId} className={inputs.label}>
          {label}
          {required && <span className={inputs.requiredMark}>*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            required={required}
            value={value}
            className={`${inputs.base} pr-12 ${
              error ? colors.borderError : colors.borderPrimary
            } ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 ${colors.textSubtle} hover:text-black focus:outline-none focus:ring-2 focus:ring-black`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              // Eye-off icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {hint && !error && !strength?.label && (
          <p id={`${inputId}-hint`} className={inputs.hint}>
            {hint}
          </p>
        )}
        {showStrength && strength?.label && (
          <p className={`text-sm mt-1 ${strength.color}`}>
            Strength: {strength.label}
            {hint && <span className={colors.textSubtle}> — {hint}</span>}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className={inputs.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
