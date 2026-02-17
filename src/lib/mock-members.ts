// Mock member data for UI development. Replace with real data when connecting to the database.

import type { UserRole } from '@/types';

export interface MemberSummary {
  id: number;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  plan: string | null;
  /** e.g. { weekday: 'Wed', date: '19 Feb' } */
  nextBooking: { weekday: string; date: string } | null;
  lastBooking: { weekday: string; date: string } | null;
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
    name: string;
    status: 'active' | 'expired' | 'payment_pending' | 'suspended' | 'cancelled';
    expiresAt: string | null;
  } | null;
  stats: {
    memberSince: string;
    confirmedBookings: number;
    cancelledBookings: number;
    noShows: number;
    mostVisitedDay: string | null;
  };
  payments: {
    hasDue: boolean;
    pendingCount: number;
    failedCount: number;
  };
  upcomingBookings: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    type: string | null;
  }[];
  lastBooking: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    type: string | null;
  } | null;
}

export const MOCK_MEMBERS: MemberSummary[] = [
  {
    id: 1,
    firstName: 'Anna',
    lastName: 'de Vries',
    role: 'admin',
    plan: 'Unlimited',
    nextBooking: { weekday: 'Wed', date: '19 Feb' },
    lastBooking: null,
  },
  {
    id: 2,
    firstName: 'Bram',
    lastName: 'Jansen',
    role: 'host',
    plan: '8 credits/month',
    nextBooking: { weekday: 'Thu', date: '20 Feb' },
    lastBooking: null,
  },
  {
    id: 3,
    firstName: 'Carmen',
    lastName: null,
    role: 'member',
    plan: 'Punch card (5)',
    nextBooking: null,
    lastBooking: { weekday: 'Sun', date: '9 Feb' },
  },
  {
    id: 4,
    firstName: 'Daan',
    lastName: 'Bakker',
    role: 'member',
    plan: '4 credits/month',
    nextBooking: { weekday: 'Fri', date: '21 Feb' },
    lastBooking: null,
  },
  {
    id: 5,
    firstName: 'Eva',
    lastName: 'Smit',
    role: 'host',
    plan: 'Unlimited',
    nextBooking: { weekday: 'Wed', date: '19 Feb' },
    lastBooking: null,
  },
  {
    id: 6,
    firstName: 'Floris Niks En Meer Enlangetussennaam',
    lastName: 'van ofzo den Berg',
    role: 'member',
    plan: null,
    nextBooking: null,
    lastBooking: { weekday: 'Fri', date: '31 Jan' },
  },
  {
    id: 7,
    firstName: 'Greta',
    lastName: 'Meijer',
    role: 'member',
    plan: '2 credits/month',
    nextBooking: { weekday: 'Sat', date: '22 Feb' },
    lastBooking: null,
  },
  {
    id: 8,
    firstName: 'Hugo',
    lastName: 'de Boer',
    role: 'member',
    plan: 'Trial',
    nextBooking: null,
    lastBooking: { weekday: 'Mon', date: '10 Feb' },
  },
  {
    id: 9,
    firstName: 'Iris',
    lastName: 'Visser',
    role: 'admin',
    plan: 'Unlimited',
    nextBooking: { weekday: 'Wed', date: '19 Feb' },
    lastBooking: null,
  },
  {
    id: 10,
    firstName: 'Jesse',
    lastName: 'de Groot',
    role: 'member',
    plan: 'Punch card (10)',
    nextBooking: { weekday: 'Sun', date: '23 Feb' },
    lastBooking: null,
  },
  {
    id: 11,
    firstName: 'Katja',
    lastName: null,
    role: 'member',
    plan: '4 credits/month',
    nextBooking: null,
    lastBooking: { weekday: 'Sat', date: '8 Feb' },
  },
  {
    id: 12,
    firstName: 'Luca',
    lastName: 'Vermeer',
    role: 'member',
    plan: null,
    nextBooking: null,
    lastBooking: null,
  },
];

