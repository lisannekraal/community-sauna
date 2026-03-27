import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { MemberDetail } from '@/components/members/member-detail';
import { prisma } from '@/lib/db';
import { formatDateISO, formatTimeUTC } from '@/lib/schedule';
import type { MemberDetail as MemberDetailType } from '@/lib/member';
import { hasHadSubscription } from '@/lib/plans';

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const role = session.user.role as UserRole;
  if (!hasRole(role, 'admin')) redirect('/');

  const { id } = await params;
  const memberId = parseInt(id, 10);
  if (isNaN(memberId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      gender: true,
      role: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      createdAt: true,
      memberships: {
        orderBy: { startsAt: 'desc' },
        select: {
          id: true,
          status: true,
          startsAt: true,
          expiresAt: true,
          notes: true,
          membershipPlan: { select: { name: true } },
        },
      },
      bookings: {
        select: {
          id: true,
          status: true,
          timeslot: {
            select: { date: true, startTime: true, endTime: true, type: true },
          },
        },
        orderBy: { timeslot: { date: 'desc' } },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amountCents: true,
          status: true,
          createdAt: true,
          membership: {
            select: {
              membershipPlan: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!user) notFound();

  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const confirmedBookings = user.bookings.filter((b) => b.status === 'confirmed');
  const cancelledBookings = user.bookings.filter((b) => b.status === 'cancelled').length;
  const noShows = user.bookings.filter((b) => b.status === 'no_show').length;

  // Most visited weekday from confirmed bookings
  const dayCounts = Array(7).fill(0) as number[];
  for (const b of confirmedBookings) {
    dayCounts[b.timeslot.date.getUTCDay()]++;
  }
  const maxCount = Math.max(...dayCounts);
  const mostVisitedDay = maxCount > 0 ? dayCounts.indexOf(maxCount) : null;

  const upcomingBookings = confirmedBookings
    .filter((b) => b.timeslot.date >= todayUTC)
    .reverse() // was ordered date desc, flip to asc for display
    .map((b) => ({
      id: b.id,
      dateISO: formatDateISO(b.timeslot.date),
      startTime: formatTimeUTC(b.timeslot.startTime),
      endTime: formatTimeUTC(b.timeslot.endTime),
      type: b.timeslot.type,
    }));

  // All past bookings regardless of status (already ordered date desc)
  const pastBookings = user.bookings
    .filter((b) => b.timeslot.date < todayUTC)
    .map((b) => ({
      id: b.id,
      dateISO: formatDateISO(b.timeslot.date),
      startTime: formatTimeUTC(b.timeslot.startTime),
      endTime: formatTimeUTC(b.timeslot.endTime),
      type: b.timeslot.type,
      status: b.status as 'confirmed' | 'cancelled' | 'no_show',
    }));

  const pendingCount = user.payments.filter((p) => p.status === 'pending').length;
  const failedCount = user.payments.filter((p) => p.status === 'failed').length;

  const membershipStatusType = 'active' as 'active' | 'expired' | 'payment_pending' | 'suspended' | 'cancelled';
  const activeMembership = user.memberships.find((m) => m.status === 'active');
  const pastMemberships = user.memberships
    .filter((m) => m.status !== 'active')
    .map((m) => ({
      id: m.id,
      planName: m.membershipPlan.name,
      status: m.status as typeof membershipStatusType,
      startsAt: formatDateISO(m.startsAt),
      expiresAt: m.expiresAt ? formatDateISO(m.expiresAt) : null,
    }));

  const member: MemberDetailType = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender ?? null,
    role: user.role as UserRole,
    email: user.email,
    phone: user.phone,
    emergencyContactName: user.emergencyContactName ?? null,
    emergencyContactPhone: user.emergencyContactPhone ?? null,
    plan: activeMembership
      ? {
          id: activeMembership.id,
          name: activeMembership.membershipPlan.name,
          status: activeMembership.status as 'active' | 'expired' | 'payment_pending' | 'suspended' | 'cancelled',
          expiresAt: activeMembership.expiresAt ? formatDateISO(activeMembership.expiresAt) : null,
          isFreeAdminPlan: activeMembership.notes === 'Free membership added by admin',
        }
      : null,
    stats: {
      memberSince: `${user.createdAt.getUTCFullYear()}-${String(user.createdAt.getUTCMonth() + 1).padStart(2, '0')}`,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings,
      noShows,
      mostVisitedDay,
    },
    payments: {
      hasDue: pendingCount > 0 || failedCount > 0,
      pendingCount,
      failedCount,
      history: user.payments.map((p) => ({
        id: p.id,
        amountCents: p.amountCents,
        status: p.status as 'pending' | 'succeeded' | 'failed' | 'refunded',
        createdAt: p.createdAt.toISOString(),
        planName: p.membership?.membershipPlan.name ?? null,
      })),
    },
    hasHadSubscription: await hasHadSubscription(memberId),
    pastMemberships,
    upcomingBookings,
    pastBookings,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <MemberDetail member={member} />
    </div>
  );
}
