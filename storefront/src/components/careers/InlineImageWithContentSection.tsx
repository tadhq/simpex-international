import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Button } from '@mantine/core';
import Link from 'next/link';
import Prose from './Prose';

interface ButtonProps {
  text: string;
  url: string;
  color: string;
  className: string;
}

interface Props {
  buttons: ButtonProps[];
  content: string;
  image: DirectusFile;
  image2: DirectusFile;
  image_direction: string;
  title: string;
  subtitle?: string;
  style: React.CSSProperties;
}

export default function InlineImageWithContentBlock({
  buttons,
  content,
  image,
  image2,
  image_direction,
  title,
  subtitle,
  style,
}: Props) {
  return (
    <section style={style}>
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="grid items-center gap-x-8 xl:px-36 px-4 sm:grid-cols-2 xl:gap-x-12 md:mb-36">
          {image && (
            <ContentImage image={image?.id} image2={image2?.id} imageDirection={image_direction} />
          )}
          <ContentBody buttons={buttons} description={content} subtitle={subtitle} title={title} />
        </div>
      </MotionDiv>
    </section>
  );
}

interface ContentImageProps {
  imageDirection: string;
  image: any;
  image2: any;
}

function ContentImage({ imageDirection = 'left', image, image2 }: ContentImageProps) {
  const className = {
    left: 'order-1',
    right: 'sm:order-2',
  }[imageDirection];

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden rounded-[20px]">
        <Image
          fill
          alt="Main Image"
          className="h-full w-full object-cover"
          src={getDirectusFile(image)}
        />
      </div>

      {/* Overlayed Small Image */}
      <div className="absolute -bottom-8 md:-bottom-20 -left-4 md:-left-10 w-1/3 md:w-2/5 aspect-square rounded-[20px] shadow-lg overflow-hidden">
        <Image
          fill
          alt="Overlay Image"
          className="object-cover"
          src={getDirectusFile(image2)} // Replace with actual image ID
        />
      </div>
    </div>
  );
}

interface ContentBodyProps {
  buttons: ButtonProps[];
  title: string;
  subtitle?: string;
  description: string;
}

function ContentBody({ buttons, title, subtitle, description }: ContentBodyProps) {
  return (
    <div className="order-1 flex max-w-md flex-col justify-center mt-10 md:mt-0">
      {subtitle && <h3 className="font-medium uppercase text-primary-500">{subtitle}</h3>}
      {title && <h2 className="mt-3 text-2xl font-bold">{title}</h2>}
      {description && <Prose className="mt-3">{description}</Prose>}
      {buttons?.length > 0 &&
        buttons?.map(({ text, url, color, className }, i) => (
          <Button
            key={i}
            className={className}
            color={color}
            component={Link}
            href={url}
            prefetch={false}
          >
            {text}
          </Button>
        ))}
    </div>
  );
}
