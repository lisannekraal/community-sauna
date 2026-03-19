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
