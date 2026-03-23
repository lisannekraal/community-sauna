'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import type { MemberDetail as MemberDetailType } from '@/lib/mock-members';

type PanelType = 'contact' | 'emergency' | 'past-plans' | 'add-plan' | 'payment-history' | 'all-bookings' | null;

interface MemberDetailProps {
  member: MemberDetailType;
}


export function MemberDetail({ member }: MemberDetailProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const t = useTranslations('Members');
  const locale = useLocale();
  const dateLocale = locale === 'nl' ? 'nl-NL' : 'en-GB';

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

  return (
    <div>
      {/* Back link */}
      <Link
        href="/members"
        className={`inline-flex items-center gap-2 mb-6 ${interactive.hoverInvert} ${interactive.transition} px-2 py-1 -ml-2`}
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
              className={buttons.textAction}
            >
              {t('assignHost')}
            </button>
          )}
          {member.role === 'host' && (
            <button
              type="button"
              className={buttons.textAction}
            >
              {t('removeHost')}
            </button>
          )}
        </div>
      </Section>

      {/* Contact */}
      <Section title={t('contact')}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="panel-secondary" onClick={() => setActivePanel('contact')}>{t('contactInfo')}</Button>
          <Button variant="panel-secondary" onClick={() => setActivePanel('emergency')} disabled={!member.emergencyContactName}>{t('emergencyContact')}</Button>
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
            <div className="flex flex-col sm:flex-row gap-3">
              {/* disabled for now untill we are tracking plans */}
              <Button variant="panel-secondary" onClick={() => setActivePanel('past-plans')} disabled>{t('pastPlans')}</Button>
              <Button variant="panel-secondary" onClick={() => setActivePanel('add-plan')}>{t('addFreePlan')}</Button>
            </div>
          </div>
        ) : (
          <>
            <div className={`text-sm ${colors.textMuted} mb-3`}>-</div>
            <Button variant="panel-secondary" onClick={() => setActivePanel('add-plan')}>{t('addFreePlan')}</Button>
          </>
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
        {/* TODO: improve logic: only warnings depending on payment statusses, only all payments if any payments at all */}
        {member.payments.hasDue ? (
          <div className="space-y-3">
            <div className={`${feedback.errorBox} flex items-center gap-2`}>
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
            <Button variant="panel-secondary" onClick={() => setActivePanel('payment-history')} className="w-full sm:w-auto">{t('paymentHistory')}</Button>
          </div>
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
        ) : member.lastBooking ? (
          <div>
            <div className={`text-xs ${colors.textMuted} mb-2`}>
              {t('lastBooking')}
            </div>
            <ListItem
              label={`${formatDateHuman(member.lastBooking.dateISO, dateLocale)}, ${member.lastBooking.startTime}–${member.lastBooking.endTime}`}
              secondaryLeft={member.lastBooking.type || undefined}
            />
          </div>
        ) : (
          <div className={`text-sm ${colors.textMuted}`}>-</div>
        )}
        {(member.upcomingBookings.length > 0 || member.lastBooking) && (
          <div className="mt-3">
            <Button variant="panel-secondary" onClick={() => setActivePanel('all-bookings')} className="w-full sm:w-auto">{t('allBookings')}</Button>
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
          <div className={`text-sm ${colors.textMuted}`}>
            {t('noPastPlans')}
          </div>
        </Panel>
      )}

      {activePanel === 'add-plan' && (
        <Panel title={t('addFreePlan')} onClose={() => setActivePanel(null)}>
          <div className="space-y-4">
            <p className="text-sm">
              {t('addFreePlanDescription')}
            </p>
            <div className={`border-t ${colors.borderSubtle}`}>
              {/* TODO: get these plan values from database and create plan steps from here. */}
              {['Trial', '2 credits/month', '4 credits/month', '8 credits/month', 'Unlimited', 'Punch card (5)', 'Punch card (10)'].map((plan) => (
                <ListItem key={plan} label={plan} onClick={() => {}} />
              ))}
            </div>
            <p className={`text-xs ${colors.textMuted}`}>
              {t('addFreePlanAfter')}
            </p>
          </div>
        </Panel>
      )}

      {activePanel === 'payment-history' && (
        <Panel title={t('paymentHistory')} onClose={() => setActivePanel(null)}>
          <div className={`text-sm ${colors.textMuted}`}>
            {t('paymentHistoryPending')}
          </div>
        </Panel>
      )}

      {activePanel === 'all-bookings' && (
        <Panel title={t('allBookings')} onClose={() => setActivePanel(null)}>
          {member.upcomingBookings.length > 0 || member.lastBooking ? (
            <div className={`border-t ${colors.borderSubtle}`}>
              {member.upcomingBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  label={`${formatDateHuman(booking.dateISO, dateLocale)}, ${booking.startTime}–${booking.endTime}`}
                  secondaryLeft={booking.type || undefined}
                  badges={<Badge variant="outline">{t('upcomingBadge')}</Badge>}
                />
              ))}
              {member.lastBooking && (
                <ListItem
                  label={`${formatDateHuman(member.lastBooking.dateISO, dateLocale)}, ${member.lastBooking.startTime}–${member.lastBooking.endTime}`}
                  secondaryLeft={member.lastBooking.type || undefined}
                  badges={<Badge variant="muted">{t('pastBadge')}</Badge>}
                />
              )}
            </div>
          ) : (
            <div className={`text-sm ${colors.textMuted}`}>{t('noBookingsFound')}</div>
          )}
        </Panel>
      )}
    </div>
  );
}
