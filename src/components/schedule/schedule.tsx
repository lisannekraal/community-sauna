'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { type TimeSlotData } from '@/types';
import { formatDateISO, formatNowTime } from '@/lib/schedule';
import { colors, interactive } from '@/lib/design-tokens';
import { SlotCard } from './slot-card';
import { SlotDetailPanel } from './slot-detail-panel';

interface ScheduleProps {
  timeSlots: TimeSlotData[];
  userBookings: Record<number, number>; // { timeslotId: bookingId }
}

function getWeekDates(reference: Date): Date[] {
  const day = reference.getDay();
  const monday = new Date(reference);
  monday.setDate(reference.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function Schedule({ timeSlots: initialTimeSlots, userBookings: initialUserBookings }: ScheduleProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotData | null>(null);
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);
  const [userBookings, setUserBookings] = useState(initialUserBookings);
  const t = useTranslations('Schedule');
  const locale = useLocale();
  const dateLocale = locale === 'nl' ? 'nl-NL' : 'en-GB';

  const DAY_LABELS = [t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'), t('days.fri'), t('days.sat'), t('days.sun')];

  const now = new Date();
  const todayStr = formatDateISO(now);

  const ref = new Date(now);
  ref.setDate(ref.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(ref);

  // Mobile: default selected day is today (if in current week), else first day
  const defaultSelectedIndex = weekOffset === 0
    ? weekDates.findIndex(d => formatDateISO(d) === todayStr)
    : 0;
  const [selectedDayIndex, setSelectedDayIndex] = useState(
    defaultSelectedIndex >= 0 ? defaultSelectedIndex : 0
  );

  // Reset selected day when switching weeks
  const handleWeekChange = (newOffset: number) => {
    setWeekOffset(newOffset);
    if (newOffset === 0) {
      const newRef = new Date(now);
      const newWeekDates = getWeekDates(newRef);
      const todayIdx = newWeekDates.findIndex(d => formatDateISO(d) === todayStr);
      setSelectedDayIndex(todayIdx >= 0 ? todayIdx : 0);
    } else {
      setSelectedDayIndex(0);
    }
  };

  const handleBook = useCallback(async (slot: TimeSlotData): Promise<{ success: boolean; error?: string; bookingId?: number }> => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeslotId: slot.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to book' };
    }

    // Update local state
    setTimeSlots(prev => prev.map(s =>
      s.id === slot.id ? { ...s, bookedCount: s.bookedCount + 1 } : s
    ));
    setUserBookings(prev => ({ ...prev, [slot.id]: data.booking.id }));
    setSelectedSlot(prev => prev?.id === slot.id ? { ...prev, bookedCount: prev.bookedCount + 1 } : prev);

    return { success: true, bookingId: data.booking.id };
  }, []);

  const handleCancel = useCallback(async (bookingId: number, reason?: string): Promise<{ success: boolean; error?: string }> => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to cancel' };
    }

    // Find which timeslotId this booking was for
    const timeslotId = Object.entries(userBookings).find(([, bId]) => bId === bookingId)?.[0];

    if (timeslotId) {
      const slotId = parseInt(timeslotId, 10);
      setTimeSlots(prev => prev.map(s =>
        s.id === slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
      ));
      setSelectedSlot(prev => prev?.id === slotId ? { ...prev, bookedCount: Math.max(0, prev.bookedCount - 1) } : prev);
      setUserBookings(prev => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    }

    return { success: true };
  }, [userBookings]);

  const nowTime = formatNowTime(now);

  const slotsByDate: Record<string, TimeSlotData[]> = {};
  for (const slot of timeSlots) {
    if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
    slotsByDate[slot.date].push(slot);
  }
  for (const date in slotsByDate) {
    slotsByDate[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  function formatWeekRange(): string {
    const startMonth = weekStart.toLocaleDateString(dateLocale, { month: 'short' }).toUpperCase();
    const endMonth = weekEnd.toLocaleDateString(dateLocale, { month: 'short' }).toUpperCase();

    if (startMonth === endMonth) {
      return `${weekStart.getDate()} – ${weekEnd.getDate()} ${startMonth} ${weekEnd.getFullYear()}`;
    }
    return `${weekStart.getDate()} ${startMonth} – ${weekEnd.getDate()} ${endMonth} ${weekEnd.getFullYear()}`;
  }

  function getWeekLabel(): string {
    if (weekOffset === 0) return t('thisWeek');
    if (weekOffset === 1) return t('nextWeek');
    if (weekOffset === -1) return t('lastWeek');
    return t('week');
  }

  // Mobile: selected day data
  const selectedDate = weekDates[selectedDayIndex];
  const selectedDateStr = formatDateISO(selectedDate);
  const selectedIsToday = selectedDateStr === todayStr;
  const selectedIsPast = selectedDateStr < todayStr;
  const selectedSlots = slotsByDate[selectedDateStr] || [];

  return (
    <div className="w-full">
      {/* Week navigation header */}
      <div className="border border-mustard-gold">
        <div className="flex items-stretch border-b border-mustard-gold">
          <button
            onClick={() => handleWeekChange(weekOffset - 1)}
            className={`border-r border-mustard-gold px-4 py-3 font-mono text-sm ${interactive.hoverInvert} ${interactive.transition} shrink-0 ${interactive.cursorPointer}`}
            aria-label={t('previousWeek')}
          >
            &larr;
          </button>

          <div className="flex-1 text-center py-3 px-2">
            <h2 className="text-2xl sm:text-3xl font-display leading-tight">
              {getWeekLabel()}
            </h2>
            <p className="font-mono text-xs mt-1 opacity-60">{formatWeekRange()}</p>
          </div>

          <button
            onClick={() => handleWeekChange(weekOffset + 1)}
            className={`border-l border-mustard-gold px-4 py-3 font-mono text-sm ${interactive.hoverInvert} ${interactive.transition} shrink-0 ${interactive.cursorPointer}`}
            aria-label={t('nextWeekAria')}
          >
            &rarr;
          </button>
        </div>

        <div className="border-b border-mustard-gold h-[32px] flex items-center justify-center">
          {weekOffset !== 0 && (
            <button
              onClick={() => handleWeekChange(0)}
              className={`w-full h-full text-xs ${interactive.hoverInvert} ${interactive.transition} ${interactive.cursorPointer}`}
            >
{t('backToCurrentWeek')}
            </button>
          )}
        </div>

        {/* ===== MOBILE: Day picker strip + slot list ===== */}
        <div className="md:hidden">
          {/* Day picker — all 7 days visible */}
          <div className="grid grid-cols-7 border-b border-mustard-gold">
            {weekDates.map((date, i) => {
              const dateStr = formatDateISO(date);
              const isToday = dateStr === todayStr;
              const isPast = dateStr < todayStr;
              const isSelected = i === selectedDayIndex;
              const hasSlots = (slotsByDate[dateStr] || []).length > 0;

              return (
                <button
                  key={`pick-${i}`}
                  onClick={() => setSelectedDayIndex(i)}
                  className={`relative py-3 text-center ${interactive.transition} ${interactive.cursorPointer} ${
                    i < 6 ? 'border-r border-mustard-gold' : ''
                  } ${
                    isSelected
                      ? 'bg-mustard-gold text-ink'
                      : isPast
                        ? 'text-ash/60'
                        : 'hover:bg-timber/10'
                  }`}
                  aria-label={`${DAY_LABELS[i]} ${date.getDate()}`}
                  aria-pressed={isSelected}
                >
                  <div className="flex flex-col items-center h-[48px] justify-start">
                    <div className="font-mono text-[10px] leading-none">{DAY_LABELS[i]}</div>
                    <div className={`text-lg font-mono leading-tight mt-1 ${isToday && !isSelected ? 'underline decoration-2 underline-offset-2' : ''}`}>
                      {date.getDate()}
                    </div>
                    {hasSlots && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-ink' : isPast ? 'bg-ash/50' : 'bg-mustard-gold'
                      }`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected day slots */}
          <div className="p-4">
            {/* Day label */}
            <div className="flex items-center gap-3 my-4">
              <span className="text-3xl font-display leading-none">
                {selectedDate.toLocaleDateString(dateLocale, { weekday: 'long' })}
              </span>
              {selectedIsToday && (
                <span className="font-mono uppercase text-[10px] border border-mustard-gold px-2 py-0.5">
                  {t('today')}
                </span>
              )}
              {selectedIsPast && (
                <span className={`font-mono uppercase text-[10px] border ${colors.borderDisabled} px-2 py-0.5 ${colors.textDisabled}`}>
                  {t('past')}
                </span>
              )}
            </div>

            {selectedSlots.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-ash/30">
                <span className={`font-mono uppercase text-sm ${colors.textDisabled}`}>{t('noSessions')}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSlots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    isToday={selectedIsToday}
                    isDayPast={selectedIsPast}
                    nowTime={nowTime}
                    isBooked={slot.id in userBookings}
                    onSlotClick={setSelectedSlot}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== DESKTOP: 7-column grid ===== */}
        <div className="hidden md:block">
          <div className="grid grid-cols-7">
            {weekDates.map((date, i) => {
              const dateStr = formatDateISO(date);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={`header-${i}`}
                  className={`border-b border-mustard-gold p-2 text-center ${
                    i < 6 ? 'border-r' : ''
                  } ${isToday ? 'bg-mustard-gold text-ink' : ''}`}
                >
                  <div className="flex flex-col items-center h-[64px] justify-start">
                    <div className="font-mono text-[10px] uppercase tracking-wider">{DAY_LABELS[i]}</div>
                    <div className="text-2xl font-mono leading-tight mt-0.5">
                      {String(date.getDate()).padStart(2, '0')}
                    </div>
                    {isToday && (
                      <div className="font-mono uppercase text-[9px] mt-0.5 opacity-70">{t('today')}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day columns with slots */}
          <div className="grid grid-cols-7">
            {weekDates.map((date, i) => {
              const dateStr = formatDateISO(date);
              const isToday = dateStr === todayStr;
              const isDayPast = dateStr < todayStr;
              const daySlots = slotsByDate[dateStr] || [];

              return (
                <div
                  key={`day-${i}`}
                  className={`min-h-[140px] p-1.5 ${i < 6 ? 'border-r border-mustard-gold' : ''} ${
                    isToday ? 'bg-timber/5' : ''
                  }`}
                >
                  {daySlots.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-ash/40 font-mono text-xs">&mdash;</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {daySlots.map((slot) => (
                        <SlotCard
                          key={slot.id}
                          slot={slot}
                          isToday={isToday}
                          isDayPast={isDayPast}
                          nowTime={nowTime}
                          isBooked={slot.id in userBookings}
                          onSlotClick={setSelectedSlot}
                          compact
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slot detail panel */}
      <SlotDetailPanel
        slot={selectedSlot}
        isBooked={selectedSlot ? selectedSlot.id in userBookings : false}
        bookingId={selectedSlot ? userBookings[selectedSlot.id] ?? null : null}
        onClose={() => setSelectedSlot(null)}
        onBook={handleBook}
        onCancel={handleCancel}
      />
    </div>
  );
}
