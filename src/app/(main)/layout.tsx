import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminModeProvider } from '@/contexts/admin-mode';
import { AppShell } from '@/components/layout/app-shell';
import type { UserRole } from '@/types';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Guest: render children bare (for public homepage)
    return <>{children}</>;
  }

  const userRole = (session.user.role || 'member') as UserRole;
  const userName = session.user.name || 'User';

  return (
    <AdminModeProvider userRole={userRole}>
      <AppShell userName={userName} userRole={userRole}>
        {children}
      </AppShell>
    </AdminModeProvider>
  );
}
