'use client';

import { ProductCard } from '@/components/product';
import EmptyState from '@/components/shop/EmptyState';
import { SALES_CHANNEL_ID } from '@/config/env';
import { DirectusFile } from '@/lib/directus/types';
import { useMedusaClient } from '@/lib/medusa/context';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Skeleton } from '@mantine/core';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useList } from '@refinedev/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { Route } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Props {
  pagination: {
    current: number;
  };
  skeletonContainerProps?: Record<string, any>;
  emptyStateImage?: DirectusFile;
  hideEmptyState?: boolean;
  limit?: number;
}

export default function ProductsGrid({
  pagination,
  skeletonContainerProps,
  emptyStateImage,
  hideEmptyState,
  limit,
}: Props) {
  const { currency } = useMedusaClient();

  const t = useTranslations('global');

  const productsQuery = useList<PricedProduct>({
    resource: 'products',
    filters: [
      { field: 'currency_code', operator: 'eq', value: currency },
      { field: 'expand', operator: 'eq', value: 'categories,images,variants,variants.prices' },
      { field: 'sales_channel_id', operator: 'eq', value: [SALES_CHANNEL_ID] },
    ],
    pagination: { pageSize: 1000, current: pagination.current }, // Fetch more products to filter and shuffle
  });

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const filteredProducts = productsQuery.data?.data
    ?.filter(
      (product) =>
        product.variants.some(
          (variant) => variant.inventory_quantity !== undefined && variant.inventory_quantity > 0
        ) &&
        product.categories &&
        product.categories.length > 0
    )
    ?.slice(0, 100); // Limit to 100 before shuffling

  const shuffledProducts = shuffleArray(filteredProducts || []).slice(0, limit);

  if (productsQuery.isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2',
          skeletonContainerProps?.className
        )}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <MotionDiv
            key={index}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <Skeleton className="w-full h-80 rounded-[20px]" />
          </MotionDiv>
        ))}
      </div>
    );
  }

  if (!hideEmptyState && !shuffledProducts?.length) {
    return (
      <div className="flex flex-col">
        <EmptyState className="bg-primary-50 rounded-xl py-8" image={emptyStateImage} size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 xl:gap-y-16">
        {shuffledProducts?.map((product, index) => (
          <MotionDiv
            key={product.id}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <ProductCard product={product} />
          </MotionDiv>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Link
          className="rounded-full px-10 py-2 bg-gradient-to-r from-primary-500 to-[#02AAEA] text-white font-bold"
          href={`/shop` as Route}
        >
          {t('buttons.seeMore')}
        </Link>
      </div>
    </div>
  );
}
