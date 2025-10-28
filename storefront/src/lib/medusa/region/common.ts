import { defaultRegion } from '@/config/medusa';
import { COOKIE_NAME as CURRENCY_COOKIE_NAME } from '@/lib/medusa/currency/constants';
import { getCookie, setCookie } from 'cookies-next';
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SAME_SITE } from './constants';

export function setRegionWithCurrencyCookie({
  regionCode,
  currencyCode,
  cookies = undefined,
}: {
  regionCode?: string;
  currencyCode?: string;
  cookies?: any;
}) {
  const currentRegionCode =
    getCookie(COOKIE_NAME, cookies ? { cookies } : undefined) || defaultRegion.country_code;
  const currentCurrencyCode = getCookie(CURRENCY_COOKIE_NAME, cookies ? { cookies } : undefined);

  // Parse current country code from full regionCode (e.g., "sr-usd" => "sr")
  const currentCountryCode = currentRegionCode.split('-')[0];

  let newRegionCode = currentRegionCode;

  if (regionCode && currencyCode) {
    newRegionCode = currencyCode === 'srd' ? regionCode : `${regionCode}-${currencyCode}`;
  } else if (regionCode) {
    newRegionCode =
      currentCurrencyCode === 'srd' ? regionCode : `${regionCode}-${currentCurrencyCode}`;
  } else if (currencyCode) {
    newRegionCode =
      currencyCode === 'srd' ? currentCountryCode : `${currentCountryCode}-${currencyCode}`;
  }

  setCookie(COOKIE_NAME, newRegionCode, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: COOKIE_SAME_SITE,
    cookies,
    path: '/', // ensure visibility
  });
}
