import { ProductCategory } from '@medusajs/medusa';

export function filteredCategories({
  categories,
  salesChannelId,
}: {
  categories: ProductCategory[];
  salesChannelId: string;
}) {
  if (!categories) return [];

  if (!categories.length) return [];

  const filteredCategories = categories.filter(
    (item) => item.metadata?.sales_channel_id === salesChannelId
  );

  if (filteredCategories.length) return filteredCategories;

  return categories;
}
