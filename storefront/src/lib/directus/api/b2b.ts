import { directusClient } from '@/config/directus';
import { readSingleton } from '@directus/sdk';
import { DirectusSchema } from '../types';

export function getB2BSettings() {
  return directusClient.request<DirectusSchema['settings_b2b']>(
    readSingleton('settings_b2b', {
      fields: ['*.*.*'] as any,
    })
  );
}
