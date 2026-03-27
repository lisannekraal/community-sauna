import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { prisma } from '@/lib/db';
import { type PlanRow } from '@/lib/plans';

const PLAN_SELECT = {
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
} as const;

export async function GET() {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: [{ type: 'asc' }, { priceCents: 'asc' }],
    select: PLAN_SELECT,
  });

  return NextResponse.json(plans as PlanRow[]);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasRole(session.user.role as UserRole, 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const {
    name, description, type, priceCents,
    creditsPerMonth, totalCredits, validityMonths,
    minimumCommitmentMonths, autoRenew, isTrial,
  } = body;

  if (!name || !description || !type || priceCents === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const plan = await prisma.membershipPlan.create({
    data: {
      name,
      description,
      type,
      priceCents,
      creditsPerMonth: creditsPerMonth ?? null,
      totalCredits: totalCredits ?? null,
      validityMonths: validityMonths ?? null,
      minimumCommitmentMonths: minimumCommitmentMonths ?? null,
      autoRenew: autoRenew ?? false,
      isTrial: isTrial ?? false,
      isActive: true,
    },
    select: { ...PLAN_SELECT, isActive: true, _count: { select: { memberships: true } } },
  });

  return NextResponse.json(plan, { status: 201 });
}
