import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import NewProductsCarousel from './NewProductsCarousel';

interface Props {
  heading: string | null;
  image: string | null;
  new_products?: { handle: string }[] | null;
}

export default function NewProductsSection({ heading, image, new_products }: Props) {
  return (
    <section>
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <h2 className="text-2xl font-extrabold text-primary-800 mb-6">{heading}</h2>

        {/* Wrapper for image and carousel */}
        <div className="relative flex flex-col justify-center md:flex-row gap-10 xl:gap-20 items-start">
          {/* Image Container */}
          <div className="relative md:w-[40%] w-full h-80 xl:h-[325px] rounded-[20px] overflow-hidden shadow">
            <Image
              fill
              alt="New Products Image"
              className="object-cover"
              fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
              src={getDirectusFile(image)}
            />

            {/* Overlay Carousel on small screens */}
            <div className="md:hidden absolute bottom-0 left-0 w-full md:bg-transparent md:relative pb-4 px-4 md:p-0">
              <NewProductsCarousel new_products={new_products} />
            </div>
          </div>

          {/* Carousel (Only shown beside on large screens) */}
          <div className="hidden md:block md:w-[60%]">
            <NewProductsCarousel new_products={new_products} />
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
