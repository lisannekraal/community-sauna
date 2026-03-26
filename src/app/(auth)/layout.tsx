import Link from 'next/link';
import { interactive } from '@/lib/design-tokens';

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper border-b border-mustard-gold h-14 flex items-stretch">
        <Link
          href={LANDING_URL}
          className={`flex items-center px-5 border-r border-mustard-gold font-display text-[25px] shrink-0 ${interactive.hoverInvert} ${interactive.transition}`}
        >
          Löyly
        </Link>
      </header>
      <main className="pt-14">{children}</main>
    </>
  );
}
