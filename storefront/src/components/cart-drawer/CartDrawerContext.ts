'use client';

import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext } from 'react';

export const CartDrawerContext = createContext<any>([]);

export function useCartDrawer() {
  const context = useContext(CartDrawerContext) as ReturnType<typeof useDisclosure>;

  if (!context.length) {
    return [false, { open: () => {}, close: () => {}, toggle: () => {} }] as ReturnType<
      typeof useDisclosure
    >;
  }

  return context;
}
