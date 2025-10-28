'use client';

import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BaseRecord, HttpError, useTableReturnType } from '@refinedev/core';
import { useTranslations } from 'next-intl';
import CategoriesList from '../shop/CategoriesList';
import { ShopFiltersContext } from './ShopFiltersContext';

interface Props extends React.PropsWithChildren {
  tableQuery: useTableReturnType<BaseRecord, HttpError>;
}

export default function ShopFiltersProvider({ children, tableQuery }: Props) {
  const t = useTranslations('global');
  const state = useDisclosure(false);
  const [opened, { close }] = state;

  return (
    <ShopFiltersContext.Provider value={state}>
      {children}
      <Drawer
        classNames={{
          body: 'p-0 flex flex-col h-[calc(100%_-_60px)]',
        }}
        opened={opened}
        position="bottom"
        title="Filters"
        onClose={close}
      >
        <div className="px-4 pb-4 flex-1 overflow-y-auto">
          <CategoriesList tableQuery={tableQuery} />
        </div>
        <footer className="py-3 border-t px-4 flex-none">
          <Button fullWidth onClick={close}>
            View Results
          </Button>
        </footer>
      </Drawer>
    </ShopFiltersContext.Provider>
  );
}
