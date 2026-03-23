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
      ? { label: 'members', href: '/members', icon: Community }
      : { label: 'help', href: '/help', icon: HelpCircle };

  return [
    { label: 'home', href: '/', icon: Sandals },
    { label: 'bookings', href: '/bookings', icon: ClipboardCheck },
    { label: 'schedule', href: '/schedule', icon: Calendar },
    { label: 'plans', href: '/plans', icon: MultiplePages },
    fifthItem,
  ];
}

export function getSecondaryNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const items: NavItem[] = [
    { label: 'profile', href: '/profile', icon: ProfileCircle },
    { label: 'account', href: '/account', icon: Lock },
  ];

  if (isAdminMode && hasRole(role, 'admin')) {
    items.push(
      { label: 'adminSettings', href: '/admin/settings', icon: Settings },
      { label: 'manageAnnouncements', href: '/admin/announcements', icon: Megaphone },
      { label: 'manageQA', href: '/admin/qa', icon: HelpCircle },
      { label: 'editScheduleTemplates', href: '/admin/templates', icon: Table },
    );
  }

  return items;
}
