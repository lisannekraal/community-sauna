'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from 'next-intl';
import { FormInput, PasswordInput, Button } from '@/components/ui';
import { colors, inputs, feedback, interactive } from '@/lib/design-tokens';
import { GENDER_OPTIONS } from '@/lib/member';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  gender: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

const STEP_NUMBERS = ['01', '02', '03'];

// Scroll to first error
function ScrollToError() {
  const { errors, isSubmitting, isValidating } = useFormikContext();

  useEffect(() => {
    if (isSubmitting && !isValidating) {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstErrorField = document.querySelector(`[name="${errorKeys[0]}"]`);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstErrorField as HTMLElement).focus();
        }
      }
    }
  }, [errors, isSubmitting, isValidating]);

  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState('');
  const t = useTranslations('Auth');
  const tCommon = useTranslations('Common');

  const accountSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.emailInvalid'))
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
    password: Yup.string()
      .min(8, t('validation.passwordMinLength'))
      .required(t('validation.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsDoNotMatch'))
      .required(t('validation.confirmPasswordRequired')),
  });

  const personalSchema = Yup.object({
    firstName: Yup.string().trim().required(t('validation.firstNameRequired')),
    lastName: Yup.string(),
    phone: Yup.string()
      .trim()
      .required(t('validation.phoneRequired'))
      .matches(/^[+\d\s\-()]+$/, t('validation.phoneInvalid'))
      .test('min-digits', t('validation.phoneTooShort'), val =>
        (val?.replace(/\D/g, '').length || 0) >= 10
      ),
    gender: Yup.string(),
  });

  const emergencySchema = Yup.object({
    emergencyContactName: Yup.string(),
    emergencyContactPhone: Yup.string()
      .matches(/^[+\d\s\-()]*$/, t('validation.phoneInvalid'))
      .test('min-digits', t('validation.phoneTooShort'), val =>
        !val || (val.replace(/\D/g, '').length >= 10)
      ),
  });

  const schemas = [accountSchema, personalSchema, emergencySchema];

  const steps = [
    { number: STEP_NUMBERS[0], title: t('register.step1Title') },
    { number: STEP_NUMBERS[1], title: t('register.step2Title') },
    { number: STEP_NUMBERS[2], title: t('register.step3Title') },
  ];

  const isLastStep = step === steps.length - 1;
  const currentSchema = schemas[step];

  async function handleSubmit(values: FormValues) {
    setServerError('');

    if (!isLastStep) {
      setStep(step + 1);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName || undefined,
          phone: values.phone,
          gender: values.gender || undefined,
          emergencyContactName: values.emergencyContactName || undefined,
          emergencyContactPhone: values.emergencyContactPhone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('email')) {
          setServerError(t('register.emailAlreadyRegistered'));
          setStep(0);
        } else {
          setServerError(data.error || t('register.registrationFailed'));
        }
        return;
      }

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError(t('register.registeredButLoginFailed'));
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setServerError(tCommon('somethingWentWrong'));
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      setServerError('');
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col p-4 py-8">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">{t('register.heading')}</h1>
            <span className="text-lg font-mono">
              {steps[step].number} <span className={colors.textDisabled}>→</span> {steps[steps.length - 1].number}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 ${i <= step ? 'bg-black' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <h2 className="font-display text-[clamp(1.5rem,4vw,2.25rem)] mb-8">{steps[step].title}</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={currentSchema}
          onSubmit={handleSubmit}
          validateOnBlur={true}
          validateOnChange={false}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex-1 flex flex-col" noValidate>
              <ScrollToError />

              {serverError && (
                <div className={`${feedback.alertError} mb-6`} role="alert">
                  {serverError}
                </div>
              )}

              <div className="space-y-4">
                {step === 0 && (
                  <>
                    <p className="">
                      {t('register.alreadyHaveAccount')}{' '}
                      <Link href="/login" className={`font-medium ${interactive.link}`}>
                        {t('register.login')}
                      </Link>
                    </p>
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

                    <PasswordInput
                      label={t('fields.password')}
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
                      label={t('fields.confirmPassword')}
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                      error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                    />

                    <p className="text-xs text-gray-500 pt-1">
                      {t('register.privacyNotice')}{' '}
                      <Link href="/privacy" target="_blank" className="underline hover:no-underline">
                        {t('register.privacyPolicy')}
                      </Link>
                      .
                    </p>
                  </>
                )}

                {step === 1 && (
                  <>
                    <FormInput
                      label={t('fields.firstName')}
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="given-name"
                      error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                    />

                    <FormInput
                      label={t('fields.lastName')}
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="family-name"
                      hint={tCommon('optional')}
                    />

                    <FormInput
                      label={t('fields.phone')}
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                      error={touched.phone && errors.phone ? errors.phone : undefined}
                    />

                    <div>
                      <label htmlFor="gender" className={inputs.label}>
                        {t('fields.gender')}
                        <span className="text-gray-500 font-normal ml-2">{tCommon('optional')}</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${inputs.base} ${colors.borderPrimary} bg-white`}
                      >
                        {GENDER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className={`${colors.textSubtle} mb-4`}>
                      {t('register.emergencyDesc')}
                    </p>

                    <FormInput
                      label={t('fields.emergencyContactName')}
                      type="text"
                      name="emergencyContactName"
                      value={values.emergencyContactName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />

                    <FormInput
                      label={t('fields.emergencyContactPhone')}
                      type="tel"
                      name="emergencyContactPhone"
                      value={values.emergencyContactPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      error={touched.emergencyContactPhone && errors.emergencyContactPhone ? errors.emergencyContactPhone : undefined}
                    />
                  </>
                )}
              </div>

              <div className="mt-auto pt-8 space-y-4">
                <div className="flex gap-4">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className={`flex-1 p-3 border-2 font-mono text-sm uppercase tracking-wider ${colors.borderPrimary} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1`}
                    >
                      {t('register.backButton')}
                    </button>
                  )}
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText={isLastStep ? t('register.createAccountLoading') : tCommon('loading')}
                    className={step === 0 ? 'w-full' : 'flex-1'}
                    disabled={isLastStep}
                    title={isLastStep ? tCommon('comingSoon') : undefined}
                  >
                    {isLastStep ? t('register.comingSoon') : t('register.continueButton')}
                  </Button>
                </div>

                {step === 2 && (
                  <button
                    type="button"
                    disabled
                    className={`w-full p-3 ${colors.textDisabled} cursor-not-allowed`}
                  >
                    {t('register.skipButton')}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
