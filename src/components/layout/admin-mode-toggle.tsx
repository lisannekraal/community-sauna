'use client';

import { useAdminMode } from '@/contexts/admin-mode';
import { useTranslations } from 'next-intl';
import { colors } from '@/lib/design-tokens';

export function AdminModeToggle() {
  const { isAdminMode, toggleAdminMode } = useAdminMode();
  const t = useTranslations('Nav');

  return (
    <button
      onClick={toggleAdminMode}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/20 text-[12px] tracking-wide cursor-pointer"
    >
      <span className={`w-2 h-2 rounded-full ${isAdminMode ? colors.bgPrimary : 'bg-ink/20'}`} />
      {isAdminMode ? t('switchToMemberView') : t('switchToAdminView')}
    </button>
  );
}
