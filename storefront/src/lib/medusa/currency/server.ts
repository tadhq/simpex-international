import { cookies } from 'next/headers';
import { cache } from 'react';
import { COOKIE_NAME } from './constants';

function _getCurrencyFromHeader() {
  let currency;

  try {
    currency = cookies().get(COOKIE_NAME)?.value;
  } catch (error: any) {
    throw error;
  }

  return currency;
}

const getCurrencyFromHeader = cache(_getCurrencyFromHeader);

export function getCurrency() {
  return Promise.resolve(getCurrencyFromHeader());
}
