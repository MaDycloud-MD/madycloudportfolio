import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes, not /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Client-side useAuth handles the real guard.
    // This middleware adds a lightweight cookie check as a first layer.
    const session = req.cookies.get('madycloud_session');
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
