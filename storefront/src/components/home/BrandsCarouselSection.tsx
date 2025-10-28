import { DirectusFile } from '@/lib/directus/types';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import _chunk from 'lodash/chunk';
import BrandsCarousel from './BrandsCarousel';

interface Props {
  heading: string;
  images: {
    id: number;
    directus_files_id: DirectusFile;
  }[];
}

export default function BrandsCarouselSection({ heading, images }: Props) {
  const brands = images.map((image) => image.directus_files_id);

  if (!brands.length) return null;

  const [chunk1, chunk2] = _chunk(brands, Math.round(brands.length / 2));

  return (
    <section className="my-12 lg:my-16">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <header className="flex lg:justify-between flex-col lg:flex-row gap-4 mb-6 lg:items-center">
          <h2 className="text-xl font-bold text-primary-800">{heading}</h2>
        </header>
        <div className="space-y-4">
          {chunk1.length && <BrandsCarousel direction="left" images={chunk1} />}
          {chunk2.length && <BrandsCarousel direction="right" images={chunk2} />}
        </div>
      </MotionDiv>
    </section>
  );
}
