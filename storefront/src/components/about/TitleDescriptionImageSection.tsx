import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  image: DirectusFile;
}

export default function TitleDescriptionImageSection({ title, description, image }: Props) {
  const t = useTranslations('global.pages');

  return (
    <section className="py-10">
      <MotionDiv className="container mx-auto" {...fadeInUpEaseProps}>
        <div className="text-neutral-600">
          <span className="flex items-center">
            <Link className="pr-1" href="/">
              {t('home')}
            </Link>
            <span className="pr-1 pl-1.5">/</span>{' '}
            <span className="capitalize text-primary-600">{t('aboutUs')}</span>
          </span>
        </div>
        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
          <p className="mt-4 max-w-5xl mx-auto md:text-lg text-gray-700">{description}</p>
        </div>
        <div className="flex justify-center mt-8 mb-6">
          <div className="relative w-full md:w-[80%] aspect-[16/8] rounded-xl bg-white shadow-lg overflow-hidden">
            {image ? (
              <Image fill alt="Hero image" className="object-cover" src={getDirectusFile(image)} />
            ) : (
              <Image
                fill
                alt="Fallback image"
                className="object-contain"
                src={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
              />
            )}
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
