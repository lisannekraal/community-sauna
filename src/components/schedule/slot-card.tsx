import { type TimeSlotData } from './week-schedule';

interface SlotCardProps {
  slot: TimeSlotData;
  isToday: boolean;
  isDayPast: boolean;
  nowTime: string;
  onSlotClick?: (slot: TimeSlotData) => void;
  compact?: boolean;
}

function CapacityMeter({ booked, capacity }: { booked: number; capacity: number }) {
  return (
    <div className="flex gap-[3px]" aria-label={`${booked} of ${capacity} spots booked`}>
      {Array.from({ length: capacity }, (_, i) => (
        <div
          key={i}
          className={`w-[10px] h-[10px] rounded-full border border-current ${
            i < booked ? 'bg-current' : ''
          }`}
        />
      ))}
    </div>
  );
}

export function SlotCard({ slot, isToday, isDayPast, nowTime, onSlotClick, compact }: SlotCardProps) {
  const spotsLeft = slot.capacity - slot.bookedCount;
  const isFull = spotsLeft <= 0;
  const slotPast = isDayPast || (isToday && slot.startTime < nowTime);

  const isDisabled = slot.isCancelled || slotPast || isFull;

  let stateClasses: string;
  if (slot.isCancelled) {
    stateClasses = 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed';
  } else if (slotPast) {
    stateClasses = 'border-gray-300 text-gray-400 cursor-default';
  } else if (isFull) {
    stateClasses = 'border-black bg-gray-200 text-gray-500 cursor-not-allowed';
  } else {
    stateClasses = 'border-black hover:bg-black hover:text-white cursor-pointer group';
  }

  return (
    <button
      onClick={() => onSlotClick?.(slot)}
      disabled={isDisabled}
      className={`w-full text-left border-2 transition-colors ${stateClasses} ${
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
            Cancelled
          </span>
        ) : isFull ? (
          <span className={`font-mono uppercase font-bold ${compact ? 'text-[9px]' : 'text-xs'}`}>
            Full
          </span>
        ) : slotPast ? (
          <span className={`font-mono uppercase ${compact ? 'text-[9px]' : 'text-xs'}`}>
            Past
          </span>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} />
            {!compact && (
              <span className="font-mono text-[10px] shrink-0">
                {spotsLeft}/{slot.capacity}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
