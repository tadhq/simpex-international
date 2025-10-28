import { directusClient } from '@/config/directus';
import { createItem, readItems } from '@directus/sdk';
import { DirectusSchema } from '../types';
import { deepTranslationFilter } from './utils';

export function getFormBySlug({ slug, locale }: { slug: string; locale: string }) {
  return (
    directusClient
      .request(
        readItems('forms', {
          deep: {
            ...deepTranslationFilter({ locale }),
          },
          filter: { slug: { _eq: slug } },
        })
      )
      // @ts-ignore
      .then((response) => response?.[0])
      .catch((reason) => {
        throw reason;
      })
  );
}

export function mutateForm(collection: keyof DirectusSchema, data: any) {
  return directusClient.request(createItem(collection, data));
}
