import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md border-2 border-black p-8">
        <p className="font-mono text-sm uppercase tracking-widest mb-4">Error 404</p>
        <h1 className="font-display text-[clamp(3rem,10vw,6rem)] leading-none mb-6">
          Not<br />found.
        </h1>
        <p className="mb-8">This page does not exist.</p>
        <Link
          href="/"
          className="inline-block border-2 border-black px-6 py-3 font-mono text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          ← Go home
        </Link>
      </div>
    </div>
  );
}
