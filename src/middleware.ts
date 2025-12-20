import { withAuth } from 'next-auth/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import * as UAParser from 'ua-parser-js';

export default withAuth(
  function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Handle admin routes
    if (pathname.startsWith('/admin')) {
      // Allow access to login page
      if (pathname === '/admin/login') {
        return NextResponse.next();
      }

      // Admin routes are protected by NextAuth token check in callbacks
      return NextResponse.next();
    }

    // Handle regular user routes with NextAuth
    const userAgent = request.headers.get('user-agent');

    if (userAgent) {
      const parser = UAParser.UAParser(userAgent);
      const device = parser.device;

      if (
        (device.type === 'mobile' || device.type === 'tablet') &&
        pathname === '/account'
      ) {
        return NextResponse.redirect(new URL('/account-menu', request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const url = req.nextUrl.pathname;

        // Admin routes require admin token
        if (url.startsWith('/admin') && url !== '/admin/login') {
          if (!token) {
            return false;
          }
          const user = token as any;
          // Check if user has admin role
          return user?.role === 'admin';
        }

        // Regular user routes require NextAuth token
        if (!token) {
          return false;
        }
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: [
    '/account',
    '/account-menu',
    '/account/:path*',
    '/im/:path*',
    '/admin/:path*',
    '/admin',
  ],
};
