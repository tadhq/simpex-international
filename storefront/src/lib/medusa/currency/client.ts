'use client';

import { setCookie } from 'cookies-next';
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SAME_SITE } from './constants';

export function setCurrency(value: string) {
  setCookie(COOKIE_NAME, value, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: COOKIE_SAME_SITE,
  });
}
