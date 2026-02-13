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
  ChatLines,
  Table,
} from 'iconoir-react';

export type IconComponent = React.ComponentType<{ width: number; height: number; strokeWidth: number }>;

export interface NavItem {
  label: string;
  href: string;
  section: 'main' | 'secondary';
  icon: IconComponent;
}

export function getMainNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const fifthItem: NavItem =
    isAdminMode && hasRole(role, 'admin')
      ? { label: 'Members', href: '/members', section: 'main', icon: Community }
      : { label: 'Help', href: '/help', section: 'main', icon: HelpCircle };

  return [
    { label: 'Home', href: '/', section: 'main', icon: Sandals },
    { label: 'Bookings', href: '/bookings', section: 'main', icon: ClipboardCheck },
    { label: 'Schedule', href: '/schedule', section: 'main', icon: Calendar },
    { label: 'Plans', href: '/plans', section: 'main', icon: MultiplePages },
    fifthItem,
  ];
}

export function getSecondaryNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const items: NavItem[] = [
    { label: 'My Profile', href: '/profile', section: 'secondary', icon: ProfileCircle },
    { label: 'My Account', href: '/account', section: 'secondary', icon: Lock },
  ];

  if (isAdminMode && hasRole(role, 'admin')) {
    items.push(
      { label: 'Admin Settings', href: '/admin/settings', section: 'secondary', icon: Settings },
      { label: 'Manage Announcements', href: '/admin/announcements', section: 'secondary', icon: Megaphone },
      { label: 'Manage Q&A', href: '/admin/qa', section: 'secondary', icon: ChatLines },
      { label: 'Edit Schedule Templates', href: '/admin/templates', section: 'secondary', icon: Table },
    );
  }

  return items;
}
