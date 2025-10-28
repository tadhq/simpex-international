'use client';

import { SALES_CHANNEL_ID } from '@/config/env';
import { useMedusaClient } from '@/lib/medusa/context';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Carousel } from '@mantine/carousel';
import { Skeleton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useList } from '@refinedev/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import NewProductCard from '../home/NewProductCard';
import { Icon } from '../iconify';

interface Props {
  featured_deals?: { handle: string; deal_price?: number }[] | null;
}

export default function DealsProductCarousel({ featured_deals }: Props) {
  const { currency } = useMedusaClient();

  const isSmallScreen = useMediaQuery('(max-width: 767px)'); // Mobile (≤768px)
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1366px)'); // Tablet (769px - 1024px)

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

  if (productsQuery.isLoading) {
    // TODO add better skeletons
    return (
      <div className={cn('flex gap-4 overflow-hidden')}>
        {Array.from({ length: 8 }).map((_, index) => (
          <MotionDiv
            key={index}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <Skeleton className="flex-[0_0_auto]" height={315} width={205} />
          </MotionDiv>
        ))}
      </div>
    );
  }

  // if (!hideEmptyState && !productsQuery.data?.data?.length) {
  //   return <EmptyState image={emptyStateImage} />;
  // }

  const controlSize = isSmallScreen ? 35 : isTablet ? 45 : 50; // Adjust control size
  const fontSize = isSmallScreen ? 24 : isTablet ? 28 : 32; // Adjust icon size
  // const slideSize = isSmallScreen ? 125 : isTablet ? 185 : 220; // Adjust slide size
  // const slideGap = isSmallScreen ? 'xs' : isTablet ? 'md' : 'xl'; // Adjust gap
  const marginInline = isSmallScreen ? -10 : isTablet ? -15 : -80; // Adjust margins

  return (
    <>
      <h1 className="text-xl text-primary-800 font-bold mb-4">Take a look at our crazy deals</h1>
      <Carousel
        dragFree
        withControls
        align="start"
        containScroll="trimSnaps"
        controlSize={28}
        controlsOffset={0}
        nextControlIcon={<Icon fontSize={fontSize} icon="octicon:chevron-right-12" />}
        previousControlIcon={<Icon fontSize={fontSize} icon="octicon:chevron-left-12" />}
        slideGap="xl"
        slideSize={300}
        styles={{
          slide: { maxWidth: 300 },
          controls: { marginInline },
          control: {
            width: controlSize,
            height: controlSize,
            opacity: 1,
            visibility: 'visible',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
          },
        }}
        // {...carouselProps}
      >
        {filteredProducts?.map((product, index) => {
          const matchingDeal = featured_deals?.find((f) => f.handle === product.handle);
          return (
            <Carousel.Slide key={product.id}>
              <MotionDiv
                className="h-full"
                {...fadeInUpEaseProps}
                transition={{
                  ...fadeInUpEaseProps.transition,
                  delay: 0.1 * index,
                }}
              >
                <NewProductCard dealPrice={matchingDeal?.deal_price} product={product} />
              </MotionDiv>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </>
  );
}
