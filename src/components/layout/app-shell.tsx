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
      <div className="hidden lg:block">
        <Sidebar userName={userName} userRole={userRole} />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <HamburgerMenu userName={userName} userRole={userRole} />
      </div>

      {/* Main content */}
      <main className="lg:ml-60 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile */}
      <div className="lg:hidden">
        <BottomTabBar userRole={userRole} />
      </div>
    </>
  );
}
