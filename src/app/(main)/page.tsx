import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { interactive } from '@/lib/design-tokens';
import { LandingPage } from '@/components/landing/landing-page';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display uppercase mb-8">Welcome, {session.user.name}</h1>
        <p className="mb-4">
          <Link href="/schedule" className={`font-medium ${interactive.link}`}>
            View schedule →
          </Link>
        </p>
      </div>
    );
  }

  return <LandingPage />;
}
