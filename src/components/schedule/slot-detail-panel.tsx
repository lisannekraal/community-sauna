'use client';

import { useEffect, useState } from 'react';
import { type TimeSlotData } from '@/types';
import { getSlotStatus, formatDisplayDate } from '@/lib/schedule';
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
        className="absolute inset-0 bg-black/60 animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet on mobile, centered modal on desktop */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:max-w-md md:w-full
          bg-white border-t-4 border-black
          md:border-4
          animate-[slideUp_200ms_ease-out] md:animate-[scaleIn_150ms_ease-out]
        "
        role="dialog"
        aria-modal="true"
        aria-label="Time slot details"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b-2 border-black">
          <div className="px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-wider">
              {view === 'confirmed' ? 'Booking confirmed' : view === 'cancel' ? 'Cancel booking' : 'Session details'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="border-l-2 border-black px-4 py-3 font-mono text-sm hover:bg-black hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Date */}
          <div className="font-mono text-xs tracking-wider opacity-60">
            {formatDisplayDate(slot.date)}
          </div>

          {/* Time */}
          <div className="text-3xl font-display uppercase leading-none mt-2">
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
              <div className="border-t-2 border-black mt-5 pt-4">
                <div className="text-center py-4">
                  <div className="text-2xl font-display uppercase">Booking confirmed!</div>
                  <p className="font-mono text-sm mt-2 opacity-60">You&apos;re all set for this session.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full border-2 border-black px-4 py-3 font-display uppercase text-lg hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </>
          )}

          {/* === CANCEL VIEW === */}
          {view === 'cancel' && (
            <>
              <div className="border-t-2 border-black mt-5 pt-4">
                <p className="font-mono text-sm mb-3">Are you sure you want to cancel this booking?</p>
                <label className="block">
                  <span className="font-mono text-xs uppercase tracking-wider opacity-60">Reason (optional)</span>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 w-full border-2 border-black p-3 font-mono text-sm resize-none h-20 focus:outline-none"
                    placeholder="Why are you cancelling?"
                  />
                </label>
              </div>

              {error && (
                <div className="mt-3 border-2 border-red-600 bg-red-50 px-4 py-2">
                  <span className="font-mono text-sm text-red-600">{error}</span>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { setView('details'); setError(null); }}
                  disabled={loading}
                  className="flex-1 border-2 border-black px-4 py-3 font-display uppercase text-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Go back
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={loading}
                  className="flex-1 border-2 border-black bg-black text-white px-4 py-3 font-display uppercase text-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
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
              <div className="border-t-2 border-black mt-5 pt-4">
                {/* Status badges */}
                {status === 'cancelled' && (
                  <div className="font-mono uppercase text-sm line-through text-gray-400">
                    Cancelled
                  </div>
                )}

                {status === 'past' && (
                  <div className="font-mono uppercase text-sm text-gray-400">
                    Past
                  </div>
                )}

                {status === 'full' && !isBooked && (
                  <div className="font-mono uppercase text-sm font-bold">
                    Full
                  </div>
                )}

                {status === 'available' && (
                  <div className="flex items-center gap-3">
                    <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} size="lg" />
                    <span className="font-mono text-sm">
                      {spotsLeft} of {slot.capacity} left
                    </span>
                  </div>
                )}

                {/* Show capacity for full slots where user is booked */}
                {status === 'full' && isBooked && (
                  <div className="flex items-center gap-3">
                    <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} size="lg" />
                    <span className="font-mono text-sm">Full</span>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-3 border-2 border-red-600 bg-red-50 px-4 py-2">
                  <span className="font-mono text-sm text-red-600">{error}</span>
                </div>
              )}

              {/* Booked indicator + cancel button */}
              {isBooked && (
                <>
                  <div className="mt-4 border-2 border-black bg-black text-white px-4 py-3 text-center">
                    <span className="font-display uppercase text-lg">Booked &#10003;</span>
                  </div>
                  {status !== 'past' && (
                    <button
                      onClick={() => setView('cancel')}
                      className="mt-2 w-full border-2 border-black px-4 py-3 font-display uppercase text-lg hover:bg-black hover:text-white transition-colors cursor-pointer"
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
                  className={`mt-4 w-full border-2 px-4 py-3 font-display uppercase text-lg transition-colors ${
                    canBook && !loading
                      ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
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
