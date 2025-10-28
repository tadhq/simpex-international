'use client';

import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Icon } from '../iconify';

interface Props extends React.PropsWithChildren {
  className?: string;
}

export default function CategoriesCarousel({ children, className }: Props) {
  const isSmallScreen = useMediaQuery('(max-width: 767px)'); // Mobile (≤768px)
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1366px)'); // Tablet (769px - 1024px)

  const controlSize = isSmallScreen ? 35 : isTablet ? 45 : 50; // Adjust control size
  const fontSize = isSmallScreen ? 24 : isTablet ? 28 : 32; // Adjust icon size
  const slideSize = isSmallScreen ? 125 : isTablet ? 185 : 192; // Adjust slide size
  const slideGap = isSmallScreen ? 'xs' : isTablet ? 'md' : 'sm'; // Adjust gap
  const marginInline = isSmallScreen ? -10 : isTablet ? -15 : -60; // Adjust margins

  return (
    <Carousel
      dragFree
      withControls
      align="start"
      className={className}
      containScroll="trimSnaps"
      controlSize={controlSize}
      controlsOffset={0}
      nextControlIcon={<Icon fontSize={fontSize} icon="octicon:chevron-right-12" />}
      previousControlIcon={<Icon fontSize={fontSize} icon="octicon:chevron-left-12" />}
      slideGap={slideGap}
      slideSize={slideSize}
      styles={{
        controls: { marginInline },
        control: {
          width: controlSize,
          height: controlSize,
          opacity: 1,
          visibility: 'visible',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {children}
    </Carousel>
  );
}
