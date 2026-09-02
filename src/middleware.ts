import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

const authMiddleware = withAuth(
  function onSuccess() {
    return NextResponse.next();
  },
  {
    pages: { signIn: '/admin/login' }
  }
);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Le backoffice n'est pas traduit par prefixe de locale : il gere sa
  // propre protection via next-auth. Le reste du site passe par next-intl.
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return (authMiddleware as any)(req);
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};
