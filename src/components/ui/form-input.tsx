'use client';

import { forwardRef } from 'react';

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
        <label htmlFor={inputId} className="block font-medium mb-1">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={`w-full border-2 p-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
            error ? 'border-red-600' : 'border-black'
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-600 mt-1">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
