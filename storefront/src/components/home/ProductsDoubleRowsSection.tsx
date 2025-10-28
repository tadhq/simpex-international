import { getShopSettings } from '@/lib/directus/api';
import { DirectusFile } from '@/lib/directus/types';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import ProductsCarousel from './ProductsCarousel';

interface Props {
  id: number;
  heading: string;
}

export default async function ProductsDoubleRowsSection({ heading, id }: Props) {
  const shopSettings = await getShopSettings();
  return (
    <section className="my-12 lg:my-16">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <header className="flex lg:justify-between flex-col lg:flex-row gap-4 mb-6 lg:items-center">
          <h2 className="text-2xl font-extrabold text-primary-800">{heading}</h2>
        </header>
        <div className="flex flex-col gap-4">
          <ProductsCarousel
            // carouselProps={{ classNames: { controls: '-mx-3' } }}
            emptyStateImage={shopSettings?.image_empty_state as DirectusFile}
            limit={10}
            pagination={{ current: 1 }}
          />
        </div>
      </MotionDiv>
    </section>
  );
}
