import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { MemberList } from '@/components/members/member-list';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { formatDateISO } from '@/lib/schedule';
import type { MemberSummary } from '@/lib/member';

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const role = session.user.role as UserRole;
  if (!hasRole(role, 'admin')) redirect('/');

  const t = await getTranslations('Pages');

  const users = await prisma.user.findMany({
    orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      gender: true,
      memberships: {
        where: { status: 'active' },
        orderBy: { startsAt: 'desc' },
        take: 1,
        select: {
          membershipPlan: { select: { name: true } },
        },
      },
      bookings: {
        where: { status: { not: 'cancelled' } },
        select: {
          status: true,
          timeslot: { select: { date: true } },
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { status: true },
      },
    },
  });

  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const members: MemberSummary[] = users.map((user) => {
    const planName = user.memberships[0]?.membershipPlan.name ?? null;
    const noShows = user.bookings.filter((b) => b.status === 'no_show').length;

    const latestPayment = user.payments[0];
    let paymentStatus: MemberSummary['paymentStatus'] = null;
    if (latestPayment) {
      if (latestPayment.status === 'succeeded') paymentStatus = 'ok';
      else if (latestPayment.status === 'pending') paymentStatus = 'pending';
      else if (latestPayment.status === 'failed') paymentStatus = 'failed';
    }

    const confirmedBookings = user.bookings.filter((b) => b.status === 'confirmed');

    const futureBookings = confirmedBookings
      .filter((b) => b.timeslot.date >= todayUTC)
      .sort((a, b) => a.timeslot.date.getTime() - b.timeslot.date.getTime());

    const pastConfirmed = confirmedBookings
      .filter((b) => b.timeslot.date < todayUTC)
      .sort((a, b) => b.timeslot.date.getTime() - a.timeslot.date.getTime());

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      gender: user.gender,
      plan: planName,
      noShows,
      paymentStatus,
      nextBooking: futureBookings[0] ? { dateISO: formatDateISO(futureBookings[0].timeslot.date) } : null,
      lastBooking: pastConfirmed[0] ? { dateISO: formatDateISO(pastConfirmed[0].timeslot.date) } : null,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] mb-8">{t('members.heading')}</h1>
      <MemberList members={members} />
    </div>
  );
}
