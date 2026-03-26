'use client';

import { useTranslations } from 'next-intl';
import { type TimeSlotData } from '@/types';
import { colors, typography, interactive } from '@/lib/design-tokens';
import { CapacityMeter } from './capacity-meter';

interface SlotCardProps {
  slot: TimeSlotData;
  isToday: boolean;
  isDayPast: boolean;
  nowTime: string;
  isBooked?: boolean;
  onSlotClick?: (slot: TimeSlotData) => void;
  compact?: boolean;
}

export function SlotCard({ slot, isToday, isDayPast, nowTime, isBooked, onSlotClick, compact }: SlotCardProps) {
  const t = useTranslations('Schedule');
  // Status computed inline from parent-provided props to avoid creating a Date per card.
  // Keep in sync with getSlotStatus() in @/lib/schedule.
  const spotsLeft = slot.capacity - slot.bookedCount;
  const isFull = spotsLeft <= 0;
  const slotPast = isDayPast || (isToday && slot.startTime < nowTime);

  // Disabled when cancelled, past, or full — unless the user booked it (so they can still cancel)
  const isDisabled = slot.isCancelled || slotPast || (isFull && !isBooked);

  let stateClasses: string;
  if (slot.isCancelled) {
    stateClasses = `${colors.borderDisabled} ${colors.bgSubtle} ${colors.textDisabled} ${interactive.cursorDisabled}`;
  } else if (slotPast) {
    stateClasses = `${colors.borderDisabled} ${colors.textDisabled} cursor-default`;
  } else if (isBooked) {
    stateClasses = `border-mustard-gold bg-mustard-gold text-ink ${interactive.cursorPointer}`;
  } else if (isFull) {
    stateClasses = `border-mustard-gold ${colors.bgDisabled} text-ash ${interactive.cursorDisabled}`;
  } else {
    stateClasses = `border-mustard-gold hover:bg-mustard-gold hover:text-ink ${interactive.cursorPointer} group`;
  }

  return (
    <button
      onClick={() => onSlotClick?.(slot)}
      disabled={isDisabled}
      className={`w-full text-left border ${interactive.transition} ${stateClasses} ${
        compact ? 'p-1.5' : 'p-3'
      }`}
    >
      {/* Time row */}
      <div className={`font-mono leading-none ${compact ? 'text-[11px]' : 'text-sm'}`}>
        {slot.startTime}–{slot.endTime}
      </div>

      {/* Type label */}
      {slot.type && (
        <div className={`mt-1 leading-tight font-bold ${compact ? 'text-sm' : ''}`}>
          {slot.type}
        </div>
      )}

      {/* Status / Capacity */}
      <div className={`mt-1.5 ${compact ? '' : 'mt-2'}`}>
        {slot.isCancelled ? (
          <span className={`font-mono uppercase line-through ${compact ? 'text-[9px]' : 'text-xs'}`}>
            {t('slot.cancelled')}
          </span>
        ) : isBooked ? (
          <span className={`font-mono uppercase font-bold ${compact ? 'text-[9px]' : 'text-xs'}`}>
            &#10003; {t('slot.booked')}
          </span>
        ) : isFull ? (
          <span className={`font-mono uppercase font-bold ${compact ? 'text-[9px]' : 'text-xs'}`}>
            {t('slot.full')}
          </span>
        ) : slotPast ? (
          <span className={`font-mono uppercase ${compact ? 'text-[9px]' : 'text-xs'}`}>
            {t('slot.past')}
          </span>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} />
            {!compact && (
              <span className={`${typography.mono.tiny} shrink-0`}>
                {spotsLeft}/{slot.capacity}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
