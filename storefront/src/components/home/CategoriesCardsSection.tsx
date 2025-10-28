import { medusaApi } from '@/lib/medusa/common';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { getLocale } from 'next-intl/server';
import { CategoriesCard } from './CategoriesCard';

interface Props {
  heading: string;
}

export default async function CategoriesCardsSection({ heading }: Props) {
  const locale = await getLocale();
  const categories = await medusaApi.getProductCategories({ locale });

  return (
    <section className="my-10 lg:my-12">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <h2 className="text-xl font-bold text-primary-800 mb-4">{heading}</h2>
        <CategoriesCard initialCategories={categories} />
      </MotionDiv>
    </section>
  );
}
