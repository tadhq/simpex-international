'use client';

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import WishlistCard from '../wishlist-card';

const WishlistOverview = ({ wishlist, store }: any) => {
  const t = useTranslations();

  if (wishlist?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {wishlist.map((w: any) => (
          <div key={w.id} className="border-b border-base-200 pb-6 last:pb-0 last:border-none">
            <WishlistCard product={w} store={store} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-y-4">
      <h2 className="text-lg font-bold">{t('accountWishlist.emptyWishlistTitle')}</h2>
      <p className="text-base-regular">{t('accountWishlist.emptyWishlistDescription')}</p>
      <div className="mt-4">
        <Button component={Link} href="/">
          {t('global.buttons.continueShopping')}
        </Button>
      </div>
    </div>
  );
};

export default WishlistOverview;
