'use client';

import { useEffect } from 'react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md border-2 border-black p-8">
        <p className="font-mono text-sm uppercase tracking-widest mb-4">Error 500</p>
        <h1 className="font-display text-[clamp(3rem,10vw,6rem)] leading-none mb-6">
          Something<br />broke.
        </h1>
        <p className="mb-8">An unexpected error occurred. Try again or come back later.</p>
        <button
          onClick={reset}
          className="border-2 border-black px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
