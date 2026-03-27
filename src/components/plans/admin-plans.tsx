'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'iconoir-react';
import { useTranslations } from 'next-intl';
import { PlanCard } from '@/components/plans/plan-card';
import { PlanFormPanel } from '@/components/plans/plan-form-panel';
import { icons, feedback, typography } from '@/lib/design-tokens';
import type { AdminPlanRow } from '@/app/api/plans/admin/route';

export function AdminPlans() {
  const t = useTranslations('Plans');

  const [plans, setPlans] = useState<AdminPlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPlan, setEditingPlan] = useState<AdminPlanRow | undefined>(undefined);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [deactivating, setDeactivating] = useState<number | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/plans/admin');
      if (!res.ok) throw new Error('Failed to load plans');
      const data = await res.json();
      setPlans(data);
    } catch {
      setError(t('failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  function openCreate() {
    setEditingPlan(undefined);
    setPanelOpen(true);
  }

  function openEdit(plan: AdminPlanRow) {
    setEditingPlan(plan);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingPlan(undefined);
  }

  async function handleSaved() {
    closePanel();
    setLoading(true);
    await fetchPlans();
  }

  async function handleDeactivate(plan: AdminPlanRow) {
    const message = plan.membershipCount > 0
      ? t('confirmArchive', { name: plan.name, count: plan.membershipCount })
      : t('confirmDelete', { name: plan.name });

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    setDeactivating(plan.id);
    try {
      const res = await fetch(`/api/plans/${plan.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('failedToDeactivate'));
      }
      await fetchPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedToDeactivate'));
    } finally {
      setDeactivating(null);
    }
  }

  const activePlans = plans.filter((p) => p.isActive);
  const archivedPlans = plans.filter((p) => !p.isActive);
  const subscriptionPlans = activePlans.filter((p) => p.type === 'subscription');
  const punchCardPlans = activePlans.filter((p) => p.type === 'punch_card');

  if (loading) return <p className="text-timber font-mono text-sm">{t('loading')}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 border border-ink px-4 py-2 font-mono text-sm uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
        >
          <Plus {...icons.action} />
          {t('addPlan')}
        </button>
      </div>

      {error && (
        <div className={`${feedback.errorBox} mb-6`}>
          <p className={feedback.errorText}>{error}</p>
        </div>
      )}

      {subscriptionPlans.length > 0 && (
        <div className="mb-10">
          <p className={`${typography.mono.tiny} uppercase tracking-widest text-ash mb-4`}>{t('subscriptions')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                variant="admin"
                membershipCount={plan.membershipCount}
                onEdit={() => openEdit(plan)}
                onDeactivate={deactivating === plan.id ? undefined : () => handleDeactivate(plan)}
              />
            ))}
          </div>
        </div>
      )}

      {punchCardPlans.length > 0 && (
        <div className="mb-10">
          <p className={`${typography.mono.tiny} uppercase tracking-widest text-ash mb-4`}>{t('punchCards')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {punchCardPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                variant="admin"
                membershipCount={plan.membershipCount}
                onEdit={() => openEdit(plan)}
                onDeactivate={deactivating === plan.id ? undefined : () => handleDeactivate(plan)}
              />
            ))}
          </div>
        </div>
      )}

      {activePlans.length === 0 && (
        <div className="border border-dashed border-mustard-gold/40 p-8 text-center">
          <p className="text-timber font-mono text-sm">{t('noActivePlans')}</p>
        </div>
      )}

      {archivedPlans.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ash hover:text-ink transition-colors mb-4"
          >
            {showArchived ? '▲' : '▼'} {t('archivedPlans', { count: archivedPlans.length })}
          </button>

          {showArchived && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-60">
              {archivedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  variant="display"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {panelOpen && (
        <PlanFormPanel
          plan={editingPlan}
          onClose={closePanel}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
