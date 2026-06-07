import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any;
    const cloudType: string = token?.cloudType || 'hr';
    const pathname = req.nextUrl.pathname;

    // HR Cloud routes — only hr cloudType allowed
    const isHRRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/employees') ||
      pathname.startsWith('/attendance') ||
      pathname.startsWith('/leave') ||
      pathname.startsWith('/payroll') ||
      pathname.startsWith('/kpi') ||
      pathname.startsWith('/recruitment') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/tasks') ||
      pathname.startsWith('/documents') ||
      pathname.startsWith('/training') ||
      pathname.startsWith('/analytics') ||
      pathname.startsWith('/ai') ||
      pathname.startsWith('/security') ||
      pathname.startsWith('/erp') ||
      pathname.startsWith('/franchise') ||
      pathname.startsWith('/labor-exchange') ||
      pathname.startsWith('/automation') ||
      pathname.startsWith('/integrations') ||
      pathname.startsWith('/workflows') ||
      pathname.startsWith('/e-signature') ||
      pathname.startsWith('/white-label') ||
      pathname.startsWith('/messages') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/organization') ||
      pathname.startsWith('/social') ||
      pathname.startsWith('/announcements') ||
      pathname.startsWith('/helpdesk') ||
      pathname.startsWith('/billing') ||
      pathname.startsWith('/settings');

    // School Cloud routes — only school cloudType allowed
    const isSchoolRoute = pathname.startsWith('/school');

    // Kinder Cloud routes — only kinder cloudType allowed
    const isKinderRoute = pathname.startsWith('/kinder');

    // Redirect if wrong cloud type
    if (isSchoolRoute && cloudType !== 'school') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (isKinderRoute && cloudType !== 'kinder') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (isHRRoute && cloudType === 'school') {
      return NextResponse.redirect(new URL('/school', req.url));
    }
    if (isHRRoute && cloudType === 'kinder') {
      return NextResponse.redirect(new URL('/kinder', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/employees/:path*',
    '/attendance/:path*',
    '/leave/:path*',
    '/payroll/:path*',
    '/kpi/:path*',
    '/recruitment/:path*',
    '/onboarding/:path*',
    '/tasks/:path*',
    '/documents/:path*',
    '/training/:path*',
    '/analytics/:path*',
    '/ai/:path*',
    '/security/:path*',
    '/erp/:path*',
    '/franchise/:path*',
    '/labor-exchange/:path*',
    '/automation/:path*',
    '/integrations/:path*',
    '/workflows/:path*',
    '/e-signature/:path*',
    '/white-label/:path*',
    '/messages/:path*',
    '/reports/:path*',
    '/organization/:path*',
    '/social/:path*',
    '/announcements/:path*',
    '/helpdesk/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/school/:path*',
    '/kinder/:path*',
  ],
};
