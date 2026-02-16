'use client';

import { forwardRef } from 'react';
import { inputs, colors } from '@/lib/design-tokens';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div>
        <label htmlFor={inputId} className={inputs.label}>
          {label}
          {required && <span className={inputs.requiredMark}>*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`${inputs.base} ${
            error ? colors.borderError : colors.borderPrimary
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className={inputs.hint}>
            {hint}
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

FormInput.displayName = 'FormInput';
