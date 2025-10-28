import { directusClient } from '@/config/directus';
import { STORE_HANDLE } from '@/config/env';
import { readItems } from '@directus/sdk';
import { deepTranslationFilter } from './utils';

export function getPageBySlug({ slug, locale }: { slug: string; locale: string }) {
  return directusClient
    .request(
      readItems('pages', {
        deep: {
          ...deepTranslationFilter({ locale }),
        },
        fields: ['*.*.*.*.*.*'] as any,
        filter: {
          slug: { _contains: slug },
        },
      })
    )
    .then((response) => {
      // Fallback page will be from retail
      let page = response?.find((item) => item?.store === 'retail');
      const pageByStore = response?.find((item) => item?.store === STORE_HANDLE);

      if (pageByStore) page = pageByStore;

      return page;
    })
    .catch((reason) => {
      throw reason;
    });
}
