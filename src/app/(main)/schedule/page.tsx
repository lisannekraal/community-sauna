import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { type TimeSlotData } from '@/types';
import { formatDateISO, formatTimeUTC } from '@/lib/schedule';
import { Schedule } from '@/components/schedule/schedule';

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userId = parseInt(session.user.id, 10);

  const slots = await prisma.timeSlot.findMany({
    include: {
      _count: {
        select: { bookings: { where: { status: 'confirmed' } } },
      },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  const timeSlots: TimeSlotData[] = slots.map((slot) => ({
    id: slot.id,
    date: formatDateISO(slot.date),
    startTime: formatTimeUTC(slot.startTime),
    endTime: formatTimeUTC(slot.endTime),
    capacity: slot.capacity,
    bookedCount: slot._count.bookings,
    type: slot.type,
    description: slot.description,
    isCancelled: slot.isCancelled,
  }));

  const userBookings = await prisma.booking.findMany({
    where: {
      userId,
      status: 'confirmed',
    },
    select: {
      id: true,
      timeslotId: true,
    },
  });

  const userBookingsMap: Record<number, number> = {};
  for (const b of userBookings) {
    userBookingsMap[b.timeslotId] = b.id;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display uppercase mb-8">Schedule</h1>
      <Schedule timeSlots={timeSlots} userBookings={userBookingsMap} />
    </div>
  );
}
