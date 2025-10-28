import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/lib/mantine';
import { medusaApi } from '@/lib/medusa/common';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Image } from '@mantine/core';
import { getLocale } from 'next-intl/server';
import ProductsCarousel from './ProductsCarousel';

interface Props {
  id: number;
  heading: string;
  categories: {
    category: string;
  }[];
  image?: DirectusFile;
}

export default async function ProductsTabs2Section({ heading, categories, image, id }: Props) {
  const locale = await getLocale();
  const allCategories = await medusaApi.getProductCategories({ locale });

  // FIXME sort by Directus
  const matchingCategories = allCategories.filter((category) =>
    categories?.some((item) => item.category === category.handle)
  );

  return (
    <section className="my-12 lg:my-16">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <Tabs defaultValue={matchingCategories?.[0]?.id} keepMounted={false} variant="pills">
          <header className="flex lg:justify-between flex-col lg:flex-row gap-4 mb-6 lg:items-center">
            <h2 className="text-xl font-bold text-primary-800">{heading}</h2>
            <TabsList>
              {matchingCategories.map((category) => (
                <TabsTab key={category.id} value={category.id}>
                  {category.name}
                </TabsTab>
              ))}
            </TabsList>
          </header>
          <div className="relative overflow-hidden py-4 lg:py-8 rounded-lg bg-gradient-to-r from-[#3279FF] bg-primary-700">
            <div className="absolute inset-0 hidden h-full lg:block w-1/4">
              <Image
                // TODO add fallback
                alt="Image"
                className="object-cover aspect-square object-center w-full h-full"
                src={getDirectusFile(image)}
              />
            </div>
            {matchingCategories.map((category) => (
              <TabsPanel key={category.id} value={category.id}>
                <ProductsCarousel
                  pagination={{ current: 1 }}
                  skeletonContainerProps={{ className: 'pl-4 lg:pl-[25%]' }}
                  // carouselProps={{ classNames: { container: 'ml-4 lg:ml-[25%]' } }}
                />
              </TabsPanel>
            ))}
          </div>
        </Tabs>
      </MotionDiv>
    </section>
  );
}
