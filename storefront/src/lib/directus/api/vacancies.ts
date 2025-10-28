import { directusClient } from '@/config/directus';
import { readItem, readItems } from '@directus/sdk';
import { DirectusSchema } from '../types';
import { deepTranslationFilter } from './utils';

export function getAllVacancies({ locale }: { locale: string }) {
  return directusClient.request(
    readItems('vacancies', {
      deep: {
        ...deepTranslationFilter({ locale }),
      },
      fields: ['*.*.*'],
      filter: {
        status: { _eq: 'published' },
      },
      sort: '-created_at',
    })
  );
}

export function getVacancy({ id, locale }: { id: string; locale: string }) {
  return directusClient
    .request(
      readItem('vacancies', id, {
        deep: {
          ...deepTranslationFilter({ locale }),
        },
        fields: ['*.*.*'],
      })
    )
    .then((response) => response as unknown as DirectusSchema['vacancies'])
    .catch((reason) => {
      throw reason;
    });
}
