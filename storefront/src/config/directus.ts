import { DIRECTUS_TOKEN, DIRECTUS_URL } from '@/config/env';
import { DirectusSchema } from '@/lib/directus/types';
import { createDirectus, rest, staticToken } from '@directus/sdk';

export const directusClient = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());
