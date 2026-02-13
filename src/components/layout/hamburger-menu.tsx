'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { type UserRole, hasRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems, getSecondaryNavItems } from '@/lib/navigation';
import { AdminModeToggle } from './admin-mode-toggle';
import { Xmark, Menu, LogOut } from 'iconoir-react';

interface HamburgerMenuProps {
  userName: string;
  userRole: UserRole;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function HamburgerMenu({ userName, userRole }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAdminMode } = useAdminMode();
  const isAdmin = hasRole(userRole, 'admin');

  const mainItems = getMainNavItems(userRole, isAdminMode);
  const secondaryItems = getSecondaryNavItems(userRole, isAdminMode);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2"
        aria-label="Open menu"
      >
        <Menu width={22} height={22} strokeWidth={2} />
      </button>

      {/* Full-screen overlay menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-[fadeIn_150ms_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            {isAdmin ? <AdminModeToggle /> : <div />}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <Xmark width={22} height={22} strokeWidth={2} />
            </button>
          </div>

          {/* Nav content */}
          <nav className="flex-1 overflow-y-auto px-6 pt-2">
            {/* Main nav items — large */}
            <ul>
              {mainItems.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href} className="border-b border-black/10">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-4 -mx-3 px-3 ${
                        active
                          ? 'bg-black text-white'
                          : ''
                      }`}
                    >
                      <Icon width={22} height={22} strokeWidth={1.5} />
                      <span className="text-xl font-display">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Secondary nav items — smaller */}
            <ul className="mt-2">
              {secondaryItems.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-2.5 -mx-3 px-4 ${
                        active
                          ? 'bg-black text-white'
                          : ''
                      }`}
                    >
                      <Icon width={18} height={18} strokeWidth={1.5} />
                      <span className="text-[15px]">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

          </nav>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-black/10 flex items-center justify-between">
            <span className="text-sm">{userName}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <LogOut width={16} height={16} strokeWidth={1.5} />
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
