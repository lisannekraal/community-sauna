import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function AppHomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/app/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-display uppercase">Welcome, {session.user.name}</h1>
      </div>
    </div>
  );
}
