import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatDateISO } from '@/lib/schedule';
import { hasHadSubscription } from '@/lib/plans';

export type ActiveMembership = {
  id: number;
  planName: string;
  planType: string;
  status: string;
  startsAt: string;
  expiresAt: string | null;
};

export type CurrentMembershipResponse = {
  membership: ActiveMembership | null;
  hasHadSubscription: boolean;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = parseInt(session.user.id, 10);

  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'active' },
    orderBy: { startsAt: 'desc' },
    select: {
      id: true,
      status: true,
      startsAt: true,
      expiresAt: true,
      membershipPlan: { select: { name: true, type: true } },
    },
  });

  const hadSubscription = await hasHadSubscription(userId);

  const result: CurrentMembershipResponse = {
    membership: membership
      ? {
          id: membership.id,
          planName: membership.membershipPlan.name,
          planType: membership.membershipPlan.type,
          status: membership.status,
          startsAt: formatDateISO(membership.startsAt),
          expiresAt: membership.expiresAt ? formatDateISO(membership.expiresAt) : null,
        }
      : null,
    hasHadSubscription: hadSubscription,
  };

  return NextResponse.json(result);
}
