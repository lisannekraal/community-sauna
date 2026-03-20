import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { interactive } from '@/lib/design-tokens';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-8">Welcome, {session.user.name}</h1>
      <p className="mb-4">
        <Link href="/schedule" className={`font-medium ${interactive.link}`}>
          View schedule →
        </Link>
      </p>
    </div>
  );
}
