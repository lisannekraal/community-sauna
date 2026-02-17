import { Filter } from 'iconoir-react';
import { colors, typography, icons, interactive } from '@/lib/design-tokens';
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
  return (
    <div>
      {/* Header bar: count + filter */}
      <div className="flex items-center justify-between pb-3">
        <span>
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
        <button
          type="button"
          className={`p-2 ${interactive.hoverInvert} ${interactive.transition} ${interactive.cursorPointer}`}
          aria-label="Filter members"
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
          const bookingPrefix = member.nextBooking ? 'Next' : member.lastBooking ? 'Last' : null;

          const bookingLabel = bookingData ? (
            <>
              {bookingPrefix}:{' '}
              <span className="hidden sm:inline">{bookingData.weekday} </span>
              {bookingData.date}
            </>
          ) : 'No bookings';

          return (
            <ListItem
              key={member.id}
              href={`/members/${member.id}`}
              label={name}
              badges={roleBadge(member.role)}
              secondaryLeft={bookingLabel}
              secondaryRight={member.plan || 'No plan'}
            />
          );
        })}
      </div>
    </div>
  );
}
