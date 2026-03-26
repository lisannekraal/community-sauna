'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Filter } from 'iconoir-react';
import { formatBookingDateParts } from '@/lib/schedule';
import { colors, icons, interactive, typography } from '@/lib/design-tokens';
import { ListItem } from '@/components/ui/list-item';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import type { MemberSummary } from '@/lib/mock-members';
import {
  MemberFilterPanel,
  DEFAULT_FILTERS,
  isFiltered,
  type FilterState,
} from './member-filter-panel';

const PAGE_SIZE = 20;

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

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredMembers = useMemo(() => {
    let result = members;

    if (filters.roles.length > 0) {
      result = result.filter((m) => filters.roles.includes(m.role as 'admin' | 'host'));
    }
    if (filters.genders.length > 0) {
      result = result.filter((m) => {
        const g = m.gender === null ? 'not_set' : m.gender;
        return filters.genders.includes(g);
      });
    }
    if (filters.plans.length > 0) {
      result = result.filter((m) => m.plan !== null && filters.plans.includes(m.plan));
    }
    if (filters.hasNoShows) {
      result = result.filter((m) => m.noShows > 0);
    }
    if (filters.paymentStatuses.length > 0) {
      result = result.filter(
        (m) =>
          m.paymentStatus !== null &&
          filters.paymentStatuses.includes(m.paymentStatus as 'pending' | 'failed'),
      );
    }

    return result;
  }, [members, filters]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  // Infinite scroll: observe sentinel when there are more items to show
    // If past 500 members implement server side 
  const hasMore = visibleCount < filteredMembers.length;
  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { rootMargin: '100px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);
  const filtered = isFiltered(filters);

  return (
    <div>
      {/* Header: count + filter button */}
      <div className="flex items-center justify-between pb-3">
        <span className={typography.mono.caption}>
          {t('count', { count: filteredMembers.length })}
          {filtered && filteredMembers.length !== members.length && (
            <span className={colors.textDisabled}> / {members.length}</span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setFilterPanelOpen(true)}
          className={`p-2 ${interactive.transition} ${interactive.cursorPointer} ${
            filtered
              ? 'bg-mustard-gold text-ink'
              : `${interactive.hoverInvert}`
          }`}
          aria-label={t('filterAria')}
        >
          <Filter
            width={icons.nav.size}
            height={icons.nav.size}
            strokeWidth={filtered ? icons.strokeActive : icons.nav.strokeWidth}
          />
        </button>
      </div>

      {/* Member list */}
      <div className={`border-t ${colors.borderSubtle}`}>
        {filteredMembers.length === 0 ? (
          <EmptyState
            message={filtered ? t('emptyStateFiltered') : t('emptyState')}
            action={filtered ? { label: t('resetFilters'), onClick: () => setFilters(DEFAULT_FILTERS) } : undefined}
          />
        ) : (
          <>
            {visibleMembers.map((member) => {
              const name = member.lastName
                ? `${member.firstName} ${member.lastName}`
                : member.firstName;

              const bookingData = member.nextBooking || member.lastBooking;
              const bookingPrefix = member.nextBooking
                ? t('next')
                : member.lastBooking
                  ? t('last')
                  : null;

              const bookingLabel = bookingData
                ? (() => {
                    const { weekday, date } = formatBookingDateParts(
                      bookingData.dateISO,
                      dateLocale,
                    );
                    return (
                      <>
                        {bookingPrefix}:{' '}
                        <span className="hidden sm:inline">{weekday} </span>
                        {date}
                      </>
                    );
                  })()
                : t('noBookings');

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

            {/* Scroll sentinel — triggers loading next page when it enters the viewport */}
            {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}
          </>
        )}
      </div>

      {/* Filter panel */}
      {filterPanelOpen && (
        <MemberFilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setFilterPanelOpen(false)}
        />
      )}
    </div>
  );
}
