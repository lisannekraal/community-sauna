// Shared member-related labels, utilities, and types.

import type { UserRole } from '@/types';

export interface MemberSummary {
  id: number;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  plan: string | null;
  gender: 'male' | 'female' | 'non_binary' | 'other' | 'prefer_not_to_say' | null;
  noShows: number;
  paymentStatus: 'ok' | 'pending' | 'failed' | null;
  nextBooking: { dateISO: string } | null;
  lastBooking: { dateISO: string } | null;
}

export interface MemberDetail {
  id: number;
  firstName: string;
  lastName: string | null;
  gender: string | null;
  role: UserRole;
  email: string;
  phone: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  plan: {
    id: number;
    name: string;
    status: 'active' | 'expired' | 'payment_pending' | 'suspended' | 'cancelled';
    expiresAt: string | null;
    isFreeAdminPlan: boolean; // true when notes = 'Free membership added by admin'
  } | null;
  stats: {
    memberSince: string; // 'YYYY-MM'
    confirmedBookings: number;
    cancelledBookings: number;
    noShows: number;
    mostVisitedDay: number | null; // JS getDay(): 0=Sun, 1=Mon, …, 6=Sat
  };
  payments: {
    hasDue: boolean;
    pendingCount: number;
    failedCount: number;
    history: {
      id: number;
      amountCents: number;
      status: 'pending' | 'succeeded' | 'failed' | 'refunded';
      createdAt: string; // ISO string
      planName: string | null;
    }[];
  };
  pastMemberships: {
    id: number;
    planName: string;
    status: 'active' | 'expired' | 'payment_pending' | 'suspended' | 'cancelled';
    startsAt: string;
    expiresAt: string | null;
  }[];
  upcomingBookings: {
    id: number;
    dateISO: string;
    startTime: string;
    endTime: string;
    type: string | null;
  }[];
  // All past bookings ordered date desc. pastBookings[0] is the most recent.
  pastBookings: {
    id: number;
    dateISO: string;
    startTime: string;
    endTime: string;
    type: string | null;
    status: 'confirmed' | 'cancelled' | 'no_show';
  }[];
}

export const GENDER_OPTIONS = [
  { value: 'female',            key: 'female',          short: 'F'   },
  { value: 'non_binary',        key: 'nonBinary',        short: 'NB'  },
  { value: 'male',              key: 'male',             short: 'M'   },
  { value: 'other',             key: 'other',            short: 'Other' },
  { value: 'prefer_not_to_say', key: 'preferNotToSay',  short: 'N/A' },
] as const;

export function genderLabel(gender: string | null): string | null {
  if (!gender) return null;
  return GENDER_OPTIONS.find((opt) => opt.value === gender)?.short ?? null;
}

export function membershipStatusLabel(status: string): { text: string; variant: 'default' | 'outline' | 'muted' } {
  switch (status) {
    case 'active': return { text: 'Active', variant: 'default' };
    case 'expired': return { text: 'Expired', variant: 'muted' };
    case 'payment_pending': return { text: 'Payment pending', variant: 'outline' };
    case 'suspended': return { text: 'Suspended', variant: 'muted' };
    case 'cancelled': return { text: 'Cancelled', variant: 'muted' };
    default: return { text: status, variant: 'muted' };
  }
}
