import { directusClient } from '@/config/directus';
import { createItem } from '@directus/sdk';

export function createNewsletterEntry({ email }: { email: string }) {
  return directusClient.request(createItem('newsletter_entries', { email }));
}
