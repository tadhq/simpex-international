import { medusaClient } from '@/config/medusa';
import type { StoreGetAuthEmailRes, StorePostAuthReq } from '@medusajs/medusa';
import { cookies } from 'next/headers';
import { medusaError } from '../utils';
import { getMedusaHeaders } from './common';

export async function authenticate(credentials: StorePostAuthReq) {
  const headers = getMedusaHeaders(['auth']);

  return medusaClient.auth
    .authenticate(credentials, headers)
    .then(({ customer }) => customer)
    .catch((error) => medusaError(error));
}

export async function getToken(credentials: StorePostAuthReq) {
  return medusaClient.auth
    .getToken(credentials, {
      next: {
        tags: ['auth'],
      },
    })
    .then(({ access_token }) => {
      if (access_token) {
        cookies().set('_medusa_jwt', access_token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });
      }
      return access_token;
    })
    .catch((error) => {
      throw new Error('Wrong email or password.');
    });
}

export async function checkCustomerEmailExists(email: string) {
  return medusaClient.auth
    .exists(email)
    .then((response: StoreGetAuthEmailRes) => response?.exists)
    .catch((error) => medusaError(error));
}
