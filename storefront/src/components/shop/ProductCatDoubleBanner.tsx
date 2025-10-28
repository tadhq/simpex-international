import { getProductCategories } from '@/lib/directus/api';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface ProductDoubleBannerProps {
  selectedCategoryId: string;
}

export default function ProductDoubleBanner({ selectedCategoryId }: ProductDoubleBannerProps) {
  const [prod, setProd] = useState<any>(null);
  const locale = useLocale();
  const autoplay = useRef(Autoplay({ delay: 4000 }));

  // Fetch categories based on locale
  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const data = await getProductCategories({ locale });
        setProd(data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    }

    fetchProductCategories();
  }, [locale]);

  // Filter categories by selectedCategoryId
  const categoriesWithBanners = prod?.filter((category: any) => category.id === selectedCategoryId);

  return (
    <div className="flex gap-4 mb-6 -mt-6 md:mt-0">
      {/* Large screen banners */}
      {categoriesWithBanners?.map((category: any, index: number) => {
        if (!category.double_banner?.length) {
          return (
            <div
              key={`no-banner-${index}`}
              className="hidden lg:block relative aspect-[16/4] overflow-hidden rounded-[20px] flex-1"
            >
              <Image
                fill
                alt="No banners available"
                className="h-full w-full object-cover"
                src="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
              />
            </div>
          );
        }

        return category.double_banner.slice(0, 2).map((banner: any, bannerIndex: number) => {
          const imageUrl = getDirectusFile(banner.directus_files_id?.id);

          return (
            <div
              key={`${index}-${bannerIndex}`}
              className="hidden lg:block relative aspect-[16/4] overflow-hidden rounded-[20px] flex-1"
            >
              <Image
                fill
                alt={category.name || `Banner ${bannerIndex + 1}`}
                className="h-full w-full object-cover"
                src={imageUrl}
              />
            </div>
          );
        });
      })}

      {/* Mobile carousel */}
      <div className="block lg:hidden w-full -mb-8">
        <Carousel
          loop
          withIndicators
          containScroll="trimSnaps"
          height={200}
          orientation="vertical"
          plugins={[autoplay.current]}
          withControls={false}
        >
          {categoriesWithBanners?.map((category: any) => {
            if (!category.double_banner?.length) {
              return (
                <Carousel.Slide key={`no-banner-${category.id}`} className="mb-2">
                  <div className="relative aspect-[16/6] overflow-hidden">
                    <Image
                      fill
                      alt="No banners available"
                      className="h-full w-full object-cover rounded-xl"
                      src={'https://placehold.co/000000/FFFFFF/100x100?text=No+image'}
                    />
                  </div>
                </Carousel.Slide>
              );
            }

            return category.double_banner.slice(0, 2).map((banner: any, bannerIndex: number) => {
              const imageUrl = getDirectusFile(banner.directus_files_id?.id);

              return (
                <Carousel.Slide key={`${category.id}-${bannerIndex}`} className="mb-2">
                  <div className="relative aspect-[16/6] overflow-hidden">
                    <Image
                      fill
                      alt={`Banner ${bannerIndex + 1}`}
                      className="h-full w-full object-cover rounded-xl"
                      src={imageUrl}
                    />
                  </div>
                </Carousel.Slide>
              );
            });
          })}
        </Carousel>
      </div>
    </div>
  );
}
