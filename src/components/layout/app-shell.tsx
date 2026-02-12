'use client';

import { type UserRole } from '@/types';
import { Sidebar } from './sidebar';
import { BottomTabBar } from './bottom-tab-bar';
import { HamburgerMenu } from './hamburger-menu';

interface AppShellProps {
  userName: string;
  userRole: UserRole;
  children: React.ReactNode;
}

export function AppShell({ userName, userRole, children }: AppShellProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Sidebar userName={userName} userRole={userRole} />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <HamburgerMenu userName={userName} userRole={userRole} />
      </div>

      {/* Main content */}
      <main className="md:ml-60 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile */}
      <div className="md:hidden">
        <BottomTabBar userRole={userRole} />
      </div>
    </>
  );
}
