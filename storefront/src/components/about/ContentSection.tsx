import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Prose from '../careers/Prose';

interface Props {
  description: string;
}

export default function ContentSection({ description }: Props) {
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
            <span className="capitalize text-primary-600">{t('userManual')}</span>
          </span>
        </div>
        <Prose className="mt-3 xl:px-20">{description}</Prose>
      </MotionDiv>
    </section>
  );
}
