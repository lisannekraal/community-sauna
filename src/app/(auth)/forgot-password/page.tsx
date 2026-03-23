'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { FormInput, Button } from '@/components/ui';
import { colors, feedback, interactive } from '@/lib/design-tokens';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const t = useTranslations('Auth');
  const tCommon = useTranslations('Common');

  const forgotPasswordSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
  });

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
        setServerError(data.error || tCommon('somethingWentWrong'));
        return;
      }

      setSuccess(true);

      // DEV ONLY: Show reset URL for testing
      if (data._dev_resetUrl) {
        setDevResetUrl(data._dev_resetUrl);
      }
    } catch {
      setServerError(tCommon('somethingWentWrong'));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-4">{t('forgotPassword.heading')}</h1>
        <p className={`${colors.textSubtle} mb-8`}>
          {t('forgotPassword.description')}
        </p>

        {success ? (
          <div className="space-y-6">
            <div className={feedback.alertSuccess} role="status">
              {t('forgotPassword.successMessage')}
            </div>
            <Link
              href="/login"
              className={`block text-center ${interactive.link}`}
            >
              {t('forgotPassword.backToLogin')}
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

                <Button type="submit" loading={isSubmitting} loadingText={t('forgotPassword.loadingText')}>
                  {t('forgotPassword.submitLabel')}
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {!success && (
          <p className="mt-8 text-center">
            {t('forgotPassword.rememberPassword')}{' '}
            <Link href="/login" className={`font-medium ${interactive.link}`}>
              {t('forgotPassword.login')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
