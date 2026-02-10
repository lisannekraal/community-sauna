import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { type TimeSlotData } from '@/types';
import { formatDateISO } from '@/lib/schedule';
import { Schedule } from '@/components/schedule/schedule';

function getDummySlots(): TimeSlotData[] {
  const today = new Date();
  const dateFor = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return formatDateISO(d);
  };

  return [
    // Yesterday (past)
    { id: 10, date: dateFor(-1), startTime: '18:00', endTime: '20:00', capacity: 5, bookedCount: 5, type: null, description: null, isCancelled: false },
    // Today
    { id: 1, date: dateFor(0), startTime: '10:00', endTime: '12:00', capacity: 5, bookedCount: 3, type: 'Morning session', description: null, isCancelled: false },
    { id: 9, date: dateFor(0), startTime: '13:00', endTime: '16:00', capacity: 5, bookedCount: 0, type: 'Women and Non-binary only', description: 'Lala lalala lalalala lalala', isCancelled: false },
    // Tomorrow
    { id: 3, date: dateFor(1), startTime: '13:00', endTime: '15:00', capacity: 5, bookedCount: 2, type: null, description: null, isCancelled: false },
    { id: 4, date: dateFor(1), startTime: '19:00', endTime: '21:00', capacity: 5, bookedCount: 0, type: 'Evening session', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eleifend ex in mattis dignissim. Fusce sodales sapien sit amet ante malesuada, nec consequat purus tempor. Donec interdum, orci at sagittis venenatis, leo massa commodo enim, et euismod lectus metus eget dui. Etiam consectetur, odio quis porttitor aliquam, arcu sem mattis erat, vitae sollicitudin dolor purus nec enim. Aenean viverra lacus nunc, at tristique sapien cursus a.', isCancelled: false },
    // Day after tomorrow
    { id: 5, date: dateFor(2), startTime: '18:00', endTime: '20:00', capacity: 5, bookedCount: 5, type: null, description: null, isCancelled: false },
    // +3 days
    { id: 6, date: dateFor(3), startTime: '19:00', endTime: '21:00', capacity: 5, bookedCount: 1, type: null, description: null, isCancelled: true },
    // +4 days
    { id: 7, date: dateFor(4), startTime: '13:00', endTime: '15:00', capacity: 5, bookedCount: 0, type: null, description: null, isCancelled: false },
    { id: 8, date: dateFor(4), startTime: '19:00', endTime: '21:00', capacity: 5, bookedCount: 3, type: null, description: null, isCancelled: false },
  ];
}

export default async function AppHomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/app/login');
  }

  const timeSlots = getDummySlots();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display uppercase mb-8">Welcome, {session.user.name}</h1>
      <Schedule timeSlots={timeSlots} />
    </div>
  );
}
