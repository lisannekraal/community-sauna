'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { type UserRole, hasRole } from '@/types';
import { useAdminMode } from '@/contexts/admin-mode';
import { getSecondaryNavItems } from '@/lib/navigation';

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
  const { isAdminMode, toggleAdminMode } = useAdminMode();
  const isAdmin = hasRole(userRole, 'admin');

  const secondaryItems = getSecondaryNavItems(userRole, isAdminMode);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white border-2 border-black"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-black" />
        <span className="block w-5 h-0.5 bg-black" />
        <span className="block w-5 h-0.5 bg-black" />
      </button>

      {/* Overlay + slide-in menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white border-l-2 border-black z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <span className="text-lg font-display uppercase">Community Sauna</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center border-2 border-black"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Admin toggle */}
            {isAdmin && (
              <div className="px-4 py-3 border-b-2 border-black">
                <button
                  onClick={toggleAdminMode}
                  className="w-full text-left text-sm font-medium px-2 py-2 border-2 border-black hover:bg-gray-100"
                >
                  {isAdminMode ? 'Switch to member view' : 'Switch to admin view'}
                </button>
              </div>
            )}

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                {secondaryItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 ${
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
          </div>
        </>
      )}
    </>
  );
}
