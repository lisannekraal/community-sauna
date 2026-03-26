'use client';

import { colors, typography, interactive } from '@/lib/design-tokens';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className={`flex items-center gap-2.5 ${interactive.cursorPointer}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`w-4 h-4 ${interactive.cursorPointer} border ${colors.borderPrimary} shrink-0`}
        style={{ accentColor: 'var(--color-mustard-gold)' }}
      />
      <span className={typography.mono.caption}>{label}</span>
    </label>
  );
}
