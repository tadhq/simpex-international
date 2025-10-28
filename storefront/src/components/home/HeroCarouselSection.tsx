import { DirectusSchema } from '@/lib/directus/types';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import CarouselClient from './CarouselHero';

export default function CarouselHeroSection({
  images,
  autoplay_options,
  carousel_options,
}: DirectusSchema['section_carousel_hero']) {
  return (
    <section className="mt-1 -mb-6 lg:my-6">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <CarouselClient
          autoplay_options={autoplay_options}
          carousel_options={carousel_options}
          images={images}
        />
      </MotionDiv>
    </section>
  );
}
