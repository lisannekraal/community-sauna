'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LanguageToggle } from '@/components/language-toggle';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://app.localhost:3000';

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const t = useTranslations('LandingNav');

  const NAV_ITEMS = [
    { label: t('about'), href: '/#about' },
    { label: t('howItWorks'), href: '/#how' },
    { label: t('plans'), href: '/#plans' },
    { label: t('schedule'), href: '/#schedule' },
    { label: t('contact'), href: '/#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper border-b border-ink">
      <div className="flex items-stretch h-14">
        <Link
          href="/"
          className="flex items-center px-5 border-r border-ink font-display text-[25px] shrink-0 hover:bg-ink hover:text-paper transition-colors"
        >
          Löyly
        </Link>

        {/* Desktop nav — each item in its own bordered cell */}
        <nav className="hidden lg:flex items-stretch" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center px-4 border-r border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Language toggle — desktop */}
        <div className="hidden lg:flex items-center px-4 border-l border-ink">
          <LanguageToggle />
        </div>

        {session ? (
          <>
            <a
              href={`${APP_URL}/`}
              className="hidden lg:flex items-center px-5 border-l border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors"
            >
              {t('myAccount')}
            </a>
            <a
              href={`${APP_URL}/logout`}
              className="hidden lg:flex items-center px-5 border-l border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors"
            >
              {t('logout')}
            </a>
          </>
        ) : (
          <>
            <a
              href={`${APP_URL}/login`}
              className="hidden lg:flex items-center px-5 border-l border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors"
            >
              {t('login')}
            </a>
            <a
              href={`${APP_URL}/register`}
              className="hidden lg:flex items-center px-5 border-l border-ink bg-ember text-ink font-mono text-[11px] uppercase tracking-widest hover:bg-ember-dark transition-colors"
            >
              {t('preRegister')}
            </a>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-14 border-l border-ink font-mono text-sm cursor-pointer hover:bg-ink hover:text-paper transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-ink bg-paper" role="navigation" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-4 border-b border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors"
            >
              {item.label}
            </a>
          ))}
          {session ? (
            <div className="grid grid-cols-2">
              <a
                href={`${APP_URL}/`}
                className="block px-5 py-4 border-b border-r border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                {t('myAccount')}
              </a>
              <a
                href={`${APP_URL}/logout`}
                className="block px-5 py-4 border-b border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                {t('logout')}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              <a
                href={`${APP_URL}/login`}
                className="block px-5 py-4 border-b border-r border-ink font-mono text-[11px] uppercase tracking-widest text-timber hover:bg-ink hover:text-paper transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                {t('login')}
              </a>
              <a
                href={`${APP_URL}/register`}
                className="block px-5 py-4 border-b border-ink bg-ember text-ink font-mono text-[11px] uppercase tracking-widest hover:bg-ember-dark transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                {t('preRegister')}
              </a>
            </div>
          )}
          {/* Language toggle — mobile */}
          <div className="px-5 py-4 border-b border-ink flex justify-end">
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
