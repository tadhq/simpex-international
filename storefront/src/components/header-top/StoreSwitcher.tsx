'use client';
import React from 'react';
import { useStore } from '../store-switcher/StoreSwitchingContext';

export default function StoreSwitcher() {
  const { storeType, setStoreType } = useStore();

  return (
    <div className="flex gap-2">
      <button
        className={`px-4 py-1 rounded-full text-sm ${
          storeType === 'wholesale'
            ? 'bg-gradient-to-r from-primary-500 to-[#02AAEA] text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => setStoreType('wholesale')}
      >
        Wholesale
      </button>
      <button
        className={`px-4 py-1 rounded-full text-sm ${
          storeType === 'retail'
            ? 'bg-gradient-to-r from-primary-500 to-[#02AAEA] text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => setStoreType('retail')}
      >
        Retail
      </button>
    </div>
  );
}
