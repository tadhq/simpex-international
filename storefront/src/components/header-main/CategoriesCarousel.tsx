import { medusaApi } from '@/lib/medusa/common';
import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';
import type { Route } from 'next';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function CategoriesCarousel() {
  const locale = await getLocale();
  const categories = await medusaApi.getProductCategories({ locale });

  return (
    <div className="container hidden md:block">
      <div className="h-10 overflow-x-auto">
        <div className="flex items-center gap-1">
          {categories?.map((category, index) => (
            <MotionDiv
              key={category.id}
              {...fadeInEaseProps}
              transition={{
                ...fadeInEaseProps.transition,
                delay: 0.02 * index,
              }}
            >
              <Link
                className="hover:bg-primary-50 active:bg-primary-100 whitespace-nowrap transition text-primary-800 px-3 py-1 rounded-lg text-sm"
                href={`/shop/${category.id}` as Route}
                prefetch={false}
              >
                {category.name}
              </Link>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
}
