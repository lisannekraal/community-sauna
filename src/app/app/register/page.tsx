'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { FormInput, PasswordInput, Button } from '@/components/ui';

const registerSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      'Please enter a valid email address'
    )
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  firstName: Yup.string()
    .trim()
    .required('First name is required'),
  lastName: Yup.string(),
  phone: Yup.string()
    .trim()
    .required('Phone number is required'),
  gender: Yup.string(),
  emergencyContactName: Yup.string(),
  emergencyContactPhone: Yup.string(),
});

type RegisterFormValues = Yup.InferType<typeof registerSchema>;

// Component to scroll to first error on validation failure
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
  const [serverError, setServerError] = useState('');

  const initialValues: RegisterFormValues = {
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

  async function handleSubmit(values: RegisterFormValues) {
    setServerError('');

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
        } else {
          setServerError(data.error || 'Registration failed. Please try again.');
        }
        return;
      }

      // Auto-login after registration
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8">Register</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-8" noValidate>
              <ScrollToError />

              {serverError && (
                <div className="border-2 border-red-600 bg-red-50 p-4 text-red-600" role="alert">
                  {serverError}
                </div>
              )}

              {/* Account Information */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-bold mb-4 border-b-2 border-black pb-2 w-full">
                  Account Information
                </legend>

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
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                />
              </fieldset>

              {/* Personal Information */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-bold mb-4 border-b-2 border-black pb-2 w-full">
                  Personal Information
                </legend>

                <FormInput
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="given-name"
                  error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                />

                <FormInput
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="family-name"
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
              </fieldset>

              {/* Emergency Contact */}
              <fieldset className="border-2 border-black p-4">
                <legend className="px-2 font-bold">Emergency Contact (Optional)</legend>

                <div className="space-y-4">
                  <FormInput
                    label="Name"
                    type="text"
                    name="emergencyContactName"
                    value={values.emergencyContactName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />

                  <FormInput
                    label="Phone"
                    type="tel"
                    name="emergencyContactPhone"
                    value={values.emergencyContactPhone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </div>
              </fieldset>

              <Button type="submit" loading={isSubmitting} loadingText="Creating account...">
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center">
          Already have an account?{' '}
          <Link href="/app/login" className="underline font-medium hover:no-underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
