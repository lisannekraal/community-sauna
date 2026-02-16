'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { type UserRole, hasRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getMainNavItems, getSecondaryNavItems, isActiveRoute } from '@/lib/navigation';
import { nav, icons, colors, interactive, animation } from '@/lib/design-tokens';
import { AdminModeToggle } from './admin-mode-toggle';
import { Xmark, Menu, LogOut } from 'iconoir-react';

interface HamburgerMenuProps {
  userName: string;
  userRole: UserRole;
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
        <Menu width={icons.navMobile.size} height={icons.navMobile.size} strokeWidth={icons.strokeActive} />
      </button>

      {/* Overlay menu */}
      {isOpen && (
        <div className={`fixed inset-0 z-50 ${colors.bgSecondary} flex flex-col ${animation.fadeIn}`}>
          <div className={`flex items-center px-6 py-4 ${isAdmin ? 'justify-between' : 'justify-end'}`}>
            {isAdmin && <AdminModeToggle />}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <Xmark width={icons.navMobile.size} height={icons.navMobile.size} strokeWidth={icons.strokeActive} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 pt-2">
            {/* Primary nav items */}
            <ul>
              {mainItems.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href} className={`border-b ${colors.borderSubtle}`}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-4 -mx-3 px-3 ${
                        active
                          ? nav.activeState
                          : ''
                      }`}
                    >
                      <Icon width={icons.navMobile.size} height={icons.navMobile.size} strokeWidth={icons.navMobile.strokeWidth} />
                      <span className="text-xl font-display">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Secondary nav items */}
            <ul className="mt-2">
              {secondaryItems.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-2.5 -mx-3 px-4 ${
                        active
                          ? nav.activeState
                          : ''
                      }`}
                    >
                      <Icon width={icons.navSmall.size} height={icons.navSmall.size} strokeWidth={icons.navSmall.strokeWidth} />
                      <span className={nav.text.main}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

          </nav>

          {/* Overlay footer */}
          <div className={`px-6 py-5 border-t ${colors.borderSubtle} flex items-center justify-between`}>
            <span className="text-sm">{userName}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`flex items-center gap-2 text-sm ${interactive.cursorPointer}`}
            >
              <LogOut width={icons.action.size} height={icons.action.size} strokeWidth={icons.action.strokeWidth} />
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
