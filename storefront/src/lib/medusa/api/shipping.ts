import { medusaClient } from '@/config/medusa';
import { cache } from 'react';
import { getMedusaHeaders } from './common';

export const listShippingMethods = cache(async (regionId: string, productIds?: string[]) => {
  const headers = getMedusaHeaders(['shipping']);

  const product_ids = productIds?.join(',');

  return medusaClient.shippingOptions
    .list(
      {
        region_id: regionId,
        product_ids,
      },
      headers
    )
    .then(({ shipping_options }) => shipping_options)
    .catch((error) => {
      console.error(error.message);
      return null;
    });
});
