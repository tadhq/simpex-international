import { SALES_CHANNEL_ID } from '@/config/env';
import { medusaClient } from '@/config/medusa';
import { directusApi } from '@/lib/directus';
import { filteredCategories } from '../product-category/utils';

export async function getProductCategories({ locale }: { locale: string }) {
  // HACK this depends on Directus for translations
  const categoriesTranslations = await directusApi.getProductCategories({ locale });

  return medusaClient.productCategories
    .list({ expand: 'category_children', limit: 999999 })
    .then(({ product_categories }) => {
      const categories = directusApi.applyProductCategoriesTranslations<typeof product_categories>(
        product_categories,
        categoriesTranslations as any
      );
      return filteredCategories({
        categories,
        salesChannelId: SALES_CHANNEL_ID,
      });
    })
    .catch((reason) => {
      throw reason;
    });
}
