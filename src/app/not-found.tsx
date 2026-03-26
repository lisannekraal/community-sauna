import Link from 'next/link';
import { interactive } from '@/lib/design-tokens';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-paper">
      <div className="w-full max-w-md border border-mustard-gold p-8">
        <p className="font-mono text-sm uppercase tracking-widest mb-4">Error 404</p>
        <h1 className="font-display text-[clamp(3rem,10vw,6rem)] leading-none mb-6">
          Not<br />found.
        </h1>
        <p className="mb-8">This page does not exist.</p>
        <Link
          href="/"
          className={`inline-block border border-mustard-gold px-6 py-3 font-mono text-sm uppercase tracking-wider ${interactive.hoverInvert} ${interactive.transition}`}
        >
          ← Go home
        </Link>
      </div>
    </div>
  );
}
