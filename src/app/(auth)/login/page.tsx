'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { FormInput, PasswordInput, Button } from '@/components/ui';
import { feedback, interactive } from '@/lib/design-tokens';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const t = useTranslations('Auth');

  const loginSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
    password: Yup.string()
      .required(t('validation.passwordRequired')),
  });

  const [serverError, setServerError] = useState('');

  async function handleSubmit(values: { email: string; password: string }) {
    setServerError('');

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError(t('login.invalidCredentials'));
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
            <div className={feedback.alertError} role="alert">
              {serverError}
            </div>
          )}

          <FormInput
            label={t('fields.email')}
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
              label={t('fields.password')}
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              error={touched.password && errors.password ? errors.password : undefined}
            />
            <div className="mt-2 text-right">
              <Link href="/forgot-password" className={`text-sm ${interactive.link}`}>
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} loadingText={t('login.loadingText')}>
            {t('login.submitLabel')}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-8">{t('login.heading')}</h1>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center">
          {t('login.noAccount')}{' '}
          <Link href="/register" className={`font-medium ${interactive.link}`}>
            {t('login.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
