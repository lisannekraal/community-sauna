'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormInput, Button } from '@/components/ui';

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Please enter a valid email address'
    )
    .required('Email is required'),
});

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  async function handleSubmit(values: { email: string }) {
    setServerError('');
    setSuccess(false);
    setDevResetUrl(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);

      // DEV ONLY: Show reset URL for testing
      if (data._dev_resetUrl) {
        setDevResetUrl(data._dev_resetUrl);
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display uppercase mb-4">Reset Password</h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {success ? (
          <div className="space-y-6">
            <div className="border-2 border-green-600 bg-green-50 p-4 text-green-800" role="status">
              If an account exists with this email, a password reset link has been sent.
              Please check your inbox.
            </div>

            {/* DEV ONLY: Show reset link for testing */}
            {devResetUrl && (
              <div className="border-2 border-yellow-500 bg-yellow-50 p-4" role="alert">
                <p className="font-bold text-yellow-800 mb-2">Development Mode</p>
                <p className="text-sm text-yellow-700 mb-2">
                  In production, this link would be sent via email:
                </p>
                <Link
                  href={devResetUrl}
                  className="text-sm text-blue-600 underline break-all"
                >
                  {devResetUrl}
                </Link>
              </div>
            )}

            <Link
              href="/app/login"
              className="block text-center underline hover:no-underline"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-6" noValidate>
                {serverError && (
                  <div className="border-2 border-red-600 bg-red-50 p-4 text-red-600" role="alert">
                    {serverError}
                  </div>
                )}

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  error={touched.email && errors.email ? errors.email : undefined}
                />

                <Button type="submit" loading={isSubmitting} loadingText="Sending...">
                  Send reset link
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {!success && (
          <p className="mt-8 text-center">
            Remember your password?{' '}
            <Link href="/app/login" className="underline font-medium hover:no-underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
