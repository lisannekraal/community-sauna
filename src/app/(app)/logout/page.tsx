'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000';

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: LANDING_URL });
  }, []);

  return null;
}
