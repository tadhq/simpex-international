import { directusClient } from '@/config/directus';
import { readItems } from '@directus/sdk';
import { deepTranslationFilter } from './utils';

export function getFaqs({ locale }: { locale: string }) {
  return directusClient.request(
    readItems('faqs', {
      deep: {
        ...deepTranslationFilter({ locale }),
        topic: { translations: { _filter: { language_code: { _eq: locale } } } },
      },
      fields: ['*.*.*'] as any,
    })
  );
}
