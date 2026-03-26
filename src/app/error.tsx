'use client';

import { useEffect } from 'react';
import { interactive } from '@/lib/design-tokens';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-paper">
      <div className="w-full max-w-md border border-mustard-gold p-8">
        <p className="font-mono text-sm uppercase tracking-widest mb-4">Error 500</p>
        <h1 className="font-display text-[clamp(3rem,10vw,6rem)] leading-none mb-6">
          Something<br />broke.
        </h1>
        <p className="mb-8">An unexpected error occurred. Try again or come back later.</p>
        <button
          onClick={reset}
          className={`border border-mustard-gold px-6 py-3 font-mono text-sm uppercase tracking-wider ${interactive.hoverInvert} ${interactive.transition}`}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
