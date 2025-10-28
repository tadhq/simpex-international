'use client';

import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { Carousel } from '@mantine/carousel';

interface Props {
  images: string;
  picture: string;
}

export default function ImageGallery({ images, picture }: Props) {
  const url = `${picture}`;
  // TODO add thumbnails
  return (
    <Carousel containScroll="trimSnaps" controlSize={28} controlsOffset={0} slideGap="md">
      {/* {images.map((image, index) => { */}
      {/* return ( */}
      <Carousel.Slide>
        <div className="relative aspect-[4/3]">
          <Image
            fill
            alt={`Product image`}
            className="object-center object-contain rounded-lg"
            fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
            src={url}
          />
        </div>
      </Carousel.Slide>
      {/* ); */}
      {/* })} */}
    </Carousel>
  );
}
