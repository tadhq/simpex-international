import { getDirectusFile } from '@/lib/directus/utils';
import { CarouselSlide } from '@/lib/mantine';
import Image from '@/lib/mantine/Image';
import { medusaApi } from '@/lib/medusa/common';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { ProductCategory } from '@medusajs/medusa';
import type { Route } from 'next';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import CategoriesCarousel from './CategoriesCarousel';

interface Props {
  heading: string;
  style: string;
}

export default async function CategoriesCarouselSection({ heading, style }: Props) {
  const locale = await getLocale();
  const categories = await medusaApi.getProductCategories({ locale });

  return (
    <section className="mt-10 mb-4 lg:my-12">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <h2 className="text-xl font-bold text-primary-800 mb-4 hidden">{heading || null}</h2>
        {style === 'wide' ? (
          <CardsWide categories={categories} />
        ) : (
          <CardsDefault categories={categories} />
        )}
      </MotionDiv>
    </section>
  );
}

function CardsDefault({ categories }: { categories: ProductCategory[] }) {
  return (
    <div className="rounded-xl">
      <CategoriesCarousel>
        {categories?.map((category, index) => (
          <CarouselSlide key={category.id}>
            <MotionDiv
              {...fadeInUpEaseProps}
              transition={{
                ...fadeInUpEaseProps.transition,
                delay: 0.1 * index,
              }}
            >
              <Link className="group" href={`/shop/${category.id}` as Route} prefetch={false}>
                <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                  <div className="relative mt-6 flex justify-center items-center py-2 md:py-4">
                    <div
                      className="absolute w-24 h-24 md:w-[170px] md:h-[170px] rounded-full -z-10"
                      style={{
                        background: 'radial-gradient(circle, #02AAEA 10%, #32519F 80%)',
                      }}
                    ></div>
                    <div className="relative aspect-[16/10] w-16 h-16 md:w-28 md:h-28">
                      <Image
                        fill
                        alt="Category image"
                        className="object-center "
                        fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                        fit="contain"
                        src={getDirectusFile((category as any).thumbnail)}
                      />
                    </div>
                  </div>
                </MotionDiv>
                <div className="[perspective:100px] relative p-2 flex flex-col justify-end items-center mt-4">
                  <p className="font-semibold text-sm lg:text-base relative leading-snug text-center text-primary-800">
                    {category.name}
                  </p>
                </div>
              </Link>
            </MotionDiv>
          </CarouselSlide>
        ))}
      </CategoriesCarousel>
    </div>
  );
}

function CardsWide({ categories }: { categories: ProductCategory[] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-5">
      {categories?.map((category, index) => (
        <MotionDiv
          key={category.id}
          {...fadeInUpEaseProps}
          // style={{ background: 'radial-gradient(circle at center, #02AAEA 10%, #32519F 80%)' }}
          transition={{
            ...fadeInUpEaseProps.transition,
            delay: 0.1 * index,
          }}
        >
          <Link
            className="flex-1 flex items-center w-full p-4 group"
            href={`/shop/${category.id}` as Route}
            prefetch={false}
          >
            <div className="flex-grow">
              <p className="text-lg font-bold text-white">{category.name}</p>
            </div>
            <div
              className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full -z-10"
              style={{
                background: 'radial-gradient(circle, #02AAEA 10%, #32519F 80%)',
              }}
            ></div>
            <Image
              alt="Category image"
              className="transition-transform transform group-hover:scale-105"
              fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
              fit="contain"
              src={getDirectusFile((category as any).thumbnail)}
            />
          </Link>
        </MotionDiv>
      ))}
    </div>
  );
}
