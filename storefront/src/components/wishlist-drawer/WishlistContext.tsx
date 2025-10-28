// context/WishlistContext.tsx
'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface WishlistContextType {
  wishlist: { item_id: string }[];
  setWishlist: React.Dispatch<React.SetStateAction<{ item_id: string }[]>>;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({
  customer,
  children,
}: {
  customer: any;
  children: ReactNode;
}) => {
  const rawData: any[] = customer?.metadata?.wish_list || [];

  // Extract valid items and remove duplicates, now in object format
  const initialWishlist = Array.from(
    new Set(
      rawData
        .map((item: any) => item?.item_id)
        .filter((id: any): id is string => typeof id === 'string' && id.trim() !== '')
        .map((itemId) => ({ item_id: itemId })) // Changed to item_id
    )
  );

  const [wishlist, setWishlist] = useState<{ item_id: string }[]>(initialWishlist);

  useEffect(() => {
    const updatedWishlist = Array.from(
      new Set(
        rawData
          .map((item: any) => item?.item_id)
          .filter((id: any): id is string => typeof id === 'string' && id.trim() !== '')
          .map((itemId) => ({ item_id: itemId })) // Changed to item_id
      )
    );
    setWishlist(updatedWishlist);
  }, [customer?.metadata?.wish_list]);

  const addToWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (!prev.some((item) => item.item_id === productId)) {
        return [...prev, { item_id: productId }];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((item) => item.item_id !== productId);
      // Ensure that the new state triggers a re-render
      return [...newWishlist];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
