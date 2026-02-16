'use client';

import { useAdminMode } from '@/contexts/admin-mode';
import { colors } from '@/lib/design-tokens';

export function AdminModeToggle() {
  const { isAdminMode, toggleAdminMode } = useAdminMode();

  return (
    <button
      onClick={toggleAdminMode}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 text-[12px] tracking-wide cursor-pointer"
    >
      <span className={`w-2 h-2 rounded-full ${isAdminMode ? colors.bgPrimary : 'bg-black/20'}`} />
      {isAdminMode ? 'Switch to member view' : 'Switch to admin view'}
    </button>
  );
}
