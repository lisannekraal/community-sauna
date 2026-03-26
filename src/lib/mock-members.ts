// Mock member data for UI development. Replace with real data when connecting to the database.

import type { UserRole } from '@/types';

export interface MemberSummary {
  id: number;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  plan: string | null;
  // gender matches the DB Gender enum values; null = not set by user
  gender: 'male' | 'female' | 'non_binary' | 'other' | 'prefer_not_to_say' | null;
  noShows: number;
  // derived from latest payment: null = no payments on record
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
    name: string;
    status: 'active' | 'expired' | 'payment_pending' | 'suspended' | 'cancelled';
    expiresAt: string | null;
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
  };
  upcomingBookings: {
    id: number;
    dateISO: string;
    startTime: string;
    endTime: string;
    type: string | null;
  }[];
  lastBooking: {
    id: number;
    dateISO: string;
    startTime: string;
    endTime: string;
    type: string | null;
  } | null;
}

export const MOCK_MEMBERS: MemberSummary[] = [
  { id: 1,  firstName: 'Anna',   lastName: 'de Vries',   role: 'admin',  plan: 'Unlimited',       gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-19' }, lastBooking: null },
  { id: 2,  firstName: 'Bram',   lastName: 'Jansen',     role: 'host',   plan: '8 credits/month', gender: 'male',             noShows: 1, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-20' }, lastBooking: null },
  { id: 3,  firstName: 'Carmen', lastName: null,          role: 'member', plan: 'Punch card (5)',  gender: null,               noShows: 0, paymentStatus: 'ok',      nextBooking: null,                       lastBooking: { dateISO: '2026-02-09' } },
  { id: 4,  firstName: 'Daan',   lastName: 'Bakker',     role: 'member', plan: '4 credits/month', gender: 'male',             noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-21' }, lastBooking: null },
  { id: 5,  firstName: 'Eva',    lastName: 'Smit',       role: 'host',   plan: 'Unlimited',       gender: 'female',           noShows: 1, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-19' }, lastBooking: null },
  { id: 6,  firstName: 'Floris Niks En Meer Enlangetussennaam', lastName: 'van ofzo den Berg', role: 'member', plan: null, gender: 'male', noShows: 2, paymentStatus: 'failed',  nextBooking: null, lastBooking: { dateISO: '2026-01-31' } },
  { id: 7,  firstName: 'Greta',  lastName: 'Meijer',     role: 'member', plan: '2 credits/month', gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-22' }, lastBooking: null },
  { id: 8,  firstName: 'Hugo',   lastName: 'de Boer',    role: 'member', plan: 'Trial',           gender: null,               noShows: 0, paymentStatus: 'pending', nextBooking: null,                       lastBooking: { dateISO: '2026-02-10' } },
  { id: 9,  firstName: 'Iris',   lastName: 'Visser',     role: 'admin',  plan: 'Unlimited',       gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-19' }, lastBooking: null },
  { id: 10, firstName: 'Jesse',  lastName: 'de Groot',   role: 'member', plan: 'Punch card (10)', gender: 'non_binary',       noShows: 1, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-23' }, lastBooking: null },
  { id: 11, firstName: 'Katja',  lastName: null,          role: 'member', plan: '4 credits/month', gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: null,                       lastBooking: { dateISO: '2026-02-08' } },
  { id: 12, firstName: 'Luca',    lastName: 'Vermeer',      role: 'member', plan: null,              gender: 'prefer_not_to_say', noShows: 0, paymentStatus: 'pending', nextBooking: null,                       lastBooking: null },
  { id: 13, firstName: 'Mia',     lastName: 'van Dam',      role: 'member', plan: 'Unlimited',       gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-24' }, lastBooking: null },
  { id: 14, firstName: 'Noah',    lastName: 'Peters',       role: 'member', plan: null,              gender: 'male',             noShows: 0, paymentStatus: 'ok',      nextBooking: null,                       lastBooking: { dateISO: '2026-02-05' } },
  { id: 15, firstName: 'Olivia',  lastName: 'Hendriks',     role: 'host',   plan: '4 credits/month', gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-25' }, lastBooking: null },
  { id: 16, firstName: 'Pieter',  lastName: 'de Jong',      role: 'member', plan: '8 credits/month', gender: 'male',             noShows: 1, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-26' }, lastBooking: null },
  { id: 17, firstName: 'Quinn',   lastName: null,           role: 'member', plan: 'Punch card (5)',  gender: 'non_binary',       noShows: 0, paymentStatus: 'ok',      nextBooking: null,                       lastBooking: { dateISO: '2026-02-12' } },
  { id: 18, firstName: 'Rosa',    lastName: 'Mulder',       role: 'member', plan: '2 credits/month', gender: 'female',           noShows: 0, paymentStatus: 'pending', nextBooking: { dateISO: '2026-02-27' }, lastBooking: null },
  { id: 19, firstName: 'Sam',     lastName: 'Dekker',       role: 'member', plan: 'Trial',           gender: 'prefer_not_to_say', noShows: 0, paymentStatus: 'ok',     nextBooking: null,                       lastBooking: null },
  { id: 20, firstName: 'Tessa',   lastName: 'van Leeuwen',  role: 'member', plan: 'Unlimited',       gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-02-28' }, lastBooking: null },
  { id: 21, firstName: 'Umar',    lastName: 'Hassan',       role: 'member', plan: '4 credits/month', gender: 'male',             noShows: 2, paymentStatus: 'failed',  nextBooking: null,                       lastBooking: { dateISO: '2026-02-15' } },
  { id: 22, firstName: 'Vera',    lastName: 'Brouwer',      role: 'host',   plan: '8 credits/month', gender: 'female',           noShows: 0, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-03-01' }, lastBooking: null },
  { id: 23, firstName: 'Willem',  lastName: null,           role: 'member', plan: null,              gender: 'male',             noShows: 0, paymentStatus: 'pending', nextBooking: null,                       lastBooking: null },
  { id: 24, firstName: 'Xena',    lastName: 'de Wit',       role: 'member', plan: 'Punch card (10)', gender: 'other',            noShows: 1, paymentStatus: 'ok',      nextBooking: { dateISO: '2026-03-02' }, lastBooking: null },
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
        memberSince: '2024-10',
        confirmedBookings: 47,
        cancelledBookings: 2,
        noShows: 0,
        mostVisitedDay: 3, // Wednesday
      },
      payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
      upcomingBookings: [
        { id: 101, dateISO: '2026-02-19', startTime: '18:00', endTime: '20:00', type: 'Mixed session' },
        { id: 102, dateISO: '2026-02-22', startTime: '10:00', endTime: '12:00', type: 'Women only' },
        { id: 103, dateISO: '2026-02-26', startTime: '18:00', endTime: '20:00', type: 'Mixed session' },
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
        memberSince: '2025-01',
        confirmedBookings: 12,
        cancelledBookings: 1,
        noShows: 1,
        mostVisitedDay: 4, // Thursday
      },
      payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
      upcomingBookings: [
        { id: 201, dateISO: '2026-02-20', startTime: '10:00', endTime: '12:00', type: 'Mixed session' },
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
        memberSince: '2025-12',
        confirmedBookings: 3,
        cancelledBookings: 0,
        noShows: 0,
        mostVisitedDay: 0, // Sunday
      },
      payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
      upcomingBookings: [],
      lastBooking: { id: 301, dateISO: '2026-02-09', startTime: '14:00', endTime: '16:00', type: 'Mixed session' },
    },
    6: {
      gender: 'male',
      email: 'floris.vdb@example.com',
      phone: '+31 6 6666 7777',
      emergencyContactName: null,
      emergencyContactPhone: null,
      plan: null,
      stats: {
        memberSince: '2025-11',
        confirmedBookings: 5,
        cancelledBookings: 3,
        noShows: 2,
        mostVisitedDay: 5, // Friday
      },
      payments: { hasDue: true, pendingCount: 1, failedCount: 1 },
      upcomingBookings: [],
      lastBooking: { id: 601, dateISO: '2026-01-31', startTime: '18:00', endTime: '20:00', type: null },
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
      memberSince: '2026-01',
      confirmedBookings: id * 3,
      cancelledBookings: id % 3,
      noShows: id % 5 === 0 ? 1 : 0,
      mostVisitedDay: [1, 3, 5, 6, 0][id % 5], // Mon, Wed, Fri, Sat, Sun
    },
    payments: { hasDue: false, pendingCount: 0, failedCount: 0 },
    upcomingBookings: member.nextBooking
      ? [{ id: id * 100, dateISO: member.nextBooking.dateISO, startTime: '18:00', endTime: '20:00', type: 'Mixed session' }]
      : [],
    lastBooking: member.lastBooking
      ? { id: id * 100 + 1, dateISO: member.lastBooking.dateISO, startTime: '18:00', endTime: '20:00', type: null }
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
