import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { CarouselSlide } from '@/lib/mantine';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Carousel } from '@mantine/carousel';
import type { Route } from 'next';
import Link from 'next/link';

interface Props {
  items: {
    id: number;
    directus_files_id: DirectusFile;
  }[];
}

export default function BannersWideSection({ items }: Props) {
  return (
    <section className="my-10 lg:my-12">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <Carousel
          loop
          align="center"
          containScroll="trimSnaps"
          controlSize={28}
          controlsOffset={0}
          slideSize={{ base: '88%', xs: '92%' }}
          styles={{ controls: { marginInline: -12 } }}
        >
          {items.map((item) => (
            <CarouselSlide key={item.id}>
              <Link
                className="group block px-2 lg:px-4"
                href={(item.directus_files_id.description as Route) || '#'}
                prefetch={false}
              >
                <div className="aspect-[16/6] relative">
                  <Image
                    fill
                    alt={item.directus_files_id.title}
                    className="object-center object-contain transition group-hover:scale-[103%]"
                    fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                    src={getDirectusFile(item.directus_files_id)}
                  />
                </div>
              </Link>
            </CarouselSlide>
          ))}
        </Carousel>
      </MotionDiv>
    </section>
  );
}
