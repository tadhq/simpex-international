'use client';

import EmptyState from '@/components/shop/EmptyState';
import { SALES_CHANNEL_ID } from '@/config/env';
import { DirectusFile } from '@/lib/directus/types';
import { useMedusaClient } from '@/lib/medusa/context';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Carousel } from '@mantine/carousel';
import { Skeleton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useList } from '@refinedev/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { Icon } from '../iconify';
import NewProductCard from './NewProductCard';

interface Props {
  carouselProps?: Record<string, any>;
  skeletonContainerProps?: Record<string, any>;
  emptyStateImage?: DirectusFile;
  hideEmptyState?: boolean;
  new_products?: { handle: string }[] | null;
}

export default function NewProductsCarousel({
  skeletonContainerProps,
  carouselProps,
  emptyStateImage,
  hideEmptyState,
  new_products,
}: Props) {
  const { currency } = useMedusaClient();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1366px)');

  const controlSize = isSmallScreen ? 35 : isTablet ? 45 : 50;
  const fontSize = isSmallScreen ? 24 : isTablet ? 28 : 32;
  const slideSize = isSmallScreen ? 170 : isTablet ? 220 : 240;
  const slideGap = isSmallScreen ? 'xs' : isTablet ? 'md' : 'md';
  const marginInline = isSmallScreen ? -10 : isTablet ? -15 : -60;

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

  // Filter only products by handle which are given in CMS
  const filteredProducts = productsQuery.data?.data?.filter((product) =>
    new_products?.some((p) => p.handle === product.handle)
  );

  if (productsQuery.isLoading) {
    // TODO add better skeletons
    return (
      <div className={cn('flex gap-2 md:gap-6 overflow-hidden', skeletonContainerProps?.className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <MotionDiv
            key={index}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <Skeleton className="flex-[0_0_auto] w-[160px] h-[280px] md:w-[220px] md:h-[330px] rounded-[20px]" />
          </MotionDiv>
        ))}
      </div>
    );
  }

  if (!hideEmptyState && !productsQuery.data?.data?.length) {
    return (
      <EmptyState className="bg-primary-50 rounded-xl py-10" image={emptyStateImage} size="sm" />
    );
  }

  return (
    <Carousel
      dragFree
      align="start"
      containScroll="trimSnaps"
      controlSize={controlSize}
      controlsOffset={0}
      nextControlIcon={<Icon fontSize={fontSize} icon="octicon:chevron-right-12" />}
      previousControlIcon={<Icon fontSize={fontSize} icon="octicon:chevron-left-12" />}
      slideGap={slideGap}
      slideSize={slideSize}
      styles={{
        slide: { maxWidth: slideSize },
        controls: { marginInline },
        control: {
          width: controlSize,
          height: controlSize,
          opacity: 1,
          visibility: 'visible',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
        },
      }}
      {...carouselProps}
    >
      {filteredProducts?.map((product, index) => (
        <Carousel.Slide key={product.id}>
          <MotionDiv
            className="h-full"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <NewProductCard product={product} />
          </MotionDiv>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
