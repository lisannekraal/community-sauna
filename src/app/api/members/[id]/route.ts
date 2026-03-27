import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { hasRole } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !hasRole(session.user.role, 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const memberId = parseInt(id, 10);
  if (isNaN(memberId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const body = await request.json() as { role?: unknown };
  const { role } = body;

  if (role !== 'member' && role !== 'host') {
    return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id: memberId }, select: { role: true } });
  if (!existing) return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
  if (existing.role === 'admin' || existing.role === 'superadmin') {
    return NextResponse.json({ error: 'Admin roles cannot be changed here.' }, { status: 403 });
  }

  const user = await prisma.user.update({
    where: { id: memberId },
    data: { role },
    select: { id: true, role: true },
  });

  return NextResponse.json(user);
}
