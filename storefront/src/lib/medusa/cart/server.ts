'use server';

import { SALES_CHANNEL_ID, SALES_CHANNEL_IS_B2B } from '@/config/env';
import { defaultRegion } from '@/config/medusa';
import type { Cart, LineItem } from '@medusajs/medusa';
import omit from 'lodash/omit';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {
  addItem,
  createCart,
  deleteDiscount,
  getCart,
  getDiscountDefault,
  getProductsById,
  removeItem,
  updateCart,
  updateCartDiscount,
  updateItem,
} from '../api';
import { getRegion } from '../server';
import { CartWithCheckoutStep } from '../types';
import { getCheckoutStep } from '../utils';

/**
 * Retrieves the cart based on the cartId cookie
 */
export async function getOrSetCart() {
  let { cart, region } = await getCartWithRegion();

  if (!region) return null;

  if (!cart) {
    const newCart = await createCart({
      region_id: region.id,
      sales_channel_id: SALES_CHANNEL_ID,
    });

    if (newCart) {
      cookies().set('_medusa_cart_id', newCart.id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      revalidateTag('cart');
      return newCart;
    }
  }

  return cart;
}

export async function retrieveCart() {
  let { cart } = await getCartWithRegion();

  if (!cart) return null;

  try {
    await applyDiscountOnCart(cart);
    revalidateTag('cart');
    return cart;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
}

export async function fetchCart({ currency }: { currency?: string }) {
  const cart = await retrieveCart();

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, { currency });
    cart.items = enrichedItems as LineItem[];
  }

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return {
    ...cart,
    totalItems,
  };
}

export async function fetchCartWithCheckoutStep({ currency }: { currency?: string }) {
  let { cart } = await getCartWithRegion();

  if (!cart) return null;

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, { currency });
    cart.items = enrichedItems as LineItem[];
  }

  // @ts-ignore
  cart.checkout_step = getCheckoutStep(cart);

  return cart as CartWithCheckoutStep;
}

export async function addToCart({
  variantId,
  quantity,
  dealPrice,
}: {
  variantId: string;
  quantity: number;
  dealPrice?: number;
}) {
  const cart = await getOrSetCart();

  if (!cart) throw Error('Missing cart ID');

  if (!variantId) throw Error('Missing product variant ID');

  try {
    await addItem({ cartId: cart.id, variantId, quantity, dealPrice });
    revalidateTag('cart');
  } catch (error: any) {
    console.error(error.message);
    throw Error('Error adding item to cart');
  }
}

export async function enrichLineItems(
  lineItems: LineItem[],
  context?: { currency?: string }
): Promise<Omit<LineItem, 'beforeInsert' | 'beforeUpdate' | 'afterUpdateOrLoad'>[] | undefined> {
  const ids = lineItems.map((lineItem) => lineItem.variant.product_id);

  // Fetch products by their IDs
  const products = await getProductsById(ids, context);

  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return [];
  }

  // Enrich line items with product and variant information
  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p) => p.id === item.variant.product_id);
    const variant = product?.variants.find((v) => v.id === item.variant_id);

    // If product or variant is not found, return the original item
    if (!product || !variant) return item;

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, 'variants'),
      },
    };
  }) as LineItem[];

  return enrichedItems;
}

export async function updateLineItem({ lineId, quantity }: { lineId: string; quantity: number }) {
  const cartId = cookies().get('_medusa_cart_id')?.value;

  // TODO refactor
  if (!cartId) {
    return 'Missing cart ID';
  }

  if (!lineId) {
    return 'Missing lineItem ID';
  }

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await updateItem({ cartId, lineId, quantity });
    revalidateTag('cart');
  } catch (e: any) {
    return e.toString();
  }
}

export async function removeLineItem(lineId: string) {
  const cartId = cookies().get('_medusa_cart_id')?.value;

  if (!cartId) throw Error('Missing cart ID');

  if (!lineId) throw Error('Missing lineItem ID');

  try {
    await removeItem({ cartId, lineId });
    revalidateTag('cart');
  } catch (error: any) {
    console.error(error.message);
    throw Error('Error removing line item');
  }
}

export async function removeLineItems() {
  const cartId = cookies().get('_medusa_cart_id')?.value;

  if (!cartId) throw Error('Missing cart ID');

  const cart = await getCart(cartId);

  if (!cart) throw Error('Missing cart');

  if (!cart.items.length) return;

  try {
    await Promise.all(cart.items.map((item) => removeLineItem(item.id)));
    revalidateTag('cart');
  } catch (error: any) {
    console.error(error.message);
    throw Error('Error removing line items');
  }
}

async function applyDiscountOnCart(
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null
) {
  // Apply when B2B
  if (!SALES_CHANNEL_IS_B2B) return;

  if (!cart) return;

  const discount = await getDiscountDefault();
  if (!discount) return;

  // Check if discount is already applied
  const existingDiscounts = cart.discounts.filter((d) => d.code === discount.code);

  const loggedIn = cookies().get('_medusa_jwt')?.value;

  // Apply when customer is logged in and discount is not applied
  if (loggedIn && !existingDiscounts.length) {
    return updateCartDiscount(cart.id, discount.code);
  }

  // Remove discount when customer is logged out
  if (!loggedIn && existingDiscounts.length) {
    return deleteDiscount(cart.id, discount.code);
  }
}

async function getCartWithRegion() {
  const cartId = cookies().get('_medusa_cart_id')?.value;
  let cart = null;

  if (cartId) {
    cart = await getCart(cartId);
  }

  const regionCode = cookies().get('NEXT_REGION_CODE')?.value || defaultRegion.country_code;
  const region = await getRegion(regionCode);

  if (!region) return { cart, region: null };

  // If cart exists and region_id differs, update the cart
  if (cart && cart.region_id !== region.id) {
    cart = await updateCart(cart.id, { region_id: region.id });
    revalidateTag('cart');
  }

  return { cart, region };
}

export { getCartWithRegion };
