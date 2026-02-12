'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type UserRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems } from '@/lib/navigation';

interface BottomTabBarProps {
  userRole: UserRole;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function BottomTabBar({ userRole }: BottomTabBarProps) {
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const items = getMainNavItems(userRole, isAdminMode);

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t-2 border-black bg-white z-40 pb-[env(safe-area-inset-bottom)]">
      <ul className="flex">
        {items.map((item, i) => {
          const active = isActive(pathname, item.href);
          const isCenter = i === 2;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex items-center justify-center py-3 text-xs uppercase font-mono tracking-wide ${
                  active ? 'font-bold border-t-2 border-black -mt-[2px]' : ''
                } ${isCenter ? 'text-sm font-bold' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
