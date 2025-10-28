import { cookies } from 'next/headers';

/**
 * Function for getting custom headers for Medusa API requests,
 * including the JWT token and cache revalidation tags.
 */
export function getMedusaHeaders(tags: string[] = []) {
  const headers: Record<string, any> = {
    next: {
      tags,
    },
  };

  const token = cookies().get('_medusa_jwt')?.value;

  if (token) headers.authorization = `Bearer ${token}`;

  return headers;
}
