import { medusaClient } from '@/config/medusa';
import type { StorePostCartReq, StorePostCartsCartReq } from '@medusajs/medusa';
import { cache } from 'react';
import { medusaError } from '../utils';
import { getMedusaHeaders } from './common';

export const getCart = cache(async (cartId: string) => {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .retrieve(cartId, headers)
    .then(({ cart }) => cart)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
});

export async function createCart(data: StorePostCartReq) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .create(data, headers)
    .then(({ cart }) => cart)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
}

export async function updateCart(cartId: string, data: StorePostCartsCartReq) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .update(cartId, data, headers)
    .then(({ cart }) => cart)
    .catch((reason) => medusaError(reason));
}

export async function updateCartDiscount(cartId: string, code: string) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .update(cartId, { discounts: [{ code }] }, headers)
    .then(({ cart }) => cart)
    .catch((reason) => {
      // Silence the duplicate_error when Line_item_adjustment with discount_id, item_id already exists
    });
}

export async function addItem({
  cartId,
  variantId,
  quantity,
  dealPrice,
}: {
  cartId: string;
  variantId: string;
  quantity: number;
  dealPrice?: number;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts.lineItems
    .create(cartId, { variant_id: variantId, quantity }, headers)
    .then(({ cart }) => cart)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
}

export async function updateItem({
  cartId,
  lineId,
  quantity,
}: {
  cartId: string;
  lineId: string;
  quantity: number;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts.lineItems
    .update(cartId, lineId, { quantity }, headers)
    .then(({ cart }) => cart)
    .catch((error) => medusaError(error));
}

export async function removeItem({ cartId, lineId }: { cartId: string; lineId: string }) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts.lineItems
    .delete(cartId, lineId, headers)
    .then(({ cart }) => cart)
    .catch((reason) => {
      console.error(reason);
      return null;
    });
}

export async function addShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string;
  shippingMethodId: string;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .addShippingMethod(cartId, { option_id: shippingMethodId }, headers)
    .then(({ cart }) => cart)
    .catch((res) => {
      if (res?.response?.data?.type === 'not_allowed') throw new Error('not_allowed');
      return medusaError(res);
    });
}

export async function createPaymentSessions(cartId: string) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .createPaymentSessions(cartId, headers)
    .then(({ cart }) => cart)
    .catch((error) => {
      console.error(error.message);
      return null;
    });
}

export async function setPaymentSession({
  cartId,
  providerId,
}: {
  cartId: string;
  providerId: string;
}) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .setPaymentSession(cartId, { provider_id: providerId }, headers)
    .then(({ cart }) => cart)
    .catch((error) => medusaError(error));
}

export async function completeCart(cartId: string) {
  const headers = getMedusaHeaders(['cart']);

  return medusaClient.carts
    .complete(cartId, headers)
    .then((res) => res)
    .catch((error) => medusaError(error));
}
