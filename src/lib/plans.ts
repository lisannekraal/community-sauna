export type PlanRow = {
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
};

export function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return `€${cents / 100}`;
}

export function formatPeriod(plan: PlanRow): string {
  if (plan.type === 'punch_card') return 'one-time';
  if (plan.priceCents === 0) return `${plan.validityMonths ?? 1} month`;
  return 'per month';
}

export function formatSessions(plan: PlanRow): string {
  if (plan.type === 'punch_card') return `${plan.totalCredits} sessions`;
  if (plan.creditsPerMonth === null) return 'Unlimited';
  return `${plan.creditsPerMonth} / month`;
}

export function formatDetail(plan: PlanRow): string {
  if (plan.type === 'punch_card') {
    return plan.validityMonths ? `Valid ${plan.validityMonths} months` : '';
  }
  if (plan.minimumCommitmentMonths) {
    return `Min. ${plan.minimumCommitmentMonths} month${plan.minimumCommitmentMonths > 1 ? 's' : ''}`;
  }
  return '';
}

/**
 * Returns true if the user has ever held a subscription-type membership.
 * Used to enforce the trial-once rule: trial plans are only available to
 * members who have never had a subscription (punch cards and walk-ins don't count).
 */
import { prisma } from '@/lib/db';

export async function hasHadSubscription(userId: number): Promise<boolean> {
  const count = await prisma.membership.count({
    where: {
      userId,
      membershipPlan: { type: 'subscription' },
    },
  });
  return count > 0;
}
