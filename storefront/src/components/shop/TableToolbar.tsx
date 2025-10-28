import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';
import { Button, Indicator } from '@mantine/core';
import { BaseRecord, getDefaultFilter, HttpError, useTableReturnType } from '@refinedev/core';
import { useTranslations } from 'next-intl';
import { Icon } from '../iconify';
import { useShopFilters } from '../shop-filters/ShopFiltersContext';
import ClearFiltersButton from './ClearFiltersButton';
import SortProductSelect from './SortProductSelect';
import { usePagination } from './usePagination';

const TableToolbar: React.FC<{ refineCore: useTableReturnType<BaseRecord, HttpError> }> = ({
  refineCore,
}) => {
  const { tableQueryResult, current, filters } = refineCore;
  const { totalItems, firstItemNumber, lastItemNumber } = usePagination(
    tableQueryResult.data?.total,
    String(current)
  );

  const searchTerm = getDefaultFilter('q', filters, 'eq');

  const t = useTranslations('shop');

  const [opened, { open }] = useShopFilters();

  return (
    <MotionDiv
      className="flex md:justify-between flex-col md:flex-row gap-x-2 gap-y-5"
      {...fadeInEaseProps}
      transition={{
        ...fadeInEaseProps.transition,
        delay: 0.1,
      }}
    >
      <div className="flex items-start justify-between gap-3 md:order-2">
        <div className="md:hidden flex gap-3 flex-wrap">
          <Indicator color="secondary" disabled={!(filters?.length > 3)}>
            <Button
              className="overflow-visible"
              leftSection={<Icon icon="ph:faders-bold" />}
              variant="default"
              onClick={open}
            >
              Filters
            </Button>
          </Indicator>
          <ClearFiltersButton tableQuery={refineCore} />
        </div>
        <SortProductSelect className="w-full max-w-52" tableQuery={refineCore} />
      </div>
      <div>
        {searchTerm && (
          <h2 className="text-primary-600 font-semibold text-xl">
            {t('searchResults', { searchTerm })}
          </h2>
        )}
        <p className="mt-2">{t('showingItems', { firstItemNumber, lastItemNumber, totalItems })}</p>
      </div>
    </MotionDiv>
  );
};

export default TableToolbar;
