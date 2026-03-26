import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export default async function HelpPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const t = await getTranslations('Pages');
  const tCommon = await getTranslations('Common');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-8">{t('help.heading')}</h1>
      <p className="text-timber">{tCommon('comingSoon')}</p>
    </div>
  );
}
