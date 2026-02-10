'use client';

import { useEffect } from 'react';
import { type TimeSlotData } from '@/types';
import { getSlotStatus, formatDisplayDate } from '@/lib/schedule';
import { CapacityMeter } from './capacity-meter';

interface SlotDetailPanelProps {
  slot: TimeSlotData | null;
  isBooked: boolean;
  onClose: () => void;
  onBook: (slot: TimeSlotData) => void;
}

export function SlotDetailPanel({ slot, isBooked, onClose, onBook }: SlotDetailPanelProps) {
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
              Session details
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

            {status === 'full' && (
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
          </div>

          {/* Booked indicator */}
          {isBooked && (
            <div className="mt-4 border-2 border-black bg-black text-white px-4 py-3 text-center">
              <span className="font-display uppercase text-lg">Booked &#10003;</span>
            </div>
          )}

          {/* Book button */}
          {!isBooked && (
            <button
              onClick={() => canBook && onBook(slot)}
              disabled={!canBook}
              className={`mt-4 w-full border-2 px-4 py-3 font-display uppercase text-lg transition-colors ${
                canBook
                  ? 'border-black hover:bg-black hover:text-white cursor-pointer'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }`}
            >
              Book now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
