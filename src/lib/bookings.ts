import { prisma } from './db';

interface CreditCheckResult {
  allowed: boolean;
  membershipId: number | null;
  error?: string;
}

/**
 * Check if a user has an active membership with available credits.
 * Returns the membership ID to link the booking to.
 */
export async function checkUserCredits(userId: number): Promise<CreditCheckResult> {
  const now = new Date();

  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'active',
      startsAt: { lte: now },
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: now } },
      ],
    },
    include: {
      membershipPlan: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!membership) {
    return { allowed: false, membershipId: null, error: 'No active membership' };
  }

  const plan = membership.membershipPlan;

  // Subscription with unlimited credits
  if (plan.type === 'subscription' && plan.creditsPerMonth === null) {
    return { allowed: true, membershipId: membership.id };
  }

  // Subscription with limited monthly credits
  if (plan.type === 'subscription' && plan.creditsPerMonth !== null) {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const usedCredits = await prisma.booking.count({
      where: {
        membershipId: membership.id,
        status: 'confirmed',
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    });

    if (usedCredits >= plan.creditsPerMonth) {
      return { allowed: false, membershipId: membership.id, error: 'No credits remaining this month' };
    }
    return { allowed: true, membershipId: membership.id };
  }

  // Punch card with total credits
  if (plan.type === 'punch_card' && plan.totalCredits !== null) {
    const usedCredits = await prisma.booking.count({
      where: {
        membershipId: membership.id,
        status: 'confirmed',
      },
    });

    if (usedCredits >= plan.totalCredits) {
      return { allowed: false, membershipId: membership.id, error: 'No credits remaining on punch card' };
    }
    return { allowed: true, membershipId: membership.id };
  }

  return { allowed: false, membershipId: null, error: 'Invalid membership configuration' };
}
