import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { interactive } from '@/lib/design-tokens';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const t = await getTranslations('Pages');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-8">{t('home.heading', { name: session.user.name ?? '' })}</h1>
      <p className="mb-4">
        <Link href="/schedule" className={`font-medium ${interactive.link}`}>
          {t('home.viewSchedule')}
        </Link>
      </p>
    </div>
  );
}
