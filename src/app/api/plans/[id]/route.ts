import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { prisma } from '@/lib/db';

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
  isActive: true,
  _count: { select: { memberships: true } },
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasRole(session.user.role as UserRole, 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const planId = parseInt(id, 10);
  if (isNaN(planId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const existing = await prisma.membershipPlan.findUnique({
    where: { id: planId },
    select: { id: true, _count: { select: { memberships: true } } },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const {
    name, description, type, priceCents,
    creditsPerMonth, totalCredits, validityMonths,
    minimumCommitmentMonths, autoRenew,
  } = body;

  const data = {
    name,
    description,
    type,
    priceCents,
    creditsPerMonth: creditsPerMonth ?? null,
    totalCredits: totalCredits ?? null,
    validityMonths: validityMonths ?? null,
    minimumCommitmentMonths: minimumCommitmentMonths ?? null,
    autoRenew: autoRenew ?? false,
  };

  if (existing._count.memberships === 0) {
    // No members on this plan — edit in place
    const updated = await prisma.membershipPlan.update({
      where: { id: planId },
      data,
      select: PLAN_SELECT,
    });
    return NextResponse.json({ plan: updated, archived: false });
  }

  // Has members — archive old and create new version
  const [, newPlan] = await prisma.$transaction([
    prisma.membershipPlan.update({
      where: { id: planId },
      data: { isActive: false },
    }),
    prisma.membershipPlan.create({
      data: { ...data, isActive: true },
      select: PLAN_SELECT,
    }),
  ]);

  return NextResponse.json({ plan: newPlan, archived: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasRole(session.user.role as UserRole, 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const planId = parseInt(id, 10);
  if (isNaN(planId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const existing = await prisma.membershipPlan.findUnique({
    where: { id: planId },
    select: { id: true, _count: { select: { memberships: true } } },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (existing._count.memberships === 0) {
    await prisma.membershipPlan.delete({ where: { id: planId } });
    return NextResponse.json({ deleted: true });
  }

  // Has members — archive instead of delete
  await prisma.membershipPlan.update({
    where: { id: planId },
    data: { isActive: false },
  });
  return NextResponse.json({ deleted: false, archived: true });
}
