import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';

interface Props {
  id: number;
  image: DirectusFile;
}

export default function BigHeroSection({ image }: Props) {
  return (
    <section className="my-6">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="relative aspect-[16/6] lg:aspect-[16/3] overflow-hidden rounded-xl">
          {image && (
            <Image
              fill
              alt="Hero image"
              className="h-full w-full object-cover"
              src={getDirectusFile(image)}
            />
          )}
        </div>
      </MotionDiv>
    </section>
  );
}
