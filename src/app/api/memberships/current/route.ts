import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatDateISO } from '@/lib/schedule';

export type CurrentMembership = {
  id: number;
  planName: string;
  planType: string;
  status: string;
  startsAt: string;
  expiresAt: string | null;
} | null;

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

  if (!membership) return NextResponse.json(null);

  const result: CurrentMembership = {
    id: membership.id,
    planName: membership.membershipPlan.name,
    planType: membership.membershipPlan.type,
    status: membership.status,
    startsAt: formatDateISO(membership.startsAt),
    expiresAt: membership.expiresAt ? formatDateISO(membership.expiresAt) : null,
  };

  return NextResponse.json(result);
}
