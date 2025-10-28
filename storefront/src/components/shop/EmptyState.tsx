import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Image } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';

interface Props {
  image?: DirectusFile;
  title?: string;
  className?: string;
  size?: 'md' | 'sm';
}

export default function EmptyState({ image, title, className, size = 'md' }: Props) {
  const t = useTranslations('shop');
  const translatedTitle = title || t('emptyState');

  return (
    <div className={cn('grid place-items-center flex-1', className)}>
      <MotionDiv className="flex flex-col text-center items-center" {...fadeInUpEaseProps}>
        {image && (
          <Image
            alt="Empty state"
            className={cn({
              'max-w-40': size === 'md',
              'max-w-28': size === 'sm',
            })}
            src={getDirectusFile(image)}
          />
        )}
        {translatedTitle && (
          <p
            className={cn('text-xl mt-4 text-base-400 font-semibold', {
              'text-xl': size === 'md',
              'text-lg': size === 'sm',
            })}
          >
            {translatedTitle}
          </p>
        )}
      </MotionDiv>
    </div>
  );
}
