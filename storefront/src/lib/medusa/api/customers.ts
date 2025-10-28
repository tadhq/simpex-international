import { SALES_CHANNEL_ID } from '@/config/env';
import { medusaClient, medusaClientAdmin } from '@/config/medusa';
import type {
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
  StorePostCustomersResetPasswordReq,
} from '@medusajs/medusa';
import { cache } from 'react';
import { medusaError } from '../utils';
import { getMedusaHeaders } from './common';
import { cookies } from 'next/headers';

export async function getCustomer(accessToken?: string) {
  let headers = getMedusaHeaders(['customer']);

  if (accessToken) {
    headers = { authorization: `Bearer ${accessToken}` };
  }

  return medusaClient.customers
    .retrieve(headers)
    .then(({ customer }) => customer)
    .catch((reason) => {
      // Has to be null since it will throw error if customer is not logged in
      return null;
    });
}

export async function createCustomer(data: StorePostCustomersReq) {
  return medusaClientAdmin.admin.customers
    .create(data)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function updateCustomer(data: StorePostCustomersCustomerReq) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers
    .update(data, headers)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function addShippingAddress(data: StorePostCustomersCustomerAddressesReq) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers.addresses
    .addAddress(data, headers)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function deleteShippingAddress(addressId: string) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers.addresses
    .deleteAddress(addressId, headers)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function updateShippingAddress(
  addressId: string,
  data: StorePostCustomersCustomerAddressesAddressReq
) {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers.addresses
    .updateAddress(addressId, data, headers)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export const listCustomerOrders = cache(async (limit: number = 10, offset: number = 0) => {
  const headers = getMedusaHeaders(['customer']);

  return medusaClient.customers
    .listOrders(
      {
        limit,
        offset,
        fields:
          'sales_channel_id,status,fulfillment_status,payment_status,display_id,cart_id,customer_id,email,region_id,currency_code',
      },
      headers
    )
    .then(({ orders }) => {
      if (orders?.length) {
        return orders.filter((order) => order.sales_channel_id === SALES_CHANNEL_ID);
      }
      return [];
    })
    .catch((error) => medusaError(error));
});

export async function attachCustomerGroup(groupId: string, customerId: string) {
  return medusaClientAdmin.admin.customerGroups
    .addCustomers(groupId, {
      customer_ids: [{ id: customerId }],
    })
    .then(({ customer_group }) => customer_group)
    .catch((error) => medusaError(error));
}

export async function requestCustomerPasswordReset(email: string) {
  return medusaClient.customers
    .generatePasswordToken({ email })
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function resetCustomerPassword(data: StorePostCustomersResetPasswordReq) {
  return medusaClient.customers
    .resetPassword(data)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function toggleCustomerWishlist(productId: string) {
  const headers = getMedusaHeaders(['customer']);
  const accessToken = cookies().get('_medusa_jwt')?.value;

  if (!accessToken) {
    throw new Error('No access token');
  }

  const customer = await getCustomer(accessToken);
  if (!customer) {
    throw new Error('No customer found');
  }

  const oldWishList = Array.isArray(customer.metadata?.wish_list)
    ? customer.metadata?.wish_list
    : [];

  const itemExists = oldWishList.some((item) => item.item_id === productId);

  let newWishList;

  if (itemExists) {
    // Remove the item if it already exists
    newWishList = oldWishList.filter((item) => item.item_id !== productId);
  } else {
    // Add the item if it doesn't exist
    newWishList = [...oldWishList, { item_id: productId }];
  }

  // Update the wishlist
  await medusaClientAdmin.admin.customers.update(
    customer.id,
    { metadata: { wish_list: newWishList } },
    headers
  );
}
