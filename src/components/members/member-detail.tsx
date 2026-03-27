'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NavArrowLeft, Phone, Mail, WarningTriangle } from 'iconoir-react';
import { useTranslations, useLocale } from 'next-intl';
import { colors, typography, buttons, interactive, icons, feedback } from '@/lib/design-tokens';
import { genderLabel, membershipStatusLabel } from '@/lib/member';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListItem } from '@/components/ui/list-item';
import { Section } from '@/components/ui/section';
import { StatTile } from '@/components/ui/stat-tile';
import { Panel } from '@/components/ui/panel';
import { formatDateHuman, formatMonthYear, formatWeekdayName } from '@/lib/schedule';
import type { MemberDetail as MemberDetailType } from '@/lib/member';
import type { PlanRow } from '@/lib/plans';

type PanelType = 'contact' | 'emergency' | 'past-plans' | 'add-plan' | 'payment-history' | 'all-bookings' | null;

interface MemberDetailProps {
  member: MemberDetailType;
}

export function MemberDetail({ member }: MemberDetailProps) {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const t = useTranslations('Members');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const dateLocale = locale === 'nl' ? 'nl-NL' : 'en-GB';

  // Role assignment
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  async function handleRoleChange(newRole: 'host' | 'member') {
    setRoleLoading(true);
    setRoleError(null);
    const res = await fetch(`/api/members/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    setRoleLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      setRoleError(data.error ?? tCommon('somethingWentWrong'));
      return;
    }
    router.refresh();
  }

  // Add-plan panel state
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanRow | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [addPlanLoading, setAddPlanLoading] = useState(false);
  const [addPlanError, setAddPlanError] = useState<string | null>(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  async function handleWithdrawPlan() {
    setWithdrawLoading(true);
    setWithdrawError(null);
    const res = await fetch(`/api/members/${member.id}/membership`, { method: 'DELETE' });
    setWithdrawLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      setWithdrawError(data.error ?? tCommon('somethingWentWrong'));
      return;
    }
    router.refresh();
  }

  useEffect(() => {
    if (activePanel !== 'add-plan' || plans.length > 0) return;
    setPlansLoading(true);
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data: PlanRow[]) => setPlans(data))
      .catch(() => {})
      .finally(() => setPlansLoading(false));
  }, [activePanel, plans.length]);

  async function handleAddPlan() {
    if (!selectedPlan) return;
    setAddPlanLoading(true);
    setAddPlanError(null);
    const res = await fetch(`/api/members/${member.id}/membership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlan.id, expiresAt: expiryDate || null }),
    });
    setAddPlanLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      setAddPlanError(data.error ?? tCommon('somethingWentWrong'));
      return;
    }
    setSelectedPlan(null);
    setExpiryDate('');
    setActivePanel(null);
    router.refresh();
  }

  function closeAddPlan() {
    setSelectedPlan(null);
    setExpiryDate('');
    setAddPlanError(null);
    setActivePanel(null);
  }

  const fullName = member.lastName
    ? `${member.firstName} ${member.lastName}`
    : member.firstName;

  const gender = genderLabel(member.gender);

  function statusLabel(status: string) {
    const statusMap: Record<string, Parameters<typeof t>[0]> = {
      active: 'statusActive',
      expired: 'statusExpired',
      payment_pending: 'statusPaymentPending',
      suspended: 'statusSuspended',
      cancelled: 'statusCancelled',
    };
    const key = statusMap[status] ?? 'statusActive';
    return { text: t(key), variant: membershipStatusLabel(status).variant };
  }

  function paymentStatusLabel(status: string) {
    switch (status) {
      case 'succeeded': return { text: t('paymentStatusSucceeded'), variant: 'default' as const };
      case 'pending': return { text: t('pending'), variant: 'outline' as const };
      case 'failed': return { text: t('failed'), variant: 'muted' as const };
      case 'refunded': return { text: t('paymentStatusRefunded'), variant: 'muted' as const };
      default: return { text: status, variant: 'muted' as const };
    }
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/members"
        className={`inline-flex items-center gap-2 mb-6 hover:opacity-60 ${interactive.transition} -ml-2`}
      >
        <NavArrowLeft
          width={icons.action.size}
          height={icons.action.size}
          strokeWidth={icons.action.strokeWidth}
        />
        <span className={typography.mono.label}>{t('backToMembers')}</span>
      </Link>

      {/* Profile header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-display">{fullName}</h1>
          {gender && <Badge variant="muted">{gender}</Badge>}
        </div>
      </div>

      {/* Role + assign */}
      <Section title={t('role')}>
        <div className="flex items-center justify-between md:justify-start md:gap-4">
          <div className="flex items-center gap-2">
            {member.role === 'admin' || member.role === 'superadmin' ? (
              <Badge>Admin</Badge>
            ) : member.role === 'host' ? (
              <Badge variant="outline">Host</Badge>
            ) : (
              <Badge variant="muted">{t('roleMember')}</Badge>
            )}
          </div>
          {member.role === 'member' && (
            <button
              type="button"
              onClick={() => handleRoleChange('host')}
              disabled={roleLoading}
              className={buttons.textAction}
            >
              {roleLoading ? t('assigningRole') : t('assignHost')}
            </button>
          )}
          {member.role === 'host' && (
            <button
              type="button"
              onClick={() => handleRoleChange('member')}
              disabled={roleLoading}
              className={buttons.textAction}
            >
              {roleLoading ? t('assigningRole') : t('removeHost')}
            </button>
          )}
        </div>
        {roleError && (
          <div className={`mt-2 ${feedback.errorBox}`}>
            <span className={feedback.errorText}>{roleError}</span>
          </div>
        )}
      </Section>

      {/* Contact */}
      <Section title={t('contact')}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" onClick={() => setActivePanel('contact')} className="sm:w-auto">{t('contactInfo')}</Button>
          <Button variant="secondary" onClick={() => setActivePanel('emergency')} disabled={!member.emergencyContactName} className="sm:w-auto">{t('emergencyContact')}</Button>
        </div>
      </Section>

      {/* Plan */}
      <Section title={t('currentPlan')}>
        {member.plan ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between md:justify-start md:gap-4">
              <span className="font-mono">{member.plan.name}</span>
              <Badge variant={statusLabel(member.plan.status).variant}>
                {statusLabel(member.plan.status).text}
              </Badge>
            </div>
            {member.plan.expiresAt && (
              <div className={`text-sm ${colors.textMuted}`}>
                {t('expires', { date: formatDateHuman(member.plan.expiresAt, dateLocale) })}
              </div>
            )}
          </div>
        ) : (
          <div className={`text-sm ${colors.textMuted}`}>-</div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          {member.pastMemberships.length > 0 && (
            <Button variant="secondary" onClick={() => setActivePanel('past-plans')} className="sm:w-auto">{t('pastPlans')}</Button>
          )}
          <Button variant="primary" onClick={() => setActivePanel('add-plan')} className="sm:w-auto">{t('addFreePlan')}</Button>
          {member.plan?.isFreeAdminPlan && (
            <button
              type="button"
              onClick={handleWithdrawPlan}
              disabled={withdrawLoading}
              className={buttons.textAction}
            >
              {withdrawLoading ? t('withdrawingPlan') : t('withdrawFreePlan')}
            </button>
          )}
        </div>
        {withdrawError && (
          <div className={`mt-2 ${feedback.errorBox}`}>
            <span className={feedback.errorText}>{withdrawError}</span>
          </div>
        )}
      </Section>

      {/* Statistics */}
      <Section title={t('statistics')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <StatTile label={t('memberSince')} value={formatMonthYear(member.stats.memberSince, dateLocale)} />
          <StatTile label={t('confirmedBookings')} value={member.stats.confirmedBookings} />
          <StatTile label={t('cancelled')} value={member.stats.cancelledBookings} />
          <StatTile label={t('noShows')} value={member.stats.noShows} />
          <StatTile label={t('mostVisited')} value={member.stats.mostVisitedDay !== null ? formatWeekdayName(member.stats.mostVisitedDay, dateLocale) : '—'} />
        </div>
      </Section>

      {/* Payments */}
      <Section title={t('paymentsDue')}>
        {member.payments.hasDue && (
          <div className={`${feedback.errorBox} flex items-center gap-2 mb-3`}>
            <WarningTriangle
              width={icons.action.size}
              height={icons.action.size}
              strokeWidth={icons.action.strokeWidth}
            />
            <span className={feedback.errorText}>
              {member.payments.failedCount > 0 && `${member.payments.failedCount} ${t('failed')}`}
              {member.payments.failedCount > 0 && member.payments.pendingCount > 0 && ', '}
              {member.payments.pendingCount > 0 && `${member.payments.pendingCount} ${t('pending')}`}
            </span>
          </div>
        )}
        {member.payments.history.length > 0 ? (
          <Button variant="secondary" onClick={() => setActivePanel('payment-history')} className="sm:w-auto">{t('paymentHistory')}</Button>
        ) : (
          <div className={`text-sm ${colors.textMuted}`}>-</div>
        )}
      </Section>

      {/* Bookings */}
      <Section title={t('bookings')}>
        {member.upcomingBookings.length > 0 ? (
          <div className="space-y-0">
            <div className={`text-xs ${colors.textMuted} mb-2`}>
              {t('upcoming', { count: member.upcomingBookings.length })}
            </div>
            {member.upcomingBookings.slice(0, 3).map((booking) => (
              <ListItem
                key={booking.id}
                label={`${formatDateHuman(booking.dateISO, dateLocale)}, ${booking.startTime}–${booking.endTime}`}
                secondaryLeft={booking.type || undefined}
              />
            ))}
          </div>
        ) : member.pastBookings[0] ? (
          <div>
            <div className={`text-xs ${colors.textMuted} mb-2`}>
              {t('lastBooking')}
            </div>
            <ListItem
              label={`${formatDateHuman(member.pastBookings[0].dateISO, dateLocale)}, ${member.pastBookings[0].startTime}–${member.pastBookings[0].endTime}`}
              secondaryLeft={member.pastBookings[0].type || undefined}
            />
          </div>
        ) : (
          <div className={`text-sm ${colors.textMuted}`}>-</div>
        )}
        {(member.upcomingBookings.length > 0 || member.pastBookings.length > 0) && (
          <div className="mt-3">
            <Button variant="secondary" onClick={() => setActivePanel('all-bookings')} className="sm:w-auto">{t('allBookings')}</Button>
          </div>
        )}
      </Section>

      {/* === PANELS === */}

      {activePanel === 'contact' && (
        <Panel title={t('contactInfo')} onClose={() => setActivePanel(null)}>
          <div className="space-y-4">
            <div>
              <div className={`text-xs ${colors.textMuted} mb-1`}>{t('emailLabel')}</div>
              <a href={`mailto:${member.email}`} className={`flex items-center gap-2 ${interactive.link}`}>
                <Mail width={icons.action.size} height={icons.action.size} strokeWidth={icons.action.strokeWidth} />
                {member.email}
              </a>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted} mb-1`}>{t('phoneLabel')}</div>
              <a href={`tel:${member.phone}`} className={`flex items-center gap-2 ${interactive.link}`}>
                <Phone width={icons.action.size} height={icons.action.size} strokeWidth={icons.action.strokeWidth} />
                {member.phone}
              </a>
            </div>
          </div>
        </Panel>
      )}

      {activePanel === 'emergency' && member.emergencyContactName && (
        <Panel title={t('emergencyContact')} onClose={() => setActivePanel(null)}>
          <div className="space-y-4">
            <div>
              <div className={`text-xs ${colors.textMuted} mb-1`}>{t('emergencyNameLabel')}</div>
              <div className="font-medium">{member.emergencyContactName}</div>
            </div>
            {member.emergencyContactPhone && (
              <div>
                <div className={`text-xs ${colors.textMuted} mb-1`}>{t('phoneLabel')}</div>
                <a href={`tel:${member.emergencyContactPhone}`} className={`flex items-center gap-2 ${interactive.link}`}>
                  <Phone width={icons.action.size} height={icons.action.size} strokeWidth={icons.action.strokeWidth} />
                  {member.emergencyContactPhone}
                </a>
              </div>
            )}
          </div>
        </Panel>
      )}

      {activePanel === 'past-plans' && (
        <Panel title={t('pastPlans')} onClose={() => setActivePanel(null)}>
          {member.pastMemberships.length > 0 ? (
            <div className={"divide-y divide-ink/10"}>
              {member.pastMemberships.map((m) => (
                <ListItem
                  key={m.id}
                  label={m.planName}
                  secondaryLeft={formatDateHuman(m.startsAt, dateLocale)}
                  secondaryRight={m.expiresAt ? formatDateHuman(m.expiresAt, dateLocale) : undefined}
                  badges={<Badge variant={statusLabel(m.status).variant}>{statusLabel(m.status).text}</Badge>}
                />
              ))}
            </div>
          ) : (
            <div className={`text-sm ${colors.textMuted}`}>{t('noPastPlans')}</div>
          )}
        </Panel>
      )}

      {activePanel === 'add-plan' && (
        <Panel title={t('addFreePlan')} onClose={closeAddPlan}>
          {selectedPlan ? (
            <div className="space-y-4">
              <div className="text-sm font-mono">{selectedPlan.name}</div>
              <div>
                <div className={`text-xs ${colors.textMuted} mb-1`}>{t('expiryDateLabel')}</div>
                <input
                  type="date"
                  value={expiryDate}
                  min={new Date().toLocaleDateString('en-CA')}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-full border px-3 py-2 text-sm font-mono ${colors.borderSubtle} bg-transparent`}
                />
              </div>
              {selectedPlan.isTrial && member.hasHadSubscription && (
                <div className={feedback.alertError}>
                  <p className="font-mono text-sm">
                    This member has already had a subscription. Trial plans are only available to first-time subscribers.
                  </p>
                </div>
              )}
              {addPlanError && (
                <div className={feedback.errorBox}>
                  <span className={feedback.errorText}>{addPlanError}</span>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => { setSelectedPlan(null); setAddPlanError(null); }} className="flex-1">
                  ← {t('back')}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddPlan}
                  disabled={addPlanLoading || !expiryDate || expiryDate < new Date().toLocaleDateString('en-CA')}
                  className="flex-1"
                >
                  {addPlanLoading ? t('assigningRole') : t('confirm')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">{t('addFreePlanDescription')}</p>
              <p className={`text-xs ${colors.textMuted}`}>{t('addFreePlanAfter')}</p>
              <div className={"divide-y divide-ink/10"}>
                {plansLoading ? (
                  <div className={`py-4 text-sm ${colors.textMuted}`}>{t('filterPlanLoading')}</div>
                ) : plans.length === 0 ? (
                  <div className={`py-4 text-sm ${colors.textMuted}`}>{t('filterPlanNone')}</div>
                ) : (
                  plans.map((plan) => (
                    <ListItem key={plan.id} label={plan.name} onClick={() => setSelectedPlan(plan)} />
                  ))
                )}
              </div>
            </div>
          )}
        </Panel>
      )}

      {activePanel === 'payment-history' && (
        <Panel title={t('paymentHistory')} onClose={() => setActivePanel(null)}>
          {member.payments.history.length > 0 ? (
            <div className={"divide-y divide-ink/10"}>
              {member.payments.history.map((payment) => {
                const label = payment.planName ?? t('walkIn');
                const date = new Date(payment.createdAt).toLocaleDateString(dateLocale, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const amount = `€${(payment.amountCents / 100).toFixed(2)}`;
                const { text, variant } = paymentStatusLabel(payment.status);
                return (
                  <ListItem
                    key={payment.id}
                    label={label}
                    secondaryLeft={date}
                    secondaryRight={amount}
                    badges={<Badge variant={variant}>{text}</Badge>}
                  />
                );
              })}
            </div>
          ) : (
            <div className={`text-sm ${colors.textMuted}`}>{t('noPaymentsFound')}</div>
          )}
        </Panel>
      )}

      {activePanel === 'all-bookings' && (
        <Panel title={t('allBookings')} onClose={() => setActivePanel(null)}>
          {member.upcomingBookings.length > 0 || member.pastBookings.length > 0 ? (
            <div className={"divide-y divide-ink/10"}>
              {member.upcomingBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  label={`${formatDateHuman(booking.dateISO, dateLocale)}, ${booking.startTime}–${booking.endTime}`}
                  secondaryLeft={booking.type || undefined}
                  badges={<Badge variant="outline">{t('upcomingBadge')}</Badge>}
                />
              ))}
              {member.pastBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  label={`${formatDateHuman(booking.dateISO, dateLocale)}, ${booking.startTime}–${booking.endTime}`}
                  secondaryLeft={booking.type || undefined}
                  badges={
                    booking.status === 'no_show'
                      ? <Badge variant="muted">{t('noShows')}</Badge>
                      : booking.status === 'cancelled'
                        ? <Badge variant="muted">{t('cancelled')}</Badge>
                        : <Badge variant="muted">{t('pastBadge')}</Badge>
                  }
                />
              ))}
            </div>
          ) : (
            <div className={`text-sm ${colors.textMuted}`}>{t('noBookingsFound')}</div>
          )}
        </Panel>
      )}
    </div>
  );
}
