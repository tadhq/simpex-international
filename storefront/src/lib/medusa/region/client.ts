'use client';

import { setRegionWithCurrencyCookie } from './common';

export function setRegionCode(value: string) {
  setRegionWithCurrencyCookie({ currencyCode: value });
}
