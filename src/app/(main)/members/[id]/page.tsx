import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { hasRole, type UserRole } from '@/types';
import { MemberDetail } from '@/components/members/member-detail';
import { getMockMemberDetail } from '@/lib/mock-members';

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const role = session.user.role as UserRole;
  if (!hasRole(role, 'admin')) redirect('/');

  const { id } = await params;
  const memberId = parseInt(id, 10);
  if (isNaN(memberId)) notFound();

  // TODO: Replace with real data from Prisma
  const member = getMockMemberDetail(memberId);
  if (!member) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <MemberDetail member={member} />
    </div>
  );
}
