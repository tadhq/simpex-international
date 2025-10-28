'use client';
import { useWishlist } from '@/components/wishlist-drawer/WishlistContext';
import { BASE_MEDIA_URL } from '@/config/env';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { Icon } from '@iconify/react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

type Product = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  metadata: {
    barcode?: string;
    item_code?: string;
    [key: string]: any;
  };
};

type WishlistCardProps = {
  product: Product;
  store: string;
};

const WishlistCard = ({ product, store }: WishlistCardProps) => {
  const t = useTranslations();
  const [isRemoved, setIsRemoved] = useState(false);
  const { removeFromWishlist, addToWishlist } = useWishlist();

  const toggleWishlist = async () => {
    try {
      const response = await fetch('.../api/addToWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      if (!isRemoved) {
        removeFromWishlist(product.id);
        setIsRemoved(true);
        notifications.show({
          title: 'Removed from Wishlist',
          message: `${product.title} has been removed from your wishlist.`,
          color: 'yellow',
        });
      } else {
        addToWishlist(product.id); // Re-add the product
        setIsRemoved(false);
        notifications.show({
          title: 'Added back to Wishlist',
          message: `${product.title} has been re-added to your wishlist.`,
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Could not update wishlist',
        message: 'Make sure you are logged in.',
        icon: <Icon className="text-xl" icon="ph:exclamation-mark-bold" />,
        color: 'red',
      });
    }
  };

  return (
    <div className="bg-white flex flex-col p-4 rounded-[20px] shadow-sm">
      <div className="flex gap-4">
        {/* Left - Image */}
        <div className="relative w-32 h-24 flex-shrink-0">
          <Image
            fill
            alt={product.title}
            className="object-contain object-center rounded-lg"
            fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
            src={
              product.metadata?.item_code
                ? `${BASE_MEDIA_URL}/${product.metadata.item_code}.png`
                : getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')
            }
          />
        </div>

        {/* Right - Text Info */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-semibold text-md">{product.title}</h3>
            {product.metadata?.barcode && (
              <span className="text-xs text-gray-500">Barcode: {product.metadata.barcode}</span>
            )}
          </div>

          {/* Bottom Buttons */}
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1"
              component={Link}
              href={`/${store}/products/${product.handle}`}
              variant="default"
            >
              {t('accountWishlist.viewProduct')}
            </Button>
            <Button
              className="flex-1"
              color={isRemoved ? 'green' : 'red'}
              variant={isRemoved ? 'light' : 'outline'}
              onClick={toggleWishlist}
            >
              {isRemoved ? t('accountWishlist.undo') : t('accountWishlist.removeFromWishlist')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
