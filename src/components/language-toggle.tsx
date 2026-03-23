'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const LOCALES = ['nl', 'en'] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
    const domainAttr = domain ? `; domain=${domain}` : '';
    document.cookie = `NEXT_LOCALE=${next}; path=/${domainAttr}; max-age=31536000; SameSite=Lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center font-mono text-[10px] uppercase tracking-widest">
      {LOCALES.map((l, i) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={isPending || l === locale}
          className={`px-1.5 py-0.5 transition-opacity ${
            l === locale
              ? 'font-bold'
              : 'opacity-35 hover:opacity-100 cursor-pointer'
          }${i > 0 ? ' border-l border-current' : ''}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
