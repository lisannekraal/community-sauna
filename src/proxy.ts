import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Auth pages within /app that don't require login
const authRoutes = ['/app/login', '/app/register', '/app/forgot-password', '/app/reset-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /app routes
  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // Redirect unauthenticated users to login (except for auth routes)
  if (!isAuthRoute && !token) {
    const loginUrl = new URL('/app/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
