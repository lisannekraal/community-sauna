import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

const protectedRoutes = ['/schedule', '/bookings', '/plans', '/profile', '/account', '/help', '/members', '/admin'];

const adminRoutes = ['/members', '/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  // Only handle auth and protected routes
  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect authenticated users away from login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login (except for auth routes)
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based guards for admin routes
  const isAdminRoute = adminRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
  if (isAdminRoute && token) {
    const role = token.role as string;
    if (role !== 'admin' && role !== 'superadmin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/schedule/:path*',
    '/bookings/:path*',
    '/plans/:path*',
    '/profile/:path*',
    '/account/:path*',
    '/help/:path*',
    '/members/:path*',
    '/admin/:path*',
  ],
};
