'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { type TimeSlotData } from '@/types';
import { getSlotStatus, formatDisplayDate } from '@/lib/schedule';
import { colors, typography, interactive, feedback, buttons } from '@/lib/design-tokens';
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
  const t = useTranslations('Schedule');
  const locale = useLocale();
  const dateLocale = locale === 'nl' ? 'nl-NL' : 'en-GB';

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
      setError(result.error || t('panel.failedToBook'));
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
      setError(result.error || t('panel.failedToCancel'));
    }
  }

  const panelTitle = view === 'confirmed' ? t('panel.bookingConfirmed') : view === 'cancel' ? t('panel.cancelBooking') : t('panel.sessionDetails');

  return (
    <Panel title={panelTitle} onClose={onClose}>
          {/* Date */}
          <div className={`${typography.mono.label} opacity-60`}>
            {formatDisplayDate(slot.date, dateLocale)}
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
              <div className={`border-t border-ink/10 mt-5 pt-4`}>
                <div className="text-center py-4">
                  <div className={`text-2xl ${typography.display.heading}`}>{t('panel.bookingConfirmed')}!</div>
                  <p className={`${typography.mono.caption} mt-2 opacity-60`}>{t('panel.confirmedMessage')}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={onClose} className="mt-4 w-full">
                {t('panel.close')}
              </Button>
            </>
          )}

          {/* === CANCEL VIEW === */}
          {view === 'cancel' && (
            <>
              <div className={`border-t border-ink/10 mt-5 pt-4`}>
                <p className={`${typography.mono.caption} mb-3`}>{t('panel.cancelConfirmQuestion')}</p>
                <label className="block">
                  <span className={`${typography.mono.label} opacity-60`}>{t('panel.cancelReasonLabel')}</span>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    maxLength={500}
                    className={`mt-1 w-full border border-mustard-gold p-3 ${typography.mono.caption} resize-none h-20 focus:outline-none`}
                    placeholder={t('panel.cancelReasonPlaceholder')}
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
                  variant="secondary"
                  onClick={() => { setView('details'); setError(null); }}
                  disabled={loading}
                  className="flex-1"
                >
                  {t('panel.goBack')}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCancelConfirm}
                  loading={loading}
                  loadingText={t('panel.cancelling')}
                  className="flex-1"
                >
                  {t('panel.confirmCancel')}
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
              <div className={`border-t border-ink/10 mt-5 pt-4`}>
                {/* Status badges */}
                {status === 'cancelled' && (
                  <div className={`${typography.mono.caption} uppercase line-through ${colors.textDisabled}`}>
                    {t('slot.cancelled')}
                  </div>
                )}

                {status === 'past' && (
                  <div className={`${typography.mono.caption} uppercase ${colors.textDisabled}`}>
                    {t('slot.past')}
                  </div>
                )}

                {status === 'full' && !isBooked && (
                  <div className={`${typography.mono.caption} uppercase font-bold`}>
                    {t('slot.full')}
                  </div>
                )}

                {status === 'available' && (
                  <div className="flex items-center gap-3">
                    <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} size="lg" />
                    <span className={typography.mono.caption}>
                      {t('panel.spotsLeft', { count: spotsLeft, total: slot.capacity })}
                    </span>
                  </div>
                )}

                {/* Show capacity for full slots where user is booked */}
                {status === 'full' && isBooked && (
                  <div className="flex items-center gap-3">
                    <CapacityMeter booked={slot.bookedCount} capacity={slot.capacity} size="lg" />
                    <span className={typography.mono.caption}>{t('slot.full')}</span>
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
                  <div className={`mt-4 ${buttons.base} ${buttons.primary} text-center pointer-events-none`}>
                    {t('panel.bookedCheck')}
                  </div>
                  {status !== 'past' && (
                    <Button variant="secondary" onClick={() => setView('cancel')} className="mt-2 w-full">
                      {t('panel.cancelBooking')}
                    </Button>
                  )}
                </>
              )}

              {/* Book button */}
              {!isBooked && (
                <Button
                  variant="primary"
                  onClick={handleBookClick}
                  disabled={!canBook || loading}
                  loading={loading}
                  loadingText={t('slot.booking')}
                  className="mt-4"
                >
                  {t('slot.bookNow')}
                </Button>
              )}
            </>
          )}
    </Panel>
  );
}
