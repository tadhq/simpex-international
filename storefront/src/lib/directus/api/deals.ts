import { directusClient } from '@/config/directus';
import { readItems } from '@directus/sdk';
import { DirectusSchema } from '../types';

export function getProductDeals() {
  return directusClient.request<DirectusSchema['sales_events']>(
    readItems('sales_events', {
      fields: ['*.*.*'] as any,
    })
  );
}
