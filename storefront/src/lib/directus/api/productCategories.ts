import { directusClient } from '@/config/directus';
import { readItems } from '@directus/sdk';
import { deepTranslationFilter } from './utils';

export function getProductCategories({ locale }: { locale: string }) {
  return directusClient.request(
    readItems('product_categories', {
      deep: {
        ...deepTranslationFilter({ locale }),
      },
      fields: ['*.*.*'] as any,
    })
  );
}

export function applyProductCategoriesTranslations<T>(
  source: Record<string, any>[],
  dest: Record<string, any>[]
): T {
  const translations = dest.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});

  const result = source.map((item) => {
    const meta = translations[item.id];
    if (meta) {
      return {
        ...item,
        // Override the name with the translation
        name: meta.translations?.[0]?.name,
        thumbnail: meta.thumbnail,
      };
    }
    return item;
  });

  return result as T;
}
