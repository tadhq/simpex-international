import { medusaClient, medusaClientAdmin } from '@/config/medusa';
import { cache } from 'react';
import { medusaError } from '../utils';
import { getMedusaHeaders } from './common';

export const retrieveOrder = cache(async (id: string) => {
  const headers = getMedusaHeaders(['order']);

  return medusaClient.orders
    .retrieve(id, headers)
    .then(({ order }) => order)
    .catch((error) => medusaError(error));
});

export const cancelOrder = async (id: string) => {
  const headers = getMedusaHeaders(['order']);

  return medusaClientAdmin.admin.orders
    .cancel(id, headers)
    .then(({ order }) => order)
    .catch((error) => medusaError(error));
};
