'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { type UserRole, hasRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems, getSecondaryNavItems } from '@/lib/navigation';

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
  const { isAdminMode, toggleAdminMode } = useAdminMode();
  const isAdmin = hasRole(userRole, 'admin');

  const mainItems = getMainNavItems(userRole, isAdminMode);
  const secondaryItems = getSecondaryNavItems(userRole, isAdminMode);

  return (
    <aside className="fixed left-0 top-0 w-60 h-screen border-r-2 border-black flex flex-col bg-white z-40">
      {/* Branding */}
      <div className="p-4 border-b-2 border-black">
        <Link href="/" className="text-lg font-display uppercase">
          Community Sauna
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {mainItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-3 font-medium ${
                  isActive(pathname, item.href)
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t-2 border-black mx-4" />

        {/* Secondary nav */}
        <ul className="py-2">
          {secondaryItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  isActive(pathname, item.href)
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Admin toggle */}
        {isAdmin && (
          <>
            <div className="border-t-2 border-black mx-4" />
            <div className="px-4 py-3">
              <button
                onClick={toggleAdminMode}
                className="w-full text-left text-sm font-medium px-2 py-2 border-2 border-black hover:bg-gray-100"
              >
                {isAdminMode ? 'Switch to member view' : 'Switch to admin view'}
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t-2 border-black p-4">
        <p className="text-sm font-medium truncate mb-2">{userName}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-sm hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
