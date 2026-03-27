'use client';

import Link from 'next/link';
import { NavArrowRight } from 'iconoir-react';
import { colors, typography, interactive, icons } from '@/lib/design-tokens';

export interface ListItemProps {
  /** Primary label (e.g. member name) */
  label: string;
  /** Optional badges rendered after the label */
  badges?: React.ReactNode;
  /** Secondary info line (e.g. next booking, plan) */
  secondaryLeft?: React.ReactNode;
  secondaryRight?: string;
  /** Click handler — makes the item a link-style button */
  onClick?: () => void;
  /** Href — renders as an anchor if provided (takes precedence over onClick) */
  href?: string;
}

export function ListItem({ label, badges, secondaryLeft, secondaryRight, onClick, href }: ListItemProps) {
  const isInteractive = !!(href || onClick);

  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{label}</span>
          {badges && <span className="contents">{badges}</span>}
        </div>
        {(secondaryLeft || secondaryRight) && (
          <div className="flex items-center gap-3 mt-0.5">
            {secondaryLeft && (
              <span className={`text-sm ${colors.textMuted} truncate`}>{secondaryLeft}</span>
            )}
            {secondaryRight && (
              <span className={`${typography.mono.label} ${colors.textSubtle} truncate`}>{secondaryRight}</span>
            )}
          </div>
        )}
      </div>
      {isInteractive && (
        <NavArrowRight
          width={icons.action.size}
          height={icons.action.size}
          strokeWidth={icons.action.strokeWidth}
          className={`flex-shrink-0 ${colors.textMuted}`}
        />
      )}
    </>
  );

  if (!isInteractive) {
    return (
      <div className="flex items-center gap-3 w-full px-4 py-3 text-left">
        {content}
      </div>
    );
  }

  const className = `group flex items-center gap-3 w-full px-4 py-3 border-l-2 border-l-transparent hover:border-l-mustard-gold ${interactive.transition} ${interactive.cursorPointer} text-left`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} type="button">
      {content}
    </button>
  );
}
