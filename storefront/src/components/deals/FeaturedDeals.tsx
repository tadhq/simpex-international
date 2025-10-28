'use client';

import { SALES_CHANNEL_ID } from '@/config/env';
import { useMedusaClient } from '@/lib/medusa/context';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Skeleton } from '@mantine/core';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useList } from '@refinedev/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { ProductCard } from '../product';

interface Props {
  featured_deals?: { handle: string; deal_price?: number }[] | null;
}

export default function FeaturedDeals({ featured_deals }: Props) {
  const { currency } = useMedusaClient();
  const productsQuery = useList<PricedProduct>({
    resource: 'products',
    filters: [
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
    meta: { only_count: true },
    pagination: { pageSize: 5000, current: 1 },
  });

  const filteredProducts = productsQuery.data?.data?.filter((product) =>
    featured_deals?.some((f) => f.handle === product.handle)
  );
  const dealPrice = featured_deals?.map((deal) => deal.deal_price) || 0;

  if (productsQuery.isLoading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2')}>
        {Array.from({ length: 8 }).map((_, index) => (
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

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 xl:gap-x-16 xl:gap-y-16">
        {filteredProducts?.map((product, index) => {
          const matchingDeal = featured_deals?.find((f) => f.handle === product.handle);
          return (
            <MotionDiv
              key={product.id}
              {...fadeInUpEaseProps}
              transition={{
                ...fadeInUpEaseProps.transition,
                delay: 0.1 * index,
              }}
            >
              <ProductCard dealPrice={matchingDeal?.deal_price} product={product} />
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}
