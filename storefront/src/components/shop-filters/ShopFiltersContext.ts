'use client';

import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext } from 'react';

export const ShopFiltersContext = createContext({});

export function useShopFilters() {
  return useContext(ShopFiltersContext) as ReturnType<typeof useDisclosure>;
}
