'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavArrowLeft, Phone, Mail, WarningTriangle } from 'iconoir-react';
import { colors, typography, buttons, interactive, icons, feedback } from '@/lib/design-tokens';
import { genderLabel, membershipStatusLabel } from '@/lib/member';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListItem } from '@/components/ui/list-item';
import { Section } from '@/components/ui/section';
import { StatTile } from '@/components/ui/stat-tile';
import { Panel } from '@/components/ui/panel';
import { formatDateHuman } from '@/lib/schedule';
import type { MemberDetail as MemberDetailType } from '@/lib/mock-members';

type PanelType = 'contact' | 'emergency' | 'past-plans' | 'add-plan' | 'payment-history' | 'all-bookings' | null;

interface MemberDetailProps {
  member: MemberDetailType;
}


export function MemberDetail({ member }: MemberDetailProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const fullName = member.lastName
    ? `${member.firstName} ${member.lastName}`
    : member.firstName;

  const gender = genderLabel(member.gender);

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
        <span className={typography.mono.label}>Back to members</span>
      </Link>

      {/* Profile header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-display uppercase">{fullName}</h1>
          {gender && <Badge variant="muted">{gender}</Badge>}
        </div>
      </div>

      {/* Role + assign */}
      <Section title="Role">
        <div className="flex items-center justify-between md:justify-start md:gap-4">
          <div className="flex items-center gap-2">
            {member.role === 'admin' || member.role === 'superadmin' ? (
              <Badge>Admin</Badge>
            ) : member.role === 'host' ? (
              <Badge variant="outline">Host</Badge>
            ) : (
              <Badge variant="muted">Member</Badge>
            )}
          </div>
          {member.role === 'member' && (
            <button
              type="button"
              className={buttons.textAction}
            >
              Assign host
            </button>
          )}
          {member.role === 'host' && (
            <button
              type="button"
              className={buttons.textAction}
            >
              Remove host
            </button>
          )}
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="panel-secondary" onClick={() => setActivePanel('contact')}>Contact info</Button>
          <Button variant="panel-secondary" onClick={() => setActivePanel('emergency')} disabled={!member.emergencyContactName}>Emergency contact</Button>
        </div>
      </Section>

      {/* Plan */}
      <Section title="Current plan">
        {member.plan ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between md:justify-start md:gap-4">
              <span className="font-mono">{member.plan.name}</span>
              <Badge variant={membershipStatusLabel(member.plan.status).variant}>
                {membershipStatusLabel(member.plan.status).text}
              </Badge>
            </div>

            {member.plan.expiresAt && (
              <div className={`text-sm ${colors.textMuted}`}>
                Expires {formatDateHuman(member.plan.expiresAt)}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* disabled for now untill we are tracking plans */}
              <Button variant="panel-secondary" onClick={() => setActivePanel('past-plans')} disabled>Past plans</Button>
              <Button variant="panel-secondary" onClick={() => setActivePanel('add-plan')}>Add free plan</Button>
            </div>
          </div>
        ) : (
          <>
            <div className={`text-sm ${colors.textMuted} mb-3`}>-</div>
            <Button variant="panel-secondary" onClick={() => setActivePanel('add-plan')}>Add free plan</Button>
          </>
        )}
      </Section>

      {/* Statistics */}
      <Section title="Statistics">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <StatTile label="Member since" value={member.stats.memberSince} />
          <StatTile label="Confirmed bookings" value={member.stats.confirmedBookings} />
          <StatTile label="Cancelled" value={member.stats.cancelledBookings} />
          <StatTile label="No shows" value={member.stats.noShows} />
          <StatTile label="Most visited" value={member.stats.mostVisitedDay || '—'} />
        </div>
      </Section>

      {/* Payments */}
      <Section title="Payments due">
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
                {member.payments.failedCount > 0 && `${member.payments.failedCount} failed`}
                {member.payments.failedCount > 0 && member.payments.pendingCount > 0 && ', '}
                {member.payments.pendingCount > 0 && `${member.payments.pendingCount} pending`}
              </span>
            </div>
            <Button variant="panel-secondary" onClick={() => setActivePanel('payment-history')} className="w-full sm:w-auto">Payment history</Button>
          </div>
        ) : (
          <div className={`text-sm ${colors.textMuted}`}>-</div>
        )}
      </Section>

      {/* Bookings */}
      <Section title="Bookings">
        {member.upcomingBookings.length > 0 ? (
          <div className="space-y-0">
            <div className={`text-xs ${colors.textMuted} mb-2`}>
              Upcoming ({member.upcomingBookings.length})
            </div>
            {member.upcomingBookings.slice(0, 3).map((booking) => (
              <ListItem
                key={booking.id}
                label={`${booking.date}, ${booking.startTime}–${booking.endTime}`}
                secondaryLeft={booking.type || undefined}
              />
            ))}
          </div>
        ) : member.lastBooking ? (
          <div>
            <div className={`text-xs ${colors.textMuted} mb-2`}>
              Last booking
            </div>
            <ListItem
              label={`${member.lastBooking.date}, ${member.lastBooking.startTime}–${member.lastBooking.endTime}`}
              secondaryLeft={member.lastBooking.type || undefined}
            />
          </div>
        ) : (
          <div className={`text-sm ${colors.textMuted}`}>-</div>
        )}
        {(member.upcomingBookings.length > 0 || member.lastBooking) && (
          <div className="mt-3">
            <Button variant="panel-secondary" onClick={() => setActivePanel('all-bookings')} className="w-full sm:w-auto">All bookings</Button>
          </div>
        )}
      </Section>

      {/* === PANELS === */}

      {activePanel === 'contact' && (
        <Panel title="Contact info" onClose={() => setActivePanel(null)}>
          <div className="space-y-4">
            <div>
              <div className={`text-xs ${colors.textMuted} mb-1`}>Email</div>
              <a href={`mailto:${member.email}`} className={`flex items-center gap-2 ${interactive.link}`}>
                <Mail width={icons.action.size} height={icons.action.size} strokeWidth={icons.action.strokeWidth} />
                {member.email}
              </a>
            </div>
            <div>
              <div className={`text-xs ${colors.textMuted} mb-1`}>Phone</div>
              <a href={`tel:${member.phone}`} className={`flex items-center gap-2 ${interactive.link}`}>
                <Phone width={icons.action.size} height={icons.action.size} strokeWidth={icons.action.strokeWidth} />
                {member.phone}
              </a>
            </div>
          </div>
        </Panel>
      )}

      {activePanel === 'emergency' && member.emergencyContactName && (
        <Panel title="Emergency contact" onClose={() => setActivePanel(null)}>
          <div className="space-y-4">
            <div>
              <div className={`text-xs ${colors.textMuted} mb-1`}>Name</div>
              <div className="font-medium">{member.emergencyContactName}</div>
            </div>
            {member.emergencyContactPhone && (
              <div>
                <div className={`text-xs ${colors.textMuted} mb-1`}>Phone</div>
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
        <Panel title="Past plans" onClose={() => setActivePanel(null)}>
          <div className={`text-sm ${colors.textMuted}`}>
            No past plans to show.
          </div>
        </Panel>
      )}

      {activePanel === 'add-plan' && (
        <Panel title="Add free plan" onClose={() => setActivePanel(null)}>
          <div className="space-y-4">
            <p className="text-sm">
              Choose a plan to assign to this member for free (e.g. for volunteering or exchange).
            </p>
            <div className={`border-t ${colors.borderSubtle}`}>
              {/* TODO: get these plan values from database and create plan steps from here. */}
              {['Trial', '2 credits/month', '4 credits/month', '8 credits/month', 'Unlimited', 'Punch card (5)', 'Punch card (10)'].map((plan) => (
                <ListItem key={plan} label={plan} onClick={() => {}} />
              ))}
            </div>
            <p className={`text-xs ${colors.textMuted}`}>
              After selecting, you will set an expiry date.
            </p>
          </div>
        </Panel>
      )}

      {activePanel === 'payment-history' && (
        <Panel title="Payment history" onClose={() => setActivePanel(null)}>
          <div className={`text-sm ${colors.textMuted}`}>
            Payment history will be available when Mollie integration is connected.
          </div>
        </Panel>
      )}

      {activePanel === 'all-bookings' && (
        <Panel title="All bookings" onClose={() => setActivePanel(null)}>
          {member.upcomingBookings.length > 0 || member.lastBooking ? (
            <div className={`border-t ${colors.borderSubtle}`}>
              {member.upcomingBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  label={`${booking.date}, ${booking.startTime}–${booking.endTime}`}
                  secondaryLeft={booking.type || undefined}
                  badges={<Badge variant="outline">Upcoming</Badge>}
                />
              ))}
              {member.lastBooking && (
                <ListItem
                  label={`${member.lastBooking.date}, ${member.lastBooking.startTime}–${member.lastBooking.endTime}`}
                  secondaryLeft={member.lastBooking.type || undefined}
                  badges={<Badge variant="muted">Past</Badge>}
                />
              )}
            </div>
          ) : (
            <div className={`text-sm ${colors.textMuted}`}>No bookings found.</div>
          )}
        </Panel>
      )}
    </div>
  );
}
