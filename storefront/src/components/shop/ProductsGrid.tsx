'use client';

import { DirectusFile } from '@/lib/directus/types';
import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps, fadeInUpEaseProps } from '@/lib/motion/animations';
import { BaseRecord, getDefaultFilter, HttpError, useTableReturnType } from '@refinedev/core';
import { useLocale } from 'next-intl';
import { ProductCard } from '../product';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import ProductDoubleBanner from './ProductCatDoubleBanner';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';
import { PriceList } from '@medusajs/medusa';
import { useParams } from 'next/navigation';

interface Props {
  tableQuery: useTableReturnType<BaseRecord, HttpError>;
  emptyStateImage: DirectusFile;
  customer?: any; // TODO: Define the type for customer
  price_list?: any;
}

export default function ProductsGridWrapper({
  customer,
  tableQuery,
  emptyStateImage,
  price_list,
}: Props) {
  const locale = useLocale();

  const { filters } = tableQuery;

  const categoryFilter = getDefaultFilter('category_id', filters, 'eq');
  const categorySelected = categoryFilter?.[0] ?? '';

  return (
    <main className="flex-1">
      <ProductDoubleBanner selectedCategoryId={categorySelected} />
      <TableToolbar refineCore={tableQuery} />
      <ProductsGrid
        customer={customer}
        emptyStateImage={emptyStateImage}
        tableQuery={tableQuery}
        price_list={price_list}
      />
    </main>
  );
}

function ProductsGrid({ customer, tableQuery, emptyStateImage, price_list }: Props) {
  const { isLoading, data } = tableQuery.tableQueryResult;
  const params = useParams(); // Read the [store] parameter
  const store = params.store; // Access the store value (e.g., 'retail' or 'webshop')

  if (isLoading || !data?.data) return <LoadingState size="lg" />;

  if (!data?.data?.length) {
    return <EmptyState className="py-16" image={emptyStateImage} />;
  }

  // Sort the data based on last_stock_update
  const sortedData = [...data.data].sort((a, b) => {
    const dateA = a.last_stock_update ? new Date(a.last_stock_update) : new Date(0); // Default to epoch if missing
    const dateB = b.last_stock_update ? new Date(b.last_stock_update) : new Date(0); // Default to epoch if missing
    return dateB.getTime() - dateA.getTime(); // Latest date first
  });

  if (store === 'wholesale') {
    return (
      <>
        {/* TODO better responsive */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {sortedData.map((item, index) => {
            // Find the matching price_list object for the current item
            const matchingPriceList = price_list?.find(
              (price: any) => price.handle === item.handle
            );

            return (
              <MotionDiv
                key={item.id}
                {...fadeInUpEaseProps}
                transition={{
                  ...fadeInUpEaseProps.transition,
                  delay: 0.1 * index,
                }}
              >
                <ProductCard
                  price_list={matchingPriceList} // Pass the singular matching price_list object
                  customer={customer}
                  product={item as any}
                />
              </MotionDiv>
            );
          })}
        </section>
        <MotionDiv className="mt-8" {...fadeInEaseProps}>
          <TablePagination refineCore={tableQuery} />
        </MotionDiv>
      </>
    );
  } else {
    return (
      <>
        {/* TODO better responsive */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {sortedData.map((item, index) => (
            <MotionDiv
              key={item.id}
              {...fadeInUpEaseProps}
              transition={{
                ...fadeInUpEaseProps.transition,
                delay: 0.1 * index,
              }}
            >
              <ProductCard customer={customer} product={item as any} />
            </MotionDiv>
          ))}
        </section>
        <MotionDiv className="mt-8" {...fadeInEaseProps}>
          <TablePagination refineCore={tableQuery} />
        </MotionDiv>
      </>
    );
  }
}
