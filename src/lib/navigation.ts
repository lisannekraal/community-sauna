import { type UserRole, hasRole } from '@/types';
import {
  Sandals,
  ClipboardCheck,
  Calendar,
  MultiplePages,
  HelpCircle,
  Community,
  ProfileCircle,
  Lock,
  Settings,
  Megaphone,
  Table,
} from 'iconoir-react';

export type IconComponent = React.ComponentType<{ width: number; height: number; strokeWidth: number }>;

export interface NavItem {
  label: string;
  href: string;
  icon: IconComponent;
}

export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function getMainNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const fifthItem: NavItem =
    isAdminMode && hasRole(role, 'admin')
      ? { label: 'Members', href: '/members', icon: Community }
      : { label: 'Help', href: '/help', icon: HelpCircle };

  return [
    { label: 'Home', href: '/', icon: Sandals },
    { label: 'Bookings', href: '/bookings', icon: ClipboardCheck },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Plans', href: '/plans', icon: MultiplePages },
    fifthItem,
  ];
}

export function getSecondaryNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const items: NavItem[] = [
    { label: 'My Profile', href: '/profile', icon: ProfileCircle },
    { label: 'My Account', href: '/account', icon: Lock },
  ];

  if (isAdminMode && hasRole(role, 'admin')) {
    items.push(
      { label: 'Admin Settings', href: '/admin/settings', icon: Settings },
      { label: 'Manage Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'Manage Q&A', href: '/admin/qa', icon: HelpCircle },
      { label: 'Edit Schedule Templates', href: '/admin/templates', icon: Table },
    );
  }

  return items;
}
