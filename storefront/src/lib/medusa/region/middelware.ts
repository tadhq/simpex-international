import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from './constants';

export default function withRegion(request: NextRequest, response: NextResponse) {
  const regionCookie = request.cookies.get(COOKIE_NAME);

  // If no region cookie, set default to 'sr'
  if (!regionCookie) {
    response.cookies.set(COOKIE_NAME, 'sr', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  return response;
}
