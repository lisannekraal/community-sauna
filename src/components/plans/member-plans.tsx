'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PlanCard } from '@/components/plans/plan-card';
import { typography, feedback } from '@/lib/design-tokens';
import type { PlanRow } from '@/lib/plans';
import type { CurrentMembershipResponse } from '@/app/api/memberships/current/route';

export function MemberPlans() {
  const t = useTranslations('Plans');

  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [membershipData, setMembershipData] = useState<CurrentMembershipResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/plans').then((r) => r.json()),
      fetch('/api/memberships/current').then((r) => r.json()),
    ])
      .then(([plansData, membershipResponse]) => {
        setPlans(plansData);
        setMembershipData(membershipResponse);
      })
      .catch(() => setError(t('failedToLoad')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <p className="text-timber font-mono text-sm">{t('loading')}</p>;

  if (error) {
    return (
      <div className={feedback.errorBox}>
        <p className={feedback.errorText}>{error}</p>
      </div>
    );
  }

  const membership = membershipData?.membership ?? null;
  const hasHadSubscription = membershipData?.hasHadSubscription ?? false;

  const subscriptionPlans = plans.filter((p) => p.type === 'subscription');
  const punchCardPlans = plans.filter((p) => p.type === 'punch_card');

  return (
    <div className="flex flex-col gap-10">
      <section>
        <p className={`${typography.mono.tiny} uppercase tracking-widest text-ash mb-4`}>{t('yourMembership')}</p>
        {membership ? (
          <div className="border border-mustard-gold p-5 max-w-sm">
            <div className="text-lg mb-1">{membership.planName}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ash">
              {membership.status}
              {membership.expiresAt && ` · ${t('expires', { date: membership.expiresAt })}`}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-mustard-gold/40 p-5 max-w-sm">
            <p className="text-timber font-mono text-sm">{t('noMembership')}</p>
          </div>
        )}
      </section>

      {subscriptionPlans.length > 0 && (
        <section>
          <p className={`${typography.mono.tiny} uppercase tracking-widest text-ash mb-4`}>{t('subscriptions')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                variant="member"
                isCurrentPlan={membership?.planName === plan.name}
                trialUnavailable={plan.isTrial && hasHadSubscription}
              />
            ))}
          </div>
        </section>
      )}

      {punchCardPlans.length > 0 && (
        <section>
          <p className={`${typography.mono.tiny} uppercase tracking-widest text-ash mb-4`}>{t('punchCards')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {punchCardPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                variant="member"
                isCurrentPlan={membership?.planName === plan.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
