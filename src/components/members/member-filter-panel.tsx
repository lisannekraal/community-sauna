'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { CheckboxItem } from '@/components/ui/checkbox-item';
import { typography, colors } from '@/lib/design-tokens';
import { GENDER_OPTIONS } from '@/lib/member';
import type { PlanRow } from '@/lib/plans';

export interface FilterState {
  roles: ('admin' | 'host')[];
  genders: string[];
  plans: string[];
  hasNoShows: boolean;
  paymentStatuses: ('pending' | 'failed')[];
}

export const DEFAULT_FILTERS: FilterState = {
  roles: [],
  genders: [],
  plans: [],
  hasNoShows: false,
  paymentStatuses: [],
};

export function isFiltered(filters: FilterState): boolean {
  return (
    filters.roles.length > 0 ||
    filters.genders.length > 0 ||
    filters.plans.length > 0 ||
    filters.hasNoShows ||
    filters.paymentStatuses.length > 0
  );
}

interface MemberFilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
}

export function MemberFilterPanel({ filters, onChange, onClose }: MemberFilterPanelProps) {
  const t = useTranslations('Members');
  const tGender = useTranslations('Gender');
  const [plans, setPlans] = useState<{ id: number; name: string }[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data: PlanRow[]) => setPlans(data.map((p) => ({ id: p.id, name: p.name }))))
      .catch(() => {})
      .finally(() => setPlansLoading(false));
  }, []);

  function toggle<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  const genderOptions = GENDER_OPTIONS.map((opt) => ({ value: opt.value, label: tGender(opt.key) }));

  const hasFilters = isFiltered(filters);

  return (
    <Panel
      title={t('filterTitle')}
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => onChange(DEFAULT_FILTERS)}
            disabled={!hasFilters}
            className="flex-1"
          >
            {t('filterReset')}
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            {t('filterApply')}
          </Button>
        </div>
      }
    >
      {/* Role */}
      <FilterSection title={t('filterRoleLabel')}>
        {(['admin', 'host'] as const).map((role) => (
          <CheckboxItem
            key={role}
            label={role === 'admin' ? t('filterRoleAdmin') : t('filterRoleHost')}
            checked={filters.roles.includes(role)}
            onChange={() => onChange({ ...filters, roles: toggle(filters.roles, role) })}
          />
        ))}
      </FilterSection>

      {/* Gender */}
      <FilterSection title={t('filterGenderLabel')}>
        {genderOptions.map((opt) => (
          <CheckboxItem
            key={opt.value}
            label={opt.label}
            checked={filters.genders.includes(opt.value)}
            onChange={() => onChange({ ...filters, genders: toggle(filters.genders, opt.value) })}
          />
        ))}
      </FilterSection>

      {/* Plan */}
      <FilterSection title={t('filterPlanLabel')}>
        {plansLoading ? (
          <span className={`${typography.mono.caption} ${colors.textDisabled}`}>
            {t('filterPlanLoading')}
          </span>
        ) : plans.length === 0 ? (
          <span className={`${typography.mono.caption} ${colors.textDisabled}`}>
            {t('filterPlanNone')}
          </span>
        ) : (
          plans.map((plan) => (
            <CheckboxItem
              key={plan.id}
              label={plan.name}
              checked={filters.plans.includes(plan.name)}
              onChange={() => onChange({ ...filters, plans: toggle(filters.plans, plan.name) })}
            />
          ))
        )}
      </FilterSection>

      {/* Behaviour */}
      <FilterSection title={t('filterExtra')}>
        <CheckboxItem
          label={t('filterHasNoShows')}
          checked={filters.hasNoShows}
          onChange={() => onChange({ ...filters, hasNoShows: !filters.hasNoShows })}
        />
      </FilterSection>

      {/* Payment status */}
      <FilterSection title={t('filterPaymentLabel')}>
        {(['pending', 'failed'] as const).map((status) => (
          <CheckboxItem
            key={status}
            label={status === 'pending' ? t('filterPaymentPending') : t('filterPaymentFailed')}
            checked={filters.paymentStatuses.includes(status)}
            onChange={() =>
              onChange({ ...filters, paymentStatuses: toggle(filters.paymentStatuses, status) })
            }
          />
        ))}
      </FilterSection>
    </Panel>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className={`${typography.mono.label} opacity-60 mb-2`}>{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

