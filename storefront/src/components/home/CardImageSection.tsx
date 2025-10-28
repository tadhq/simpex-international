import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';

interface Props {
  custom_css: string | null;
  cards: {
    item: {
      id: number;
      title: string | null;
      image: string | null;
    };
  }[];
}

export default function CardImageSection({ cards, custom_css }: Props) {
  // const limitedCards = cards.slice(0, 3);

  return (
    <section className="my-14 lg:my-20">
      <style type="text/css">{custom_css || ''}</style>
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ item }) => (
            <div
              key={item.id}
              className="aspect-video relative group cursor-pointer overflow-hidden rounded-[20px]"
            >
              <Image
                fill
                alt={item.title || 'Card Image'}
                className="object-cover shadow transform transition-transform duration-300 group-hover:scale-105"
                fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                src={getDirectusFile(item.image)}
              />
              {/* <div className="absolute inset-0 flex items-center bg-black/20 rounded-lg"></div> */}
            </div>
          ))}
        </div>
        {/* <div className="hidden lg:visible lg:grid lg:grid-cols-3 lg:gap-6">
          {limitedCards.map(({ item }) => (
            <div
              key={item.id}
              className="aspect-video relative group cursor-pointer overflow-hidden rounded-lg"
            >
              <Image
                fill
                alt={item.title || 'Card Image'}
                className="object-cover shadow transform transition-transform duration-300 group-hover:scale-105"
                fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                src={getDirectusFile(item.image)}
              />
              <div className="absolute inset-0 flex items-center bg-black/20 rounded-lg">
                <p className="text-white text-md md:text-3xl font-semibold ml-4 max-w-[16rem] break-words">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </MotionDiv>
    </section>
  );
}
