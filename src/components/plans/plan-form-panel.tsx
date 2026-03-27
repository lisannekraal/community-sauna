'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { CheckboxItem } from '@/components/ui/checkbox-item';
import { feedback, inputs, colors } from '@/lib/design-tokens';
import type { AdminPlanRow } from '@/app/api/plans/admin/route';

interface PlanFormPanelProps {
  plan?: AdminPlanRow;
  onClose: () => void;
  onSaved: () => void;
}

type FormState = {
  name: string;
  description: string;
  type: 'subscription' | 'punch_card';
  priceEuros: string;
  creditsPerMonth: string;
  totalCredits: string;
  validityMonths: string;
  minimumCommitmentMonths: string;
  autoRenew: boolean;
};

function planToForm(plan?: AdminPlanRow): FormState {
  if (!plan) {
    return {
      name: '',
      description: '',
      type: 'subscription',
      priceEuros: '',
      creditsPerMonth: '',
      totalCredits: '',
      validityMonths: '',
      minimumCommitmentMonths: '',
      autoRenew: false,
    };
  }
  return {
    name: plan.name,
    description: plan.description,
    type: plan.type as 'subscription' | 'punch_card',
    priceEuros: plan.priceCents === 0 ? '0' : String(plan.priceCents / 100),
    creditsPerMonth: plan.creditsPerMonth !== null ? String(plan.creditsPerMonth) : '',
    totalCredits: plan.totalCredits !== null ? String(plan.totalCredits) : '',
    validityMonths: plan.validityMonths !== null ? String(plan.validityMonths) : '',
    minimumCommitmentMonths: plan.minimumCommitmentMonths !== null ? String(plan.minimumCommitmentMonths) : '',
    autoRenew: plan.autoRenew,
  };
}

function formToComparable(f: FormState) {
  return JSON.stringify(f);
}

export function PlanFormPanel({ plan, onClose, onSaved }: PlanFormPanelProps) {
  const t = useTranslations('Plans');
  const tCommon = useTranslations('Common');

  const isEditing = !!plan;
  const hasMembers = isEditing && plan.membershipCount > 0;

  const initialForm = planToForm(plan);
  const [form, setForm] = useState<FormState>(() => initialForm);
  const isDirty = formToComparable(form) !== formToComparable(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (isEditing && !isDirty) {
      onClose();
      return;
    }

    if (!form.name.trim() || !form.description.trim() || form.priceEuros === '') {
      setError(t('requiredFields'));
      return;
    }

    const priceCents = Math.round(parseFloat(form.priceEuros) * 100);
    if (isNaN(priceCents) || priceCents < 0) {
      setError(t('invalidPrice'));
      return;
    }

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      priceCents,
      creditsPerMonth: form.type === 'subscription' && form.creditsPerMonth !== ''
        ? parseInt(form.creditsPerMonth, 10) : null,
      totalCredits: form.type === 'punch_card' && form.totalCredits !== ''
        ? parseInt(form.totalCredits, 10) : null,
      validityMonths: form.validityMonths !== '' ? parseInt(form.validityMonths, 10) : null,
      minimumCommitmentMonths: form.type === 'subscription' && form.minimumCommitmentMonths !== ''
        ? parseInt(form.minimumCommitmentMonths, 10) : null,
      autoRenew: form.autoRenew,
    };

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        isEditing ? `/api/plans/${plan.id}` : '/api/plans',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('failedToSave'));
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }

  const title = isEditing ? t('editPlan') : t('addPlan');
  const saveLabel = hasMembers ? t('saveNewVersion') : isEditing ? t('save') : t('createPlan');

  return (
    <Panel
      title={title}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} loadingText={t('saving')}>
            {saveLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {hasMembers && (
          <div className={feedback.alertError}>
            <p className="font-mono text-sm">
              ⚠ {t('warningMembersOnPlan', { count: plan.membershipCount })}
            </p>
          </div>
        )}

        {error && (
          <div className={feedback.errorBox}>
            <p className={feedback.errorText}>{error}</p>
          </div>
        )}

        <FormInput
          label={t('form.name')}
          name="name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />

        <div>
          <label className={inputs.label}>{t('form.description')}</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className={`${inputs.base} ${colors.borderPrimary} resize-none`}
          />
        </div>

        {!isEditing && (
          <div>
            <label className={inputs.label}>{t('form.type')}</label>
            <div className="flex gap-4 mt-1">
              {(['subscription', 'punch_card'] as const).map((typeOption) => (
                <label key={typeOption} className="flex items-center gap-2 cursor-pointer font-mono text-sm">
                  <input
                    type="radio"
                    name="type"
                    value={typeOption}
                    checked={form.type === typeOption}
                    onChange={() => set('type', typeOption)}
                    className="accent-mustard-gold"
                  />
                  {typeOption === 'subscription' ? t('form.typeSubscription') : t('form.typePunchCard')}
                </label>
              ))}
            </div>
          </div>
        )}

        {isEditing && (
          <div>
            <label className={inputs.label}>{t('form.type')}</label>
            <p className="font-mono text-sm text-timber mt-1">
              {t('form.typeLocked', {
                type: form.type === 'subscription' ? t('form.typeSubscription') : t('form.typePunchCard'),
              })}
            </p>
          </div>
        )}

        <FormInput
          label={t('form.price')}
          name="priceEuros"
          type="number"
          min="0"
          step="0.01"
          value={form.priceEuros}
          onChange={(e) => set('priceEuros', e.target.value)}
          hint={t('form.priceHint')}
          required
        />

        {form.type === 'subscription' && (
          <FormInput
            label={t('form.creditsPerMonth')}
            name="creditsPerMonth"
            type="number"
            min="0"
            value={form.creditsPerMonth}
            onChange={(e) => set('creditsPerMonth', e.target.value)}
            hint={t('form.creditsPerMonthHint')}
          />
        )}

        {form.type === 'punch_card' && (
          <FormInput
            label={t('form.totalCredits')}
            name="totalCredits"
            type="number"
            min="1"
            value={form.totalCredits}
            onChange={(e) => set('totalCredits', e.target.value)}
          />
        )}

        <FormInput
          label={t('form.validityMonths')}
          name="validityMonths"
          type="number"
          min="1"
          value={form.validityMonths}
          onChange={(e) => set('validityMonths', e.target.value)}
          hint={form.type === 'subscription' ? t('form.validityHintSubscription') : t('form.validityHintPunchCard')}
        />

        {form.type === 'subscription' && (
          <FormInput
            label={t('form.minimumCommitment')}
            name="minimumCommitmentMonths"
            type="number"
            min="1"
            value={form.minimumCommitmentMonths}
            onChange={(e) => set('minimumCommitmentMonths', e.target.value)}
          />
        )}

        {form.type === 'subscription' && (
          <CheckboxItem
            label={t('form.autoRenew')}
            checked={form.autoRenew}
            onChange={() => set('autoRenew', !form.autoRenew)}
          />
        )}
      </div>
    </Panel>
  );
}
