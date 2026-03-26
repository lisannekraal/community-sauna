import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateToken, hashToken } from '@/lib/token';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const TOKEN_EXPIRY_HOURS = 1;
const HOUR = 60 * 60 * 1000;

export async function POST(request: Request) {
  const { allowed, retryAfter } = rateLimit(getClientIp(request), 'forgot-password', 3, HOUR);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration attacks
    const successResponse = NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return successResponse;
    }

    // Delete any existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // TODO: Send email with resetUrl
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV] Password reset URL:', resetUrl);
    }

    return successResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
