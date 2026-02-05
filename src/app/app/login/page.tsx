'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormInput, PasswordInput, Button } from '@/components/ui';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Please enter a valid email address'
    )
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/app';

  const [serverError, setServerError] = useState('');

  async function handleSubmit(values: { email: string; password: string }) {
    setServerError('');

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError('Invalid email or password. Please check your credentials and try again.');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
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

          <div>
            <PasswordInput
              label="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              error={touched.password && errors.password ? errors.password : undefined}
            />
            <div className="mt-2 text-right">
              <Link href="/app/forgot-password" className="text-sm underline hover:no-underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} loadingText="Logging in...">
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display uppercase mb-8">Login</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/app/register" className="underline font-medium hover:no-underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
