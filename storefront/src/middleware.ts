import { defaultLocale, locales } from '@/config/i18n';
import withCurrency from '@/lib/medusa/currency/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import withRegion from './lib/medusa/region/middelware';

const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  withCurrency(request, response);
  withRegion(request, response);

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(nl|en|es|ch)/:path*', // Add 'es' and 'ch' here
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};
