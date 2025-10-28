'use client';

import { createContext, useContext } from 'react';

export interface Context {
  currency: string;
}

export const MedusaClientContext = createContext({});

export function useMedusaClient() {
  return useContext(MedusaClientContext) as Context;
}
