'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { PasswordInput, Button } from '@/components/ui';
import { colors, feedback, interactive } from '@/lib/design-tokens';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('Auth');
  const tCommon = useTranslations('Common');

  const resetPasswordSchema = Yup.object({
    password: Yup.string()
      .min(8, t('validation.passwordMinLength'))
      .required(t('validation.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsDoNotMatch'))
      .required(t('validation.confirmPasswordRequired')),
  });

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
        setServerError(data.error || tCommon('somethingWentWrong'));
        return;
      }

      setSuccess(true);
    } catch {
      setServerError(tCommon('somethingWentWrong'));
    }
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <p>{t('resetPassword.verifying')}</p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="space-y-6">
        <div className={feedback.alertError} role="alert">
          {t('resetPassword.invalidToken')}
        </div>
        <Link
          href="/forgot-password"
          className={`block text-center ${interactive.link}`}
        >
          {t('resetPassword.requestNewLink')}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className={feedback.alertSuccess} role="status">
          {t('resetPassword.successMessage')}
        </div>
        <Link
          href="/login"
          className="block w-full p-3 font-medium border bg-mustard-gold text-ink border-mustard-gold text-center hover:bg-mustard-gold-dark"
        >
          {t('resetPassword.goToLogin')}
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
            <div className={feedback.alertError} role="alert">
              {serverError}
            </div>
          )}

          <PasswordInput
            label={t('resetPassword.newPassword')}
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            showStrength
            hint={t('validation.passwordHint')}
            error={touched.password && errors.password ? errors.password : undefined}
          />

          <PasswordInput
            label={t('resetPassword.confirmNewPassword')}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
          />

          <Button type="submit" loading={isSubmitting} loadingText={t('resetPassword.loadingText')}>
            {t('resetPassword.submitLabel')}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations('Auth');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] uppercase mb-4">{t('resetPassword.heading')}</h1>
        <p className={`${colors.textSubtle} mb-8`}>
          {t('resetPassword.description')}
        </p>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
