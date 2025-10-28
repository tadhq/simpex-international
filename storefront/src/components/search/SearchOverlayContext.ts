'use client';

import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext } from 'react';

export const SearchOverlayContext = createContext({});

export function useSearchOverlay() {
  return useContext(SearchOverlayContext) as ReturnType<typeof useDisclosure>;
}
