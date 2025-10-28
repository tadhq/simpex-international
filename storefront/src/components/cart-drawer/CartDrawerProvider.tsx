'use client';

import { Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { CartDrawerContext } from './CartDrawerContext';

interface Props extends React.PropsWithChildren {
  content: React.ReactNode;
}

export default function CartDrawerProvider({ children, content }: Props) {
  const t = useTranslations('global');
  const state = useDisclosure(false);

  return (
    <CartDrawerContext.Provider value={state}>
      {children}
      <Drawer
        classNames={{
          body: 'p-0 flex flex-col h-[calc(100%_-_60px)]',
        }}
        opened={state[0]}
        position="right"
        title={t('pages.cart')}
        onClose={state[1].close}
      >
        {content}
      </Drawer>
    </CartDrawerContext.Provider>
  );
}
