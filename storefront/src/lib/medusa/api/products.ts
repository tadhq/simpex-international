import { SALES_CHANNEL_ID } from '@/config/env';
import { medusaClient, medusaClientAdmin } from '@/config/medusa';
import { stringify } from 'qs';
import { cache } from 'react';
import { ProductContextParams } from '../types';
import { getMedusaHeaders } from './common';

export const getProductByHandle = cache(async (handle: string) => {
  const headers = getMedusaHeaders(['products']);

  return medusaClient.products
    .list({ handle, sales_channel_id: [SALES_CHANNEL_ID] }, headers)
    .then(({ products }) => products[0])
    .catch((reason) => {
      console.error(reason);
      return null;
    });
});

export const getPriceListProducts = cache(async (id: string) => {
  const headers = getMedusaHeaders(['price_lists']);

  return medusaClientAdmin.admin.priceLists
    .listProducts(id, {}, { headers }) // Correct usage
    .then(({ products }) => products)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
});

export const getPricedProductById = cache(async (id: string, context?: ProductContextParams) => {
  const headers = getMedusaHeaders(['products']);

  const qs = stringify(
    {
      region_id: context?.region,
      currency_code: context?.currency,
      sales_channel_id: SALES_CHANNEL_ID,
      expand: 'categories,images,variants,variants.prices',
    },
    { addQueryPrefix: true }
  );

  // Remove the query string from the ID and pass it as part of the options.
  return medusaClient.products
    .retrieve(id, { headers, params: qs }) // Properly pass `qs` as query parameters.
    .then(({ product }) => product)
    .catch((reason) => {
      throw reason;
    });
});

export const getProductsById = cache(async (ids: string[], context?: ProductContextParams) => {
  const headers = getMedusaHeaders(['products']);

  const qs = {
    region_id: context?.region,
    currency_code: context?.currency,
  };

  return medusaClient.products
    .list({ id: ids, sales_channel_id: [SALES_CHANNEL_ID], ...qs }, headers)
    .then(({ products }) => products)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
});

export const getSingleProductById = cache(async (id: string, context?: ProductContextParams) => {
  if (!id) {
    console.error('Product ID is required');
    return null; // Return null if the ID is invalid
  }

  const headers = getMedusaHeaders(['products']);
  const qs = {
    region_id: context?.region,
    currency_code: context?.currency,
    sales_channel_id: [SALES_CHANNEL_ID],
  };

  try {
    const { products } = await medusaClient.products.list({ id, ...qs }, headers);
    return products[0];
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
});
