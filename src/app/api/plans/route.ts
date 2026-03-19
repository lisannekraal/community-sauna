import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { type PlanRow } from '@/lib/plans';

export async function GET() {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: [{ type: 'asc' }, { priceCents: 'asc' }],
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
    },
  });

  return NextResponse.json(plans as PlanRow[]);
}
