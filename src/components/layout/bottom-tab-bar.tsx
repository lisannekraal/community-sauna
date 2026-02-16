'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type UserRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems, isActiveRoute } from '@/lib/navigation';
import { nav, icons, colors, interactive } from '@/lib/design-tokens';

interface BottomTabBarProps {
  userRole: UserRole;
}

export function BottomTabBar({ userRole }: BottomTabBarProps) {
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const items = getMainNavItems(userRole, isAdminMode);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className={`relative ${colors.bgSecondary} border-t ${colors.borderSubtle}`}>
        <ul className="flex items-end">
          {items.map((item, i) => {
            const active = isActiveRoute(pathname, item.href);
            const isCenter = i === 2;
            const Icon = item.icon;

            if (isCenter) {
              return (
                <li key={item.href} className="flex-1 flex justify-center -mt-4">
                  <Link
                    href={item.href}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-13 h-13 rounded-full flex items-center justify-center border-2 ${colors.borderPrimary} ${interactive.transition} ${
                        active
                          ? nav.activeState
                          : `${colors.bgSecondary} ${colors.textPrimary}`
                      }`}
                    >
                      <Icon width={icons.navMobile.size} height={icons.navMobile.size} strokeWidth={1.8} />
                    </div>
                    <span
                      className={`${nav.item.tabLabel} ${
                        active ? 'font-bold' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={nav.item.tab}
                >
                  <Icon
                    width={icons.nav.size}
                    height={icons.nav.size}
                    strokeWidth={active ? icons.strokeActive : icons.nav.strokeWidth}
                  />
                  <span
                    className={`${nav.item.tabLabel} ${
                      active ? 'font-bold' : colors.textMuted
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
