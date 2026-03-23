'use client';

import { Filter } from 'iconoir-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatBookingDateParts } from '@/lib/schedule';
import { colors, icons, interactive } from '@/lib/design-tokens';
import { ListItem } from '@/components/ui/list-item';
import { Badge } from '@/components/ui/badge';
import type { MemberSummary } from '@/lib/mock-members';

interface MemberListProps {
  members: MemberSummary[];
}

function roleBadge(role: string) {
  if (role === 'admin') return <Badge>Admin</Badge>;
  if (role === 'host') return <Badge variant="outline">Host</Badge>;
  return null;
}


export function MemberList({ members }: MemberListProps) {
  const t = useTranslations('Members');
  const locale = useLocale();
  const dateLocale = locale === 'nl' ? 'nl-NL' : 'en-GB';

  return (
    <div>
      {/* Header bar: count + filter */}
      <div className="flex items-center justify-between pb-3">
        <span>
          {t('count', { count: members.length })}
        </span>
        <button
          type="button"
          className={`p-2 ${interactive.hoverInvert} ${interactive.transition} ${interactive.cursorPointer}`}
          aria-label={t('filterAria')}
          title="Filter (coming soon)"
        >
          <Filter
            width={icons.nav.size}
            height={icons.nav.size}
            strokeWidth={icons.nav.strokeWidth}
          />
        </button>
      </div>

      {/* Member list */}
      <div className={`border-t ${colors.borderSubtle}`}>
        {members.map((member) => {
          const name = member.lastName
            ? `${member.firstName} ${member.lastName}`
            : member.firstName;

          const bookingData = member.nextBooking || member.lastBooking;
          const bookingPrefix = member.nextBooking ? t('next') : member.lastBooking ? t('last') : null;

          const bookingLabel = bookingData ? (() => {
            const { weekday, date } = formatBookingDateParts(bookingData.dateISO, dateLocale);
            return (
              <>
                {bookingPrefix}:{' '}
                <span className="hidden sm:inline">{weekday} </span>
                {date}
              </>
            );
          })() : t('noBookings');

          return (
            <ListItem
              key={member.id}
              href={`/members/${member.id}`}
              label={name}
              badges={roleBadge(member.role)}
              secondaryLeft={bookingLabel}
              secondaryRight={member.plan || t('noPlan')}
            />
          );
        })}
      </div>
    </div>
  );
}
