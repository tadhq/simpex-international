import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import Marquee from 'react-fast-marquee';

interface Props extends React.ComponentProps<typeof Marquee> {
  images: DirectusFile[];
}

export default function BrandsCarousel({ images, ...props }: Props) {
  return (
    <Marquee
      autoFill
      gradient
      pauseOnHover
      gradientColor="#ffffff"
      gradientWidth={48}
      speed={30}
      {...props}
    >
      {images.map((image, index) => (
        <div key={image.id} className="p-4 lg:px-6 bg-base-100 rounded-lg mx-2">
          <div className="aspect-[16/6] relative w-36">
            <Image
              key={image.id}
              fill
              alt={image.title}
              className="object-contain object-center"
              fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
              src={getDirectusFile(image)}
            />
          </div>
        </div>
      ))}
    </Marquee>
  );
}
