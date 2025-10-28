'use client';

import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext } from 'react';

export const DrawerMainContext = createContext({});

export function useDrawerMain() {
  return useContext(DrawerMainContext) as ReturnType<typeof useDisclosure>;
}
