import { medusaClient } from '@/config/medusa';
import { cache } from 'react';
import { medusaError } from '../utils';
import { getMedusaHeaders } from './common';

export const listRegions = cache(async () => {
  return medusaClient.regions
    .list()
    .then(({ regions }) => regions)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
});

export const retrieveRegion = cache(async (id: string) => {
  const headers = getMedusaHeaders(['regions']);

  return medusaClient.regions
    .retrieve(id, headers)
    .then(({ region }) => region)
    .catch((reason) => medusaError(reason));
});
