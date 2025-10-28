import { Tabs, TabsList, TabsPanel, TabsTab } from '@/lib/mantine';
import { medusaApi } from '@/lib/medusa/common';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { getLocale } from 'next-intl/server';
import ProductsCarousel from './ProductsCarousel';

interface Props {
  id: number;
  heading: string;
  categories: {
    category: string;
  }[];
}

export default async function ProductsTabsSection({ heading, categories, id }: Props) {
  const locale = await getLocale();
  const allCategories = await medusaApi.getProductCategories({ locale });

  // FIXME sort by Directus
  const matchingCategories = allCategories.filter((category) =>
    categories?.some((item) => item.category === category.handle)
  );

  return (
    <section className="my-12 lg:my-16">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <Tabs
          classNames={{ panel: 'space-y-4' }}
          defaultValue={matchingCategories?.[0]?.id}
          keepMounted={false}
          variant="pills"
        >
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
          {matchingCategories.map((category) => (
            <TabsPanel key={category.id} value={category.id}>
              <div className="flex flex-col gap-4">
                <ProductsCarousel
                  pagination={{ current: 1 }}
                  // carouselProps={{ classNames: { controls: '-mx-3' } }}
                />
                <ProductsCarousel pagination={{ current: 1 }} />
              </div>
            </TabsPanel>
          ))}
        </Tabs>
      </MotionDiv>
    </section>
  );
}
