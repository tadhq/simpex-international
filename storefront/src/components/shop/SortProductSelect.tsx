import { Select } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';

export default function SortProductSelect({
  tableQuery,
  className,
}: {
  tableQuery: any;
  className?: string;
}) {
  const t = useTranslations('shop');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex-shrink-0">{t('sort')}</span>
      <Select
        checkIconPosition="right"
        classNames={{ input: 'select-none' }}
        data={[
          { value: '', label: t('default') },
          { value: '-created_at', label: t('new') },
          {
            group: t('price'),
            items: [
              { value: 'variants.prices.amount', label: t('lowHigh') },
              { value: '-variants.prices.amount', label: t('highLow') },
            ],
          },
          {
            group: t('name'),
            items: [
              { value: 'title', label: 'A - Z' },
              { value: '-title', label: 'Z - A' },
            ],
          },
        ]}
        defaultValue=""
        miw={120}
        onChange={(value) => {
          if (value) {
            tableQuery.setFilters([
              {
                field: 'order',
                operator: 'eq',
                value: value,
              },
            ]);
          } else {
            tableQuery.setFilters([
              {
                field: 'order',
                operator: 'eq',
                value: undefined,
              },
            ]);
          }
        }}
      />
    </div>
  );
}
