'use client';

import { useEffect, useState } from 'react';
import { type TimeSlotData } from '@/types';
import { getSlotStatus, formatDisplayDate } from '@/lib/schedule';
import { colors, typography, buttons, interactive, animation, feedback } from '@/lib/design-tokens';
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

  useEffect(() => {
    if (!slot) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [slot, onClose]);

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

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${colors.bgOverlay} ${animation.fadeIn}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet on mobile, centered modal on desktop */}
      <div
        className={`
          absolute bottom-0 left-0 right-0
          md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:max-w-md md:w-full
          ${colors.bgSecondary} border-t-4 ${colors.borderPrimary}
          md:border-4
          ${animation.slideUp} md:${animation.scaleIn}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Time slot details"
      >
        {/* Header bar */}
        <div className={`flex items-center justify-between border-b-2 ${colors.borderPrimary}`}>
          <div className="px-4 py-3">
            <span className={typography.mono.label}>
              {view === 'confirmed' ? 'Booking confirmed' : view === 'cancel' ? 'Cancel booking' : 'Session details'}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`border-l-2 ${colors.borderPrimary} px-4 py-3 ${typography.mono.caption} ${interactive.hoverInvert} ${interactive.transition} ${interactive.cursorPointer}`}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
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
              <button
                onClick={onClose}
                className={`mt-4 w-full ${buttons.panel} ${buttons.panelInvert}`}
              >
                Close
              </button>
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
                <button
                  onClick={() => { setView('details'); setError(null); }}
                  disabled={loading}
                  className={`flex-1 ${buttons.panel} ${buttons.panelSecondary} ${buttons.panelDisabled}`}
                >
                  Go back
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={loading}
                  className={`flex-1 ${buttons.panel} ${buttons.panelPrimary} ${buttons.panelDisabled}`}
                >
                  {loading ? 'Cancelling...' : 'Confirm cancel'}
                </button>
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
                    <button
                      onClick={() => setView('cancel')}
                      className={`mt-2 w-full ${buttons.panel} ${buttons.panelInvert}`}
                    >
                      Cancel booking
                    </button>
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
        </div>
      </div>
    </div>
  );
}
