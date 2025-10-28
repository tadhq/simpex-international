import type { Region } from '@medusajs/medusa';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { listRegions } from '../api/regions';
import { setRegionWithCurrencyCookie } from './common';

const regionMap = new Map<string, Region>();

export const getRegion = cache(async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode);
    }

    const regions = await listRegions();

    if (!regions) return null;

    regions.forEach((region) => {
      region.countries.forEach((c) => {
        regionMap.set(c.iso_2, region);
      });
    });

    const region = countryCode ? regionMap.get(countryCode) : regionMap.get('sr');

    return region;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
});

export function setRegionCode(regionCode?: string) {
  setRegionWithCurrencyCookie({ regionCode, cookies });
}
