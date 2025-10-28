import type { Cart } from '@medusajs/medusa';

import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

export function getCheckoutStep(
  cart: Omit<Cart, 'beforeInsert' | 'beforeUpdate' | 'afterUpdateOrLoad'>
) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return 'address';
  } else if (cart?.shipping_methods.length === 0) {
    return 'delivery';
  } else {
    return 'payment';
  }
}

export function compareAddresses(address1: any, address2: any) {
  return isEqual(
    omit(address1, ['id', 'created_at', 'updated_at', 'deleted_at', 'metadata', 'customer_id']),
    omit(address2, ['id', 'created_at', 'updated_at', 'deleted_at', 'metadata', 'customer_id'])
  );
}
