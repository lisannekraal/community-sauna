'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PasswordInput, Button } from '@/components/ui';

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await res.json();
        setIsValidToken(data.valid);
      } catch {
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token]);

  async function handleSubmit(values: { password: string; confirmPassword: string }) {
    setServerError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <p>Verifying reset link...</p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="space-y-6">
        <div className="border-2 border-red-600 bg-red-50 p-4 text-red-600" role="alert">
          This password reset link is invalid or has expired.
          Please request a new one.
        </div>
        <Link
          href="/forgot-password"
          className="block text-center underline hover:no-underline"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="border-2 border-green-600 bg-green-50 p-4 text-green-800" role="status">
          Your password has been reset successfully.
        </div>
        <Link
          href="/login"
          className="block w-full p-3 font-medium border-2 bg-black text-white border-black text-center hover:bg-gray-800"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={resetPasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form className="space-y-6" noValidate>
          {serverError && (
            <div className="border-2 border-red-600 bg-red-50 p-4 text-red-600" role="alert">
              {serverError}
            </div>
          )}

          <PasswordInput
            label="New password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            showStrength
            hint="Minimum 8 characters"
            error={touched.password && errors.password ? errors.password : undefined}
          />

          <PasswordInput
            label="Confirm new password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
          />

          <Button type="submit" loading={isSubmitting} loadingText="Resetting...">
            Reset password
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display uppercase mb-4">Set New Password</h1>
        <p className="text-gray-600 mb-8">
          Enter your new password below.
        </p>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
