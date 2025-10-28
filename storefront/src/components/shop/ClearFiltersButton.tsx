import { Button } from '@mantine/core';
import { BaseRecord, getDefaultFilter, HttpError, useTableReturnType } from '@refinedev/core';
import { useTranslations } from 'next-intl';
import { Icon } from '../iconify';

interface Props {
  tableQuery: useTableReturnType<BaseRecord, HttpError>;
  [key: string]: any;
}

export default function ClearFiltersButton({ tableQuery, ...props }: Props) {
  const { filters, setFilters } = tableQuery;
  const t = useTranslations('shop');

  const categoryFilter = getDefaultFilter('category_id', filters, 'eq');
  const searchTerm = getDefaultFilter('q', filters, 'eq');

  if (!categoryFilter?.length && !searchTerm) return null;

  return (
    <Button
      leftSection={<Icon icon={'radix-icons:cross-2'} />}
      variant="default"
      onClick={() => {
        setFilters([
          {
            field: 'category_id',
            operator: 'eq',
            value: undefined,
          },
          {
            field: 'q',
            operator: 'eq',
            value: undefined,
          },
        ]);
      }}
      {...props}
    >
      {t('clearFilters')}
    </Button>
  );
}
