'use server';

import { SALES_CHANNEL_IS_B2B } from '@/config/env';
import { defaultRegion } from '@/config/medusa';
import { getB2BSettings } from '@/lib/directus/api';
import {
  addShippingAddress,
  attachCustomerGroup,
  authenticate,
  checkCustomerEmailExists,
  createCustomer,
  deleteShippingAddress,
  getCustomer,
  getToken,
  requestCustomerPasswordReset,
  resetCustomerPassword,
  updateCustomer,
  updateShippingAddress,
} from '@/lib/medusa/api';
import {
  Customer,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from '@medusajs/medusa';
import { getTranslations } from 'next-intl/server';
import { revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(_currentState: unknown, formData: FormData) {
  const customer = {
    email: formData.get('email'),
    password: formData.get('password'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    phone: formData.get('phone'),
    metadata: {
      company: formData.get('company'),
    },
  } as StorePostCustomersReq;

  const customerGroupId = formData.get('customer_group');

  try {
    const newCustomer = await createCustomer(customer);
    // Attach customer to group
    if (customerGroupId && newCustomer) {
      await attachCustomerGroup(customerGroupId as string, newCustomer.id);
    }
    const token = await getToken({ email: customer.email, password: customer.password });
    if (!token) {
      revalidateTag('customer');
      setRegionCodeCookie();
      return;
    }

    const shouldReturnEarly = await handleCustomerCompany({ customer: newCustomer as Customer });
    if (shouldReturnEarly) {
      setRegionCodeCookie();
    }
  } catch (error: any) {
    return error.toString();
  }
}

export async function logCustomerIn(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const token = await getToken({ email, password });
    if (!token) {
      // setRegionCodeCookie();
      revalidateTag('customer');
      return;
    }

    const customer = await getCustomer(token);
    if (!customer) {
      // setRegionCodeCookie();
      revalidateTag('customer');
      return;
    }

    const shouldReturnEarly = await handleCustomerCompany({ customer: customer as Customer });
    if (shouldReturnEarly) {
      // setRegionCodeCookie();
    }
  } catch (error: any) {
    return error.toString();
  }
}

export async function sendResetPasswordEmail(_currentState: unknown, formData: FormData) {
  const t = await getTranslations();

  const email = formData.get('email') as string;
  try {
    const customerExists = await checkCustomerEmailExists(email);

    if (!customerExists) {
      return { success: false, error: t('validations.emailNotExist') };
    }
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }

  try {
    await requestCustomerPasswordReset(email);

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updatePassword(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const token = formData.get('token') as string;

  try {
    await resetCustomerPassword({ email, password, token });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerName(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerCompany(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    metadata: {
      company: formData.get('company') as string,
    },
  } as StorePostCustomersCustomerReq;

  try {
    const updatedCustomer = await updateCustomer(customer);
    if (!updatedCustomer) return { success: false, error: 'Failed to update customer' };

    await handleCustomerCompany({ customer: updatedCustomer as Customer });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerEmail(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    email: formData.get('email'),
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerPhone(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    phone: formData.get('phone'),
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerPassword(
  currentState: {
    customer: Omit<Customer, 'password_hash'>;
    success: boolean;
    error: string | null;
  },
  formData: FormData
) {
  const t = await getTranslations();

  const email = currentState.customer.email as string;
  const new_password = formData.get('new_password') as string;
  const old_password = formData.get('old_password') as string;
  const confirm_password = formData.get('confirm_password') as string;

  const isValid = await authenticate({ email, password: old_password })
    .then(() => true)
    .catch(() => false);

  if (!isValid) {
    return {
      customer: currentState.customer,
      success: false,
      error: t('validations.oldPasswordIncorrect'),
    };
  }

  if (new_password !== confirm_password) {
    return {
      customer: currentState.customer,
      success: false,
      error: t('validations.passwordsNotMatch'),
    };
  }

  try {
    await updateCustomer({ password: new_password }).then(() => {
      revalidateTag('customer');
    });

    return {
      customer: currentState.customer,
      success: true,
      error: null,
    };
  } catch (error: any) {
    return {
      customer: currentState.customer,
      success: false,
      error: error.toString(),
    };
  }
}

export async function addCustomerShippingAddress(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    address: {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      company: formData.get('company') as string,
      address_1: formData.get('address_1') as string,
      address_2: formData.get('address_2') as string,
      city: formData.get('city') as string,
      postal_code: formData.get('postal_code') as string,
      province: formData.get('province') as string,
      country_code: formData.get('country_code') as string,
      phone: formData.get('phone') as string,
    },
  } as StorePostCustomersCustomerAddressesReq;

  try {
    await addShippingAddress(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerShippingAddress(
  currentState: Record<string, unknown>,
  formData: FormData
) {
  const addressId = currentState.addressId as string;

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    company: formData.get('company') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
    phone: formData.get('phone') as string,
  } as StorePostCustomersCustomerAddressesAddressReq;

  try {
    await updateShippingAddress(addressId, address).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null, addressId };
  } catch (error: any) {
    return { success: false, error: error.toString(), addressId };
  }
}

export async function deleteCustomerShippingAddress(addressId: string) {
  try {
    await deleteShippingAddress(addressId).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function updateCustomerBillingAddress(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    billing_address: {
      first_name: formData.get('billing_address.first_name'),
      last_name: formData.get('billing_address.last_name'),
      company: formData.get('billing_address.company'),
      address_1: formData.get('billing_address.address_1'),
      address_2: formData.get('billing_address.address_2'),
      city: formData.get('billing_address.city'),
      postal_code: formData.get('billing_address.postal_code'),
      province: formData.get('billing_address.province'),
      country_code: formData.get('billing_address.country_code'),
      phone: formData.get('billing_address.phone'),
    },
  } as StorePostCustomersCustomerReq;

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag('customer');
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

export async function signOut() {
  cookies().set('_medusa_jwt', '', {
    maxAge: -1,
  });
  const nextUrl = headers().get('next-url');
  const countryCode = nextUrl?.split('/')[1] || '';
  revalidateTag('auth');
  revalidateTag('customer');
  if (nextUrl) {
    redirect(`/${countryCode}/account`);
  }
}

/**
 * @returns true if should return early
 */
async function handleCustomerCompany({ customer }: { customer: Customer }) {
  if (!SALES_CHANNEL_IS_B2B) return true;

  const customerCompany = customer?.metadata?.company;
  if (!customerCompany) return true;

  const b2bSettings = await getB2BSettings();
  const matchingCompany = b2bSettings.companies?.find(
    (company: { value: string; region_code: string }) => company.value === customerCompany
  );

  if (!matchingCompany) return true;

  setRegionCodeCookie(matchingCompany?.region_code);
  revalidateTag('customer');
}

function setRegionCodeCookie(regionCode?: string) {
  cookies().set('NEXT_REGION_CODE', regionCode || defaultRegion.country_code, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
}
