import { medusaClient, medusaClientAdmin } from '@/config/medusa';
import { getMedusaHeaders } from './common';

export async function getDiscountDefault() {
  return medusaClientAdmin.admin.discounts
    .list({ q: 'DEFAULT_' })
    .then(({ discounts }) => discounts[0])
    .catch((reason) => {
      console.error(reason);
      return null;
    });
}

export async function deleteDiscount(cartId: string, code: string) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .deleteDiscount(cartId, code, headers)
    .then(({ cart }) => cart)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
}
