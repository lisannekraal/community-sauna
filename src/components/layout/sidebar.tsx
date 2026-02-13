'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { type UserRole, hasRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems, getSecondaryNavItems } from '@/lib/navigation';
import { AdminModeToggle } from './admin-mode-toggle';
import { LogOut } from 'iconoir-react';

interface SidebarProps {
  userName: string;
  userRole: UserRole;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const isAdmin = hasRole(userRole, 'admin');

  const mainItems = getMainNavItems(userRole, isAdminMode);
  const secondaryItems = getSecondaryNavItems(userRole, isAdminMode);

  return (
    <aside className="fixed left-0 top-0 w-60 h-screen border-r border-black/10 flex flex-col bg-white z-40">
      {/* Branding */}
      <div className="px-5 py-5">
        <Link href="/" className="text-lg font-display">
          Community Sauna
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3">
        <ul>
          {mainItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                    active
                      ? 'bg-black text-white'
                      : 'hover:bg-black hover:text-white'
                  }`}
                >
                  <Icon width={20} height={20} strokeWidth={1.5} />
                  <span className="text-[15px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="border-t border-black/10 my-3 mx-2" />

        {/* Secondary nav */}
        <ul>
          {secondaryItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                    active
                      ? 'bg-black text-white'
                      : 'hover:bg-black hover:text-white'
                  }`}
                >
                  <Icon width={18} height={18} strokeWidth={1.5} />
                  <span className="text-[13px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin toggle — sticks above footer */}
      {isAdmin && (
        <div className="px-5 py-3">
          <AdminModeToggle />
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-4 border-t border-black/10 flex items-center justify-between">
        <span className="text-sm truncate">{userName}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 text-sm shrink-0 cursor-pointer"
        >
          <LogOut width={16} height={16} strokeWidth={1.5} />
          Log out
        </button>
      </div>
    </aside>
  );
}
