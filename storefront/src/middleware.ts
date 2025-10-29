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
  const pathname = request.nextUrl.pathname;

  // Redirect all non-home routes to home page (coming soon mode)
  // Allow: home page, API routes, Next.js internals, static files, root
  const isHomePage = /^\/[^\/]+\/[^\/]+(\/)?$/.test(pathname); // Matches /[locale]/[store] or /[locale]/[store]/
  const isAllowedRoute =
    isHomePage ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.\w+$/) || // Static files with extension
    pathname === '/';

  // Handle locale-only routes (e.g., /en/) - redirect to default store
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length === 1 && locales.includes(pathParts[0] as any)) {
    // This is just a locale, redirect to locale + default store
    const locale = pathParts[0];
    const defaultStore = 'retail'; // Default store based on StoreSwitchingContext
    const homeUrl = new URL(`/${locale}/${defaultStore}`, request.url);
    return Response.redirect(homeUrl);
  }

  // If not allowed route and has locale/store structure, redirect to home
  if (!isAllowedRoute && pathname.startsWith('/')) {
    if (pathParts.length >= 2 && locales.includes(pathParts[0] as any)) {
      const locale = pathParts[0];
      const store = pathParts[1];
      const homeUrl = new URL(`/${locale}/${store}`, request.url);
      return Response.redirect(homeUrl);
    }
  }

  // Continue with normal middleware flow
  const response = intlMiddleware(request);

  withCurrency(request, response);
  withRegion(request, response);

  if (isHomePage) {
    response.headers.set('x-is-home-page', 'true');
  }

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
