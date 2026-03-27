import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { getTranslations } from 'next-intl/server';
import { PlansContent } from '@/components/plans/plans-content';

export default async function PlansPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const role = session.user.role as UserRole;
  const isAdmin = hasRole(role, 'admin');

  const t = await getTranslations('Pages');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-8">{t('plans.heading')}</h1>
      <PlansContent isAdmin={isAdmin} />
    </div>
  );
}
