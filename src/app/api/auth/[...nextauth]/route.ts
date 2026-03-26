import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const handler = NextAuth(authOptions);

export { handler as GET };

export async function POST(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const { allowed, retryAfter } = rateLimit(getClientIp(request), 'login', 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }
  return handler(request, context);
}
