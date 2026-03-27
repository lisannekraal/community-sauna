import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { prisma } from '@/lib/db';

export type AdminPlanRow = {
  id: number;
  name: string;
  description: string;
  type: string;
  priceCents: number;
  creditsPerMonth: number | null;
  totalCredits: number | null;
  validityMonths: number | null;
  minimumCommitmentMonths: number | null;
  autoRenew: boolean;
  isTrial: boolean;
  isActive: boolean;
  membershipCount: number;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasRole(session.user.role as UserRole, 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const plans = await prisma.membershipPlan.findMany({
    orderBy: [{ isActive: 'desc' }, { type: 'asc' }, { priceCents: 'asc' }],
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      priceCents: true,
      creditsPerMonth: true,
      totalCredits: true,
      validityMonths: true,
      minimumCommitmentMonths: true,
      autoRenew: true,
      isTrial: true,
      isActive: true,
      _count: { select: { memberships: true } },
    },
  });

  const result: AdminPlanRow[] = plans.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    type: p.type,
    priceCents: p.priceCents,
    creditsPerMonth: p.creditsPerMonth,
    totalCredits: p.totalCredits,
    validityMonths: p.validityMonths,
    minimumCommitmentMonths: p.minimumCommitmentMonths,
    autoRenew: p.autoRenew,
    isTrial: p.isTrial,
    isActive: p.isActive,
    membershipCount: p._count.memberships,
  }));

  return NextResponse.json(result);
}
