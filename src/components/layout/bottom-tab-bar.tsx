'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type UserRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems, isActiveRoute } from '@/lib/navigation';

interface BottomTabBarProps {
  userRole: UserRole;
}

export function BottomTabBar({ userRole }: BottomTabBarProps) {
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const items = getMainNavItems(userRole, isAdminMode);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="relative bg-white border-t border-black/10">
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
                      className={`w-13 h-13 rounded-full flex items-center justify-center border-2 border-black transition-colors ${
                        active
                          ? 'bg-black text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <Icon width={22} height={22} strokeWidth={1.8} />
                    </div>
                    <span
                      className={`text-[11px] tracking-wide ${
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
                  className="flex flex-col items-center gap-0.5 pt-2.5 pb-2"
                >
                  <Icon
                    width={20}
                    height={20}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  <span
                    className={`text-[11px] tracking-wide ${
                      active ? 'font-bold' : 'text-black/50'
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
