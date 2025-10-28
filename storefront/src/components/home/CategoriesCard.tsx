'use client';

import { getDirectusFile } from '@/lib/directus/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Image } from '@mantine/core';
import { ProductCategory } from '@medusajs/medusa';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ClientProps {
  initialCategories: ProductCategory[];
}

export function CategoriesCard({ initialCategories }: ClientProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    const filteredCategories = initialCategories.filter(
      (category) => category.category_children.length === 0
    );
    setCategories(filteredCategories);
  }, [initialCategories]);

  return (
    <div className="bg-white rounded-[20px] p-2 shadow-[0px_0px_15px_rgba(0,0,0,0.2)] lg:p-4">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 my-4 md:my-10">
        {categories?.map((category, index) => (
          <MotionDiv
            {...fadeInUpEaseProps}
            key={category.id}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1 * index,
            }}
          >
            <Link className="group" href={`/shop/${category.id}` as Route} prefetch={false}>
              <div className="relative mt-4 z-10 flex justify-center items-center transition group-hover:scale-105">
                <div
                  className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full -z-10"
                  style={{
                    background: 'radial-gradient(circle, #02AAEA 10%, #32519F 80%)',
                  }}
                ></div>
                <Image
                  alt="Category image"
                  className="object-center aspect-[16/10] w-16 h-16 md:w-24 md:h-24 drop-shadow-lg rounded-full"
                  fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                  fit="contain"
                  src={getDirectusFile((category as any).thumbnail)}
                />
              </div>
              <div className="[perspective:100px] relative p-2 flex flex-col justify-end items-center mt-4">
                <p className="font-semibold text-sm lg:text-base relative leading-snug text-center text-primary-800">
                  {category.name}
                </p>
              </div>
            </Link>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
