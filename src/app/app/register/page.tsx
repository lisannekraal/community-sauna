'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { FormInput, PasswordInput, Button } from '@/components/ui';

const accountSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const personalSchema = Yup.object({
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string(),
  phone: Yup.string()
    .trim()
    .required('Phone number is required')
    .matches(/^[+\d\s\-()]+$/, 'Invalid phone number')
    .test('min-digits', 'Phone number too short', val => 
      (val?.replace(/\D/g, '').length || 0) >= 10
    ),
  gender: Yup.string(),
});

const emergencySchema = Yup.object({
  emergencyContactName: Yup.string(),
  emergencyContactPhone: Yup.string()
    .matches(/^[+\d\s\-()]*$/, 'Invalid phone number')
    .test('min-digits', 'Phone number too short', val => 
      !val || (val.replace(/\D/g, '').length >= 10)
    ),
});

const schemas = [accountSchema, personalSchema, emergencySchema];

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

const steps = [
  { number: '01', title: 'Create your account' },
  { number: '02', title: 'Tell us about you' },
  { number: '03', title: 'Emergency contact' },
];

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
          setServerError('This email is already registered');
          setStep(0);
        } else {
          setServerError(data.error || 'Registration failed. Please try again.');
        }
        return;
      }

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError('Registration succeeded but login failed. Please try logging in.');
        return;
      }

      router.push('/app');
      router.refresh();
    } catch {
      setServerError('Something went wrong. Please try again.');
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
            <h1 className="text-3xl font-display uppercase">Register</h1>
            <span className="text-lg font-mono">
              {steps[step].number} <span className="text-gray-400">→</span> {steps[steps.length - 1].number}
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

        <h2 className="text-2xl font-display uppercase mb-8">{steps[step].title}</h2>

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
                <div className="border-2 border-red-600 bg-red-50 p-4 text-red-600 mb-6" role="alert">
                  {serverError}
                </div>
              )}

              <div className="space-y-4">
                {step === 0 && (
                  <>
                    <p className="">
                      Already have an account?{' '}
                      <Link href="/app/login" className="underline font-medium hover:no-underline">
                        Login
                      </Link>
                    </p>
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

                    <PasswordInput
                      label="Password"
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
                      label="Confirm password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                      error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <FormInput
                      label="First name"
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="given-name"
                      error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                    />

                    <FormInput
                      label="Last name"
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="family-name"
                      hint="Optional"
                    />

                    <FormInput
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                      error={touched.phone && errors.phone ? errors.phone : undefined}
                    />

                    <div>
                      <label htmlFor="gender" className="block font-medium mb-1">
                        Gender
                        <span className="text-gray-500 font-normal ml-2">Optional</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="female">Female</option>
                        <option value="non_binary">Non-binary</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-gray-600 mb-4">
                      Optional but recommended. This person will be contacted in case of emergency during a sauna session.
                    </p>

                    <FormInput
                      label="Contact name"
                      type="text"
                      name="emergencyContactName"
                      value={values.emergencyContactName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />

                    <FormInput
                      label="Contact phone"
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
                      className="flex-1 p-3 font-medium border-2 border-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
                    >
                      ← Back
                    </button>
                  )}
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    loadingText={isLastStep ? 'Creating account...' : 'Loading...'}
                    className={step === 0 ? 'w-full' : 'flex-1'}
                  >
                    {isLastStep ? 'Create account' : 'Continue →'}
                  </Button>
                </div>

                {step === 2 && (
                  <button
                    type="submit"
                    className="w-full p-3 text-gray-600 hover:text-black underline"
                  >
                    Skip, I&apos;ll add this later
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
