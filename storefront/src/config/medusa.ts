import { MEDUSA_ADMIN_API_TOKEN, MEDUSA_BACKEND_URL } from '@/config/env';
import Medusa from '@medusajs/medusa-js';

// HACK hardcoded default region
export const defaultRegion = {
  country_code: 'sr',
  tax_code: 'BTW',
  tax_rate: 10,
};

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

export const medusaClientAdmin = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  apiKey: MEDUSA_ADMIN_API_TOKEN,
});
