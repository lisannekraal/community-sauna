'use client';

import { useEffect, useRef } from 'react';
import { colors, typography, interactive, animation } from '@/lib/design-tokens';

interface PanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Panel({ title, onClose, children }: PanelProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, []);

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
          ${animation.slideUp}
          max-h-[80vh] flex flex-col
        `}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b-2 ${colors.borderPrimary} flex-shrink-0`}>
          <div className="px-4 py-3">
            <span className={typography.mono.label}>{title}</span>
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
        <div className="p-5 md:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
