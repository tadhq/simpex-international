'use client';

import { ProductCard } from '@/components/product';
import EmptyState from '@/components/shop/EmptyState';
import { SALES_CHANNEL_ID } from '@/config/env';
import { DirectusFile } from '@/lib/directus/types';
import { useMedusaClient } from '@/lib/medusa/context';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Button, Skeleton } from '@mantine/core';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useList } from '@refinedev/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { Route } from 'next';
import Link from 'next/link';

interface Props {
  sectionId: number;
  categoryId: string;
  pagination: {
    current: number;
  };
  skeletonContainerProps?: Record<string, any>;
  emptyStateImage?: DirectusFile;
  hideEmptyState?: boolean;
}

export default function ProductsGrid({
  categoryId,
  sectionId,
  pagination,
  skeletonContainerProps,
  emptyStateImage,
  hideEmptyState,
}: Props) {
  const { currency } = useMedusaClient();

  const pageSize = sectionId === 4 ? 4 : 8;

  const productsQuery = useList<PricedProduct>({
    resource: 'products',
    filters: [
      { field: 'category_id', operator: 'eq', value: [categoryId] },
      { field: 'currency_code', operator: 'eq', value: currency },
      { field: 'expand', operator: 'eq', value: 'categories,images,variants,variants.prices' },
      { field: 'sales_channel_id', operator: 'eq', value: [SALES_CHANNEL_ID] },
    ],
    pagination: { pageSize, current: pagination.current }, // Limit to 8 products
  });

  if (productsQuery.isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2',
          skeletonContainerProps?.className
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <MotionDiv
            key={index}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <Skeleton className="w-full h-80 rounded-lg" />
          </MotionDiv>
        ))}
      </div>
    );
  }

  if (!hideEmptyState && !productsQuery.data?.data?.length) {
    return (
      <div className="flex flex-col">
        <EmptyState className="bg-primary-50 rounded-xl py-8" image={emptyStateImage} size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 xl:gap-x-16 xl:gap-y-16">
        {productsQuery.data?.data?.slice(0, 8).map((product, index) => (
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
        <Link href={`/shop/${categoryId}` as Route}>
          <Button
            className="rounded-full px-10 bg-gradient-to-r from-primary-500 to-[#02AAEA]"
            size="md"
          >
            See more
          </Button>
        </Link>
      </div>
    </div>
  );
}
