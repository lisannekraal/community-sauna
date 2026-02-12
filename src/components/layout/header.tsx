'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-display uppercase">
            Community Sauna
          </Link>

          <nav className="flex items-center gap-6">
            {status === 'authenticated' ? (
              <>
                <Link href="/" className="hover:underline">
                  App
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
