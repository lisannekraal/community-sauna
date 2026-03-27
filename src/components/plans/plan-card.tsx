'use client';

import { EditPencil, Trash } from 'iconoir-react';
import { useTranslations } from 'next-intl';
import { type PlanRow, formatPrice, formatPeriod, formatSessions, formatDetail } from '@/lib/plans';
import { icons } from '@/lib/design-tokens';

export type PlanCardVariant = 'display' | 'admin' | 'member';

interface PlanCardProps {
  plan: PlanRow;
  variant?: PlanCardVariant;
  membershipCount?: number;
  isCurrentPlan?: boolean;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export function PlanCard({
  plan,
  variant = 'display',
  membershipCount,
  isCurrentPlan,
  onEdit,
  onDeactivate,
}: PlanCardProps) {
  const t = useTranslations('Plans');

  if (plan.type === 'punch_card') {
    return (
      <div className="border border-mustard-gold p-5 bg-paper flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg">{plan.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ash mt-1">
              {formatSessions(plan)} · {formatDetail(plan)}
            </div>
            {variant === 'admin' && membershipCount !== undefined && (
              <div className="font-mono text-[10px] uppercase tracking-widest text-timber mt-1">
                {t('memberCount', { count: membershipCount })}
              </div>
            )}
          </div>
          <div className="font-mono text-2xl shrink-0 text-deep-crimson">{formatPrice(plan.priceCents)}</div>
        </div>

        {variant === 'admin' && (onEdit || onDeactivate) && (
          <div className="flex items-center gap-2 border-t border-mustard-gold/20 pt-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider hover:text-mustard-gold transition-colors"
              >
                <EditPencil {...icons.action} />
                {t('edit')}
              </button>
            )}
            {onDeactivate && (
              <button
                onClick={onDeactivate}
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-timber hover:text-deep-crimson transition-colors ml-auto"
              >
                <Trash {...icons.action} />
                {t('deactivate')}
              </button>
            )}
          </div>
        )}

        {variant === 'member' && (
          <div className="border-t border-mustard-gold/20 pt-3">
            {isCurrentPlan ? (
              <span className="font-mono text-[11px] uppercase tracking-wider text-mustard-gold">{t('currentPlan')}</span>
            ) : (
              <button className="font-mono text-[11px] uppercase tracking-wider border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors">
                {t('buy')}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Subscription card (tall layout)
  return (
    <div className="border border-mustard-gold p-5 flex flex-col bg-paper">
      <div className="text-lg leading-tight mb-3">{plan.name}</div>
      <div className="font-mono text-2xl leading-none mb-1 text-deep-crimson">{formatPrice(plan.priceCents)}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest mb-1 text-ash">
        {formatPeriod(plan)}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest mb-5 text-timber">
        {formatSessions(plan)}
      </div>

      {variant === 'admin' && membershipCount !== undefined && (
        <div className="font-mono text-[10px] uppercase tracking-widest text-timber mb-3">
          {t('memberCount', { count: membershipCount })}
        </div>
      )}

      <div className="border-t border-mustard-gold/10 pt-4 mt-auto">
        <p className="text-xs leading-relaxed text-timber">{formatDetail(plan)}</p>
      </div>

      {variant === 'admin' && (onEdit || onDeactivate) && (
        <div className="flex items-center gap-2 border-t border-mustard-gold/20 pt-3 mt-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider hover:text-mustard-gold transition-colors"
            >
              <EditPencil {...icons.action} />
              {t('edit')}
            </button>
          )}
          {onDeactivate && (
            <button
              onClick={onDeactivate}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-timber hover:text-deep-crimson transition-colors ml-auto"
            >
              <Trash {...icons.action} />
              {t('deactivate')}
            </button>
          )}
        </div>
      )}

      {variant === 'member' && (
        <div className="border-t border-mustard-gold/20 pt-3 mt-3">
          {isCurrentPlan ? (
            <span className="font-mono text-[11px] uppercase tracking-wider text-mustard-gold">{t('currentPlan')}</span>
          ) : (
            <button className="font-mono text-[11px] uppercase tracking-wider border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors">
              {t('buy')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
