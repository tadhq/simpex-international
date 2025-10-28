'use client';

import { DirectusSchema } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { Carousel, CarouselSlide } from '@/lib/mantine';
import Image from '@/lib/mantine/Image';
import { useMediaQuery } from '@mantine/hooks';
import { cn } from '@tadsr/web-core/tailwindcss';
import Link from 'next/link';

export default function CarouselWithScaling({
  images,
  autoplay_options,
  carousel_options,
}: DirectusSchema['section_carousel_hero']) {
  const isSmallScreen = useMediaQuery('(max-width: 480px)');

  return (
    <Carousel
      loop
      align="start"
      autoplay={autoplay_options}
      containScroll="trimSnaps"
      controlSize={28}
      controlsOffset={0}
      slideGap={isSmallScreen ? 'xs' : '1rem'}
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      withControls={false}
      {...carousel_options}
      // onSlideChange={(index) => setActiveIndex(index)}
    >
      {images?.map((item, index) => {
        return (
          <CarouselSlide key={index}>
            <div
              className={cn(
                ' relative aspect-square overflow-hidden rounded-[20px] transition-transform duration-500',
                {
                  // 'scale-[0.7]': index !== activeIndex,
                  // 'origin-right': isLeftOfActive,
                  // 'origin-left': isRightOfActive,
                }
              )}
            >
              <HybridLink href={(item as any)?.directus_files_id.description}>
                <Image
                  fill
                  alt="Hero"
                  className="object-center object-cover"
                  fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                  src={
                    typeof item !== 'number' && item?.directus_files_id
                      ? getDirectusFile((item as any)?.directus_files_id)
                      : 'https://placehold.co/000000/FFFFFF/100x100?text=No+image'
                  }
                />
              </HybridLink>
            </div>
          </CarouselSlide>
        );
      })}
    </Carousel>
  );
}

function HybridLink({ href, children }: { href?: string | null; children: React.ReactNode }) {
  if (href) {
    return (
      <Link className="block rounded-2xl overflow-hidden" href={href} prefetch={false}>
        {children}
      </Link>
    );
  }
  return <div className="rounded-2xl overflow-hidden">{children}</div>;
}
