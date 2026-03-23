import { type TimeSlotData, type SlotStatus } from '@/types';

/** Format a Date as YYYY-MM-DD */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a Date as HH:MM */
export function formatNowTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** Format a Prisma @db.Time field (stored as UTC) as HH:MM */
export function formatTimeUTC(date: Date): string {
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

/** Format a YYYY-MM-DD string as "15 Apr 2026". Accepts full ISO timestamps — only the date part is used. */
export function formatDateHuman(dateStr: string, locale = 'en-GB'): string {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDate();
  const month = date.toLocaleDateString(locale, { month: 'short' });
  return `${day} ${month} ${y}`;
}

/** Format a YYYY-MM-DD string for display, e.g. "TUESDAY 11 FEB". Accepts full ISO timestamps — only the date part is used. */
export function formatDisplayDate(dateStr: string, locale = 'en-GB'): string {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase();
  const day = date.getDate();
  const month = date.toLocaleDateString(locale, { month: 'short' }).toUpperCase();
  return `${weekday} ${day} ${month}`;
}

/** Format a YYYY-MM-DD string into separate weekday and date parts for list display.
 *  Returns e.g. { weekday: 'Wed', date: '19 Feb' } or Dutch equivalents. */
export function formatBookingDateParts(dateStr: string, locale = 'en-GB'): { weekday: string; date: string } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    weekday: date.toLocaleDateString(locale, { weekday: 'short' }),
    date: date.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
  };
}

/** Format a 'YYYY-MM' string as a localized month + year, e.g. "Oct 2024" or "okt. 2024". */
export function formatMonthYear(yearMonth: string, locale = 'en-GB'): string {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

/** Format a JS getDay() weekday number (0=Sun … 6=Sat) as a localized day name. */
export function formatWeekdayName(dayNum: number, locale = 'en-GB'): string {
  // Jan 4 2026 is a Sunday (0), so adding dayNum yields the correct weekday
  return new Date(2026, 0, 4 + dayNum).toLocaleDateString(locale, { weekday: 'long' });
}

/** Determine the status of a time slot.
 *  Note: SlotCard computes status inline from parent-provided props for performance. */
export function getSlotStatus(slot: TimeSlotData, now?: Date): SlotStatus {
  if (slot.isCancelled) return 'cancelled';

  const ref = now ?? new Date();
  const todayStr = formatDateISO(ref);
  const nowTime = formatNowTime(ref);

  if (slot.date < todayStr || (slot.date === todayStr && slot.startTime < nowTime)) return 'past';
  if (slot.bookedCount >= slot.capacity) return 'full';
  return 'available';
}
