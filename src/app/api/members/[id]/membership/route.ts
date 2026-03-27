import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasRole } from '@/types';

// This route lives under /api/members/[id] rather than /api/memberships because
// it is an admin-only action performed *on* a specific member: assigning a free
// membership without a payment flow. Member self-signup (which triggers a
// payment) will live at POST /api/memberships when that flow is built.

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !hasRole(session.user.role, 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const memberId = parseInt(id, 10);
  if (isNaN(memberId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const body = await request.json() as { planId?: unknown; expiresAt?: unknown };
  const { planId, expiresAt } = body;

  if (typeof planId !== 'number') {
    return NextResponse.json({ error: 'No plan selected.' }, { status: 400 });
  }

  if (!expiresAt || typeof expiresAt !== 'string') {
    return NextResponse.json({ error: 'An expiry date is required.' }, { status: 400 });
  }
  const expiryParsed = new Date(expiresAt);
  if (isNaN(expiryParsed.getTime())) {
    return NextResponse.json({ error: 'The expiry date is not valid.' }, { status: 400 });
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (expiryParsed < today) {
    return NextResponse.json({ error: 'The expiry date must be today or in the future.' }, { status: 400 });
  }

  const [plan, user] = await Promise.all([
    prisma.membershipPlan.findUnique({ where: { id: planId }, select: { id: true } }),
    prisma.user.findUnique({ where: { id: memberId }, select: { id: true } }),
  ]);

  if (!plan) return NextResponse.json({ error: 'The selected plan no longer exists.' }, { status: 404 });
  if (!user) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });

  // Cancel any existing active memberships before creating the new one.
  // A user should only have one active membership at a time.
  // Note: when member self-signup is built (POST /api/memberships), the same
  // logic must apply there.
  await prisma.membership.updateMany({
    where: { userId: memberId, status: 'active' },
    data: { status: 'cancelled', cancelledAt: new Date() },
  });

  const membership = await prisma.membership.create({
    data: {
      userId: memberId,
      membershipPlanId: planId,
      status: 'active',
      startsAt: new Date(),
      expiresAt: expiryParsed,
      notes: 'Free membership added by admin',
    },
    select: { id: true, status: true, startsAt: true, expiresAt: true },
  });

  return NextResponse.json(membership, { status: 201 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !hasRole(session.user.role, 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const memberId = parseInt(id, 10);
  if (isNaN(memberId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const membership = await prisma.membership.findFirst({
    where: { userId: memberId, status: 'active' },
    select: { id: true, notes: true },
  });

  if (!membership) {
    return NextResponse.json({ error: 'No active membership found.' }, { status: 404 });
  }
  if (membership.notes !== 'Free membership added by admin') {
    return NextResponse.json({ error: 'Only admin-assigned free plans can be withdrawn here.' }, { status: 403 });
  }

  await prisma.membership.update({
    where: { id: membership.id },
    data: { status: 'cancelled', cancelledAt: new Date() },
  });

  return new NextResponse(null, { status: 204 });
}
