'use client';

import { SALES_CHANNEL_ID } from '@/config/env';
import { DirectusFile } from '@/lib/directus/types';
import { useMedusaClient } from '@/lib/medusa/context';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { useTable } from '@refinedev/core';
import ShopFiltersProvider from '../shop-filters/ShopFiltersProvider';
import CategoriesList from './CategoriesList';
import ClearFiltersButton from './ClearFiltersButton';
import ProductsGrid from './ProductsGrid';

interface Props {
  emptyStateImage: DirectusFile;
  customerProp: any; // TODO: Define the type for customerProp
  price_list?: any;
}

export default function ShopAllTemplate({ emptyStateImage, customerProp, price_list }: Props) {
  const { currency } = useMedusaClient();

  const tableQuery = useTable({
    resource: 'products',
    filters: {
      permanent: [
        {
          field: 'currency_code',
          operator: 'eq',
          value: currency,
        },
        {
          field: 'expand',
          operator: 'eq',
          value: 'categories,images,variants,variants.prices',
        },
        {
          field: 'sales_channel_id',
          operator: 'eq',
          value: [SALES_CHANNEL_ID],
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
  });

  return (
    <section className="my-8">
      <div className="container flex gap-6">
        <aside className="w-60 sm:max-w-xs sm:sticky top-[80px] md:top-[136px] self-start hidden md:block">
          <MotionDiv
            className="p-4 lg:p-6 rounded-xl border"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.2,
            }}
          >
            <div className="flex items-center gap-2 mb-4 justify-between">
              <h2 className="text-lg font-bold text-primary-700">Filters</h2>
              <ClearFiltersButton className="hidden md:flex" size="xs" tableQuery={tableQuery} />
            </div>
            <CategoriesList tableQuery={tableQuery} />
          </MotionDiv>
        </aside>
        <ShopFiltersProvider tableQuery={tableQuery}>
          <ProductsGrid
            price_list={price_list}
            customer={customerProp}
            emptyStateImage={emptyStateImage}
            tableQuery={tableQuery}
          />
        </ShopFiltersProvider>
      </div>
    </section>
  );
}
