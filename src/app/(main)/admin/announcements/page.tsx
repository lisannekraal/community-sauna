import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';

export default async function AdminAnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const role = session.user.role as UserRole;
  if (!hasRole(role, 'admin')) redirect('/');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display uppercase mb-8">Announcements</h1>
      <p className="text-gray-600">Coming soon.</p>
    </div>
  );
}
