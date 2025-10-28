import { defaultCurrency } from '@/config/money';
import type { NextRequest, NextResponse } from 'next/server';
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SAME_SITE } from './constants';

export default function withCurrency(request: NextRequest, response: NextResponse) {
  // Check if cookie does not exist
  if (!request.cookies.has(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, defaultCurrency, {
      path: request.nextUrl.basePath || undefined,
      sameSite: COOKIE_SAME_SITE,
      maxAge: COOKIE_MAX_AGE,
    });
  }
}
