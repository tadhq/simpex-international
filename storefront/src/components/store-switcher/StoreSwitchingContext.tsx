'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type StoreType = 'wholesale' | 'retail';

interface StoreContextProps {
  storeType: StoreType;
  setStoreType: (type: StoreType) => void;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [storeType, setStoreType] = useState<StoreType>('retail'); // Default to 'retail'

  return (
    <StoreContext.Provider value={{ storeType, setStoreType }}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
