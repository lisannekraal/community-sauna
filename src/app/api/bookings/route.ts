import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkUserCredits } from '@/lib/bookings';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { timeslotId } = body as { timeslotId: number };

    if (!timeslotId || typeof timeslotId !== 'number') {
      return NextResponse.json({ error: 'Valid time slot is required' }, { status: 400 });
    }

    const userId = parseInt(session.user.id, 10);

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeslotId },
      include: {
        _count: {
          select: { bookings: { where: { status: 'confirmed' } } },
        },
      },
    });

    if (!timeSlot) {
      return NextResponse.json({ error: 'Time slot not found' }, { status: 404 });
    }

    if (timeSlot.isCancelled) {
      return NextResponse.json({ error: 'This session has been cancelled' }, { status: 400 });
    }

    // Check if slot is in the past
    const now = new Date();
    const slotDate = new Date(timeSlot.date);
    const slotStart = new Date(timeSlot.startTime);
    const slotDateTime = new Date(
      slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate(),
      slotStart.getUTCHours(), slotStart.getUTCMinutes()
    );

    if (slotDateTime < now) {
      return NextResponse.json({ error: 'Cannot book a past session' }, { status: 400 });
    }

    // Check capacity
    if (timeSlot._count.bookings >= timeSlot.capacity) {
      return NextResponse.json({ error: 'This session is full' }, { status: 400 });
    }

    // Check for existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_timeslotId: { userId, timeslotId },
      },
    });

    if (existingBooking && existingBooking.status === 'confirmed') {
      return NextResponse.json({ error: 'You already have a booking for this session' }, { status: 400 });
    }

    // Check membership credits
    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.allowed) {
      return NextResponse.json({ error: creditCheck.error }, { status: 400 });
    }

    // Create or update the booking
    const booking = existingBooking
      ? await prisma.booking.update({
          where: { id: existingBooking.id },
          data: {
            status: 'confirmed',
            membershipId: creditCheck.membershipId,
            cancelledAt: null,
            cancellationReason: null,
          },
        })
      : await prisma.booking.create({
          data: {
            userId,
            timeslotId,
            membershipId: creditCheck.membershipId,
            status: 'confirmed',
          },
        });

    return NextResponse.json({
      success: true,
      booking: { id: booking.id, timeslotId: booking.timeslotId, status: booking.status },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
