import { DIRECTUS_CACHE_BUSTER, DIRECTUS_URL } from '@/config/env';
import { createDirectusFileUtility } from '@tadsr/web-core/directus';
import type { DirectusFile } from './types';

export const getDirectusFile = createDirectusFileUtility<DirectusFile>(
  DIRECTUS_URL,
  DIRECTUS_CACHE_BUSTER
);
