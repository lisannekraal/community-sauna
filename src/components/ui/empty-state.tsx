import { colors, typography, interactive } from '@/lib/design-tokens';

interface EmptyStateProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div
      className={`mt-4 py-12 flex flex-col items-center gap-3 border border-dashed ${colors.borderSubtle}`}
    >
      <p className={`${typography.mono.caption} ${colors.textDisabled}`}>{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`${typography.mono.label} underline hover:no-underline ${interactive.cursorPointer} ${interactive.transition}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
