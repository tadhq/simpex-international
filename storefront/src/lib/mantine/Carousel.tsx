import { CarouselProps, Carousel as MantineCarousel } from '@mantine/carousel';
import Autoplay, { AutoplayOptionsType } from 'embla-carousel-autoplay';
import { useRef } from 'react';

interface Props extends CarouselProps {
  autoplay?: AutoplayOptionsType | null;
}

export default function Carousel({ autoplay: autoplayOptions, ...other }: Props) {
  const props = Object.assign(other, {
    plugins: [],
  });

  const autoplay = useRef(Autoplay(autoplayOptions ?? {}));
  if (autoplayOptions) {
    props.plugins.push(autoplay.current);
    props.onMouseEnter = autoplay.current.stop;
    props.onMouseLeave = autoplay.current.reset;
  }

  return <MantineCarousel {...props} />;
}
