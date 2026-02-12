import { type UserRole, hasRole } from '@/types';

export interface NavItem {
  label: string;
  href: string;
  section: 'main' | 'secondary';
}

export function getMainNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const fifthItem: NavItem =
    isAdminMode && hasRole(role, 'admin')
      ? { label: 'Members', href: '/members', section: 'main' }
      : { label: 'Help', href: '/help', section: 'main' };

  return [
    { label: 'Home', href: '/', section: 'main' },
    { label: 'Bookings', href: '/bookings', section: 'main' },
    { label: 'Schedule', href: '/schedule', section: 'main' },
    { label: 'Plans', href: '/plans', section: 'main' },
    fifthItem,
  ];
}

export function getSecondaryNavItems(role: UserRole, isAdminMode: boolean): NavItem[] {
  const items: NavItem[] = [
    { label: 'Profile', href: '/profile', section: 'secondary' },
    { label: 'Account', href: '/account', section: 'secondary' },
  ];

  if (isAdminMode && hasRole(role, 'admin')) {
    items.push(
      { label: 'Settings', href: '/admin/settings', section: 'secondary' },
      { label: 'Announcements', href: '/admin/announcements', section: 'secondary' },
      { label: 'Q&A', href: '/admin/qa', section: 'secondary' },
      { label: 'Schedule Templates', href: '/admin/templates', section: 'secondary' },
    );
  }

  return items;
}
