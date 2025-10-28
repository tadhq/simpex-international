'use client';

import { getProductCategories } from '@/lib/medusa/api/productCategories';
import { Radio } from '@mantine/core';
import { ProductCategory } from '@medusajs/medusa';
import { BaseRecord, getDefaultFilter, HttpError, useTableReturnType } from '@refinedev/core';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import LoadingState from './LoadingState';

interface Props {
  tableQuery: useTableReturnType<BaseRecord, HttpError>;
}

export default function CategoriesList({ tableQuery }: Props) {
  const locale = useLocale();

  const { filters, setFilters, setCurrent } = tableQuery;

  const categoryFilter = getDefaultFilter('category_id', filters, 'eq');
  const categorySelected = categoryFilter?.[0] ?? '';
  const t = useTranslations('resources');

  const [categoriesIsLoading, setCategoriesIsLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // TODO replace with react-query
  useEffect(() => {
    getProductCategories({ locale })
      .then((data: ProductCategory[]) => {
        if (data?.length > 0) {
          setCategories(data);
        }
      })
      .finally(() => {
        setCategoriesIsLoading(false);
      });
  }, [locale]);

  if (categoriesIsLoading) return <LoadingState />;

  return (
    <>
      <h3 className="font-bold mb-3 text-primary-700">{t('categories')}</h3>
      <Radio.Group
        value={categorySelected}
        onChange={(value) => {
          if (value) {
            setCurrent(1);
            setFilters([
              {
                field: 'category_id',
                operator: 'eq',
                value: [value],
              },
            ]);
          } else {
            setFilters([
              {
                field: 'category_id',
                operator: 'eq',
                value: undefined,
              },
            ]);
          }
        }}
      >
        <ul className="flex flex-col gap-3">
          {categories?.map((category) => (
            <li key={category.id}>
              <Radio color="secondary" label={category.name} size="md" value={category.id} />
            </li>
          ))}
        </ul>
      </Radio.Group>
    </>
  );
}
