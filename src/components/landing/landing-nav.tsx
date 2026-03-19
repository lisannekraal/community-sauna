'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'How it works', href: '/#how' },
  { label: 'Plans', href: '/#plans' },
  { label: 'Schedule', href: '/#schedule' },
  { label: 'Contact', href: '/#contact' },
];

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black">
      <div className="flex items-stretch h-14">
        <Link
          href="/"
          className="flex items-center px-5 border-r-2 border-black font-display text-[22px] shrink-0 hover:bg-black hover:text-white transition-colors"
        >
          Löyly
        </Link>

        {/* Desktop nav — each item in its own bordered cell */}
        <nav className="hidden lg:flex items-stretch" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center px-4 border-r-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {session ? (
          <>
            <Link
              href="/"
              className="hidden lg:flex items-center px-5 border-l-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              My account
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="hidden lg:flex items-center px-5 border-l-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <Link
              href="/login"
              className="hidden lg:flex items-center px-5 border-l-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Login
            </Link>

            {/* CTA */}
            <Link
              href="/register"
              className="hidden lg:flex items-center px-5 border-l-2 border-black bg-black text-white font-mono text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Become a member&nbsp;→
            </Link>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-14 border-l-2 border-black font-mono text-sm cursor-pointer hover:bg-black hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t-2 border-black bg-white" role="navigation" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-4 border-b-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          {session ? (
            <div className="grid grid-cols-2">
              <Link
                href="/"
                className="block px-5 py-4 border-b-2 border-r-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                My account
              </Link>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                className="block w-full px-5 py-4 border-b-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              <Link
                href="/login"
                className="block px-5 py-4 border-b-2 border-r-2 border-black font-mono text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-5 py-4 border-b-2 border-black bg-black text-white font-mono text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                Become a member
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
