import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { MemberList } from '@/components/members/member-list';
import { MOCK_MEMBERS } from '@/lib/mock-members';

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const role = session.user.role as UserRole;
  if (!hasRole(role, 'admin')) redirect('/');

  // TODO: Replace with real data from Prisma
  const members = MOCK_MEMBERS;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display uppercase mb-8">Members</h1>
      <MemberList members={members} />
    </div>
  );
}