export function getMockMemberDetail(id: number): MemberDetail | null {
  const member = MOCK_MEMBERS.find((m) => m.id === id);
  if (!member) return null;

  const details: Record<number, Partial<MemberDetail>> = {
    1: {
      gender: 'female',
      email: 'anna@example.com',
      phone: '+31 6 1234 5678',
      emergencyContactName: 'Peter de Vries',
      emergencyContactPhone: '+31 6 9876 5432',
      plan: { name: 'Unlimited', status: 'active', expiresAt: '2026-06-01' },
      stats: {
        memberSince: 'Oct 2024',
        confirmedBookings: 47,
        cancelledBookings: 2,
        noShows: 0,
        mostVisitedDay: 'Wednesday',
      },
      payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
      upcomingBookings: [
        { id: 101, date: 'Wed 19 Feb', startTime: '18:00', endTime: '20:00', type: 'Mixed session' },
        { id: 102, date: 'Sat 22 Feb', startTime: '10:00', endTime: '12:00', type: 'Women only' },
        { id: 103, date: 'Wed 26 Feb', startTime: '18:00', endTime: '20:00', type: 'Mixed session' },
      ],
      lastBooking: null,
    },
    2: {
      gender: 'male',
      email: 'bram.jansen@example.com',
      phone: '+31 6 2345 6789',
      emergencyContactName: null,
      emergencyContactPhone: null,
      plan: { name: '8 credits/month', status: 'active', expiresAt: '2026-04-15' },
      stats: {
        memberSince: 'Jan 2025',
        confirmedBookings: 12,
        cancelledBookings: 1,
        noShows: 1,
        mostVisitedDay: 'Thursday',
      },
      payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
      upcomingBookings: [
        { id: 201, date: 'Thu 20 Feb', startTime: '10:00', endTime: '12:00', type: 'Mixed session' },
      ],
      lastBooking: null,
    },
    3: {
      gender: null,
      email: 'carmen@example.com',
      phone: '+31 6 3456 7890',
      emergencyContactName: 'Luis Garcia',
      emergencyContactPhone: '+31 6 1111 2222',
      plan: { name: 'Punch card (5)', status: 'active', expiresAt: '2026-04-30' },
      stats: {
        memberSince: 'Dec 2025',
        confirmedBookings: 3,
        cancelledBookings: 0,
        noShows: 0,
        mostVisitedDay: 'Sunday',
      },
      payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
      upcomingBookings: [],
      lastBooking: { id: 301, date: 'Sun 9 Feb', startTime: '14:00', endTime: '16:00', type: 'Mixed session' },
    },
    6: {
      gender: 'male',
      email: 'floris.vdb@example.com',
      phone: '+31 6 6666 7777',
      emergencyContactName: null,
      emergencyContactPhone: null,
      plan: null,
      stats: {
        memberSince: 'Nov 2025',
        confirmedBookings: 5,
        cancelledBookings: 3,
        noShows: 2,
        mostVisitedDay: 'Friday',
      },
      payments: { hasDue: true, pendingCount: 1, failedCount: 1 },
      upcomingBookings: [],
      lastBooking: { id: 601, date: 'Fri 31 Jan', startTime: '18:00', endTime: '20:00', type: null },
    },
  };

  const extra = details[id] || {
    gender: ['male', 'female', null][id % 3],
    email: `${member.firstName.toLowerCase()}@example.com`,
    phone: `+31 6 ${String(id).padStart(4, '0')} ${String(id * 1111).slice(0, 4)}`,
    emergencyContactName: null,
    emergencyContactPhone: null,
    plan: member.plan
      ? { name: member.plan, status: 'active' as const, expiresAt: '2026-05-01' }
      : null,
    stats: {
      memberSince: 'Jan 2026',
      confirmedBookings: id * 3,
      cancelledBookings: id % 3,
      noShows: id % 5 === 0 ? 1 : 0,
      mostVisitedDay: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'][id % 5],
    },
    payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
    upcomingBookings: member.nextBooking
      ? [{ id: id * 100, date: `${member.nextBooking.weekday} ${member.nextBooking.date}`, startTime: '18:00', endTime: '20:00', type: 'Mixed session' }]
      : [],
    lastBooking: member.lastBooking
      ? { id: id * 100 + 1, date: `${member.lastBooking.weekday} ${member.lastBooking.date}`, startTime: '18:00', endTime: '20:00', type: null }
      : null,
  };

  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    role: member.role,
    ...extra,
  } as MemberDetail;
}
