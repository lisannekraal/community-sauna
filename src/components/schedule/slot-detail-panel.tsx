'use client';

import { useEffect, useState } from 'react';
import { type TimeSlotData } from '@/types';
import { getSlotStatus, formatDisplayDate } from '@/lib/schedule';
import { colors, typography, interactive, feedback } from '@/lib/design-tokens';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { CapacityMeter } from './capacity-meter';

type PanelView = 'details' | 'confirmed' | 'cancel';

interface SlotDetailPanelProps {
  slot: TimeSlotData | null;
  isBooked: boolean;
  bookingId: number | null;
  onClose: () => void;
  onBook: (slot: TimeSlotData) => Promise<{ success: boolean; error?: string; bookingId?: number }>;
  onCancel: (bookingId: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
}

export function SlotDetailPanel({ slot, isBooked, bookingId, onClose, onBook, onCancel }: SlotDetailPanelProps) {
  const [view, setView] = useState<PanelView>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Reset state when slot changes
  useEffect(() => {
    setView('details');
    setLoading(false);
    setError(null);
    setCancelReason('');
  }, [slot?.id]);


  if (!slot) return null;

  const status = getSlotStatus(slot);
  const spotsLeft = slot.capacity - slot.bookedCount;
  const canBook = status === 'available' && !isBooked;

  async function handleBookClick() {
    setLoading(true);
    setError(null);
    const result = await onBook(slot!);
    setLoading(false);
    if (result.success) {
      setView('confirmed');
    } else {
      setError(result.error || 'Failed to book');
    }
  }

  async function handleCancelConfirm() {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    const result = await onCancel(bookingId, cancelReason || undefined);
    setLoading(false);
    if (result.success) {
      setView('details');
    } else {
      setError(result.error || 'Failed to cancel');
    }
  }

  const panelTitle = view === 'confirmed' ? 'Booking confirmed' : view === 'cancel' ? 'Cancel booking' : 'Session details';

  return (
    <Panel title={panelTitle} onClose={onClose}>
          {/* Date */}
          <div className={`${typography.mono.label} opacity-60`}>
            {formatDisplayDate(slot.date)}
          </div>

          {/* Time */}
          <div className={`text-3xl ${typography.display.heading} leading-none mt-2`}>
            {slot.startTime}–{slot.endTime}
          </div>

          {/* Type */}
          {slot.type && (
            <div className="mt-3 font-bold text-lg leading-tight">
              {slot.type}
            </div>
          )}

          {/* === CONFIRMATION VIEW === */}
          {view === 'confirmed' && (
            <>
              <div className={`border-t-2 ${colors.borderPrimary} mt-5 pt-4`}>
                <div className="text-center py-4">
                  <div className={`text-2xl ${typography.display.heading}`}>Booking confirmed!</div>
                  <p className={`${typography.mono.caption} mt-2 opacity-60`}>You&apos;re all set for this session.</p>
                </div>
              </div>
              <Button variant="panel-secondary" onClick={onClose} className="mt-4 w-full">
                Close
              </Button>
            </>
          )}

          {/* === CANCEL VIEW === */}
          {view === 'cancel' && (
            <>
              <div className={`border-t-2 ${colors.borderPrimary} mt-5 pt-4`}>
                <p className={`${typography.mono.caption} mb-3`}>Are you sure you want to cancel this booking?</p>
                <label className="block">
                  <span className={`${typography.mono.label} opacity-60`}>Reason (optional)</span>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className={`mt-1 w-full border-2 ${colors.borderPrimary} p-3 ${typography.mono.caption} resize-none h-20 focus:outline-none`}
                    placeholder="Why are you cancelling?"
                  />
                </label>
              </div>

              {error && (
                <div className={`mt-3 ${feedback.errorBox}`}>
                  <span className={feedback.errorText}>{error}</span>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <Button
                  variant="panel-secondary"
                  onClick={() => { setView('details'); setError(null); }}
                  disabled={loading}
                  className="flex-1"
                >
                  Go back
                </Button>
                <Button
                  variant="panel-primary"
                  onClick={handleCancelConfirm}
                  loading={loading}
                  loadingText="Cancelling..."
                  className="flex-1"
                >
                  Confirm cancel
                </Button>
              </div>
            </>
          )}

          {/* === DEFAULT DETAILS VIEW === */}
          {view === 'details' && (
            <>
              {/* Description */}
              {slot.description && (
                <p className="mt-2 text-sm leading-relaxed opacity-70">
                  {slot.description}
                </p>
              )}

              {/* Divider */}
              <div className={`border-t-2 ${colors.borderPrimary} mt-5 pt-4`}>
                {/* Status badges */}
                {status === 'cancelled' && (
                  <div className={`${typography.mono.caption} uppercase line-through ${colors.textDisabled}`}>
                    Cancelled
                  </div>
                )}

                {status === 'past' && (
                  <div className={`${typography.mono.caption} uppercase ${colors.textDisabled}`}>
                    Past
                  </div>
                )}

                {status === 'full' && !isBooked && (
                  <div className={`${typography.mono.caption} uppercase font-bold`}>
                    Full
                  </div>
                )}

                {status === 'available' && (
                  <div className="flex items-center gap-3">
                    <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} size="lg" />
                    <span className={typography.mono.caption}>
                      {spotsLeft} of {slot.capacity} left
                    </span>
                  </div>
                )}

                {/* Show capacity for full slots where user is booked */}
                {status === 'full' && isBooked && (
                  <div className="flex items-center gap-3">
                    <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} size="lg" />
                    <span className={typography.mono.caption}>Full</span>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className={`mt-3 ${feedback.errorBox}`}>
                  <span className={feedback.errorText}>{error}</span>
                </div>
              )}

              {/* Booked indicator + cancel button */}
              {isBooked && (
                <>
                  <div className={`mt-4 border-2 ${colors.borderPrimary} ${colors.bgPrimary} ${colors.textInverse} px-4 py-3 text-center`}>
                    <span className={`${typography.display.heading} text-lg`}>Booked &#10003;</span>
                  </div>
                  {status !== 'past' && (
                    <Button variant="panel-secondary" onClick={() => setView('cancel')} className="mt-2 w-full">
                      Cancel booking
                    </Button>
                  )}
                </>
              )}

              {/* Book button */}
              {!isBooked && (
                <button
                  onClick={handleBookClick}
                  disabled={!canBook || loading}
                  className={`mt-4 w-full border-2 px-4 py-3 ${typography.display.heading} text-lg ${interactive.transition} ${
                    canBook && !loading
                      ? `${colors.borderPrimary} ${interactive.hoverInvert} ${interactive.cursorPointer}`
                      : `${colors.borderDisabled} ${colors.textDisabled} ${interactive.cursorDisabled}`
                  }`}
                >
                  {loading ? 'Booking...' : 'Book now'}
                </button>
              )}
            </>
          )}
    </Panel>
  );
}
