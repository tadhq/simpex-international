import { Pagination, Select } from '@mantine/core';
import { BaseRecord, HttpError, useTableReturnType } from '@refinedev/core';
import { useTranslations } from 'next-intl';

const TablePagination: React.FC<{ refineCore: useTableReturnType<BaseRecord, HttpError> }> = ({
  refineCore,
}) => {
  const { setCurrent, pageCount, current, pageSize, setPageSize } = refineCore;
  const t = useTranslations('shop');

  return (
    <div className="flex gap-4 flex-col lg:flex-row-reverse justify-between">
      <div className="flex items-center gap-2">
        <span>{t('showing')}:</span>
        <Select
          checkIconPosition="right"
          data={['12', '25', '50', '100', '250', '500']}
          value={String(pageSize)}
          w="5rem"
          onChange={(value) => {
            setPageSize(Number(value));
          }}
        />
      </div>
      <Pagination siblings={2} total={pageCount} value={current} onChange={setCurrent} />
    </div>
  );
};

export default TablePagination;
