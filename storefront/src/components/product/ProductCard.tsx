'use client';

import { ButtonCartItemAdd } from '@/components/cart';
import { BASE_MEDIA_URL } from '@/config/env';
import { defaultRegion } from '@/config/medusa';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { useMedusaClient } from '@/lib/medusa/context';
import { Badge, NumberInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '../iconify';
import { useWishlist } from '../wishlist-drawer/WishlistContext';
import ProductPrice from './ProductPrice';
import { useStore } from '../store-switcher/StoreSwitchingContext';

interface Props {
  product: PricedProduct;
  dealPrice?: number;
  customer?: any; // TODO: Define the type for customer
  price_list?: any;
}

export default function ProductCard({ customer, product, dealPrice, price_list }: Props) {
  const t = useTranslations('product');
  const { currency } = useMedusaClient();
  const params = useParams(); // Read the [store] parameter
  const store = params.store; // Access the store value (e.g., 'retail' or 'webshop')
  const [quantity, setQuantity] = useState(store === 'wholesale' ? 6 : 1);
  const region = { ...defaultRegion, currency_code: currency as string };
  const variant = product.variants[0];
  let inStock = variant.inventory_quantity ? variant.inventory_quantity > 0 : false;
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const url = `/${store}/products/${product.handle}` as Route;
  const image_url = `${BASE_MEDIA_URL}/${product.metadata?.item_code}.png`;

  const pathname = usePathname();
  const isDealsPage = pathname.includes('/deals');

  const [isWishlisted, setIsWishlisted] = useState(
    wishlist.some((item: any) => item.item_id === product.id)
  );

  const handleDecrement = () => {
    const isLowStock = inStock && variant.inventory_quantity! < 6;
    const minQty = isLowStock || store === 'retail' ? 1 : 6;

    if (quantity <= minQty) {
      if (!isLowStock) {
        notifications.show({
          title: 'Minimum order quantity',
          message: `You must order at least 6 items.`,
          color: 'yellow',
          icon: <Icon className="text-xl" icon="ph:exclamation-mark-bold" />,
        });
      }
      return;
    }

    setQuantity((prev) => Math.max(minQty, prev - 1));
  };

  const handleIncrement = () => {
    if (quantity >= variant.inventory_quantity!) {
      notifications.show({
        title: 'Insufficient stock',
        message: `Only ${variant.inventory_quantity} items available in stock.`,
        color: 'red',
        icon: <Icon className="text-xl" icon="raphael:cross" />,
      });
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch('api/addToWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      // Check if product is already wishlisted
      if (isWishlisted) {
        removeFromWishlist(product.id as string); // Remove first
      } else {
        addToWishlist(product.id as string); // Add first
      }

      // Update the local state after the fetch request
      setIsWishlisted((prev: any) => !prev);

      notifications.show({
        title: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
        message: isWishlisted
          ? `${product.title} has been removed from your wishlist.`
          : `${product.title} has been added to your wishlist.`,
        color: isWishlisted ? 'yellow' : 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Could not update wishlist',
        message: 'Make sure you are logged in.',
        icon: <Icon className="text-xl" icon="ph:exclamation-mark-bold" />,
        color: 'red',
      });
    }
  };

  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  return (
    <div className="relative flex flex-col h-full group bg-white transition rounded-[20px]">
      {dealPrice && (
        <div className="absolute top-4 right-[-20px] z-10 rotate-6">
          <Badge color="red" size="lg" variant="filled">
            Deal
          </Badge>
        </div>
      )}

      <div
        className={`flex items-center justify-between px-4 ${isDealsPage ? 'px-8 mt-14' : 'px-4 mt-6'} `}
      >
        <div>
          {!inStock && (
            <Badge color="red" size={isSmallScreen ? 'md' : 'lg'} variant="filled">
              {t('outOfStock')}
            </Badge>
          )}
          {inStock && variant.inventory_quantity! < 6 && (
            <Badge color="orange" size={isSmallScreen ? 'md' : 'lg'} variant="filled">
              {t('lowOnStock')}
            </Badge>
          )}
        </div>
        <Icon
          className="cursor-pointer transition hover:scale-110"
          color="#2A4786"
          height={24}
          icon={isWishlisted ? 'si:heart-fill' : 'si:heart-line'}
          onClick={handleAddToWishlist}
        />
      </div>
      <Link href={url} prefetch={false}>
        <div className="relative aspect-[16/10] mb-2 mt-2">
          <Image
            fill
            alt="Product image"
            className="object-contain object-center transition hover:scale-110"
            fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
            src={image_url}
          />
        </div>
      </Link>
      <div className={`${isDealsPage ? 'px-8' : 'px-4'} px-4 pb-4 flex-1 rounded-lg relative`}>
        <Link className="block" href={url} prefetch={false}>
          <p className="text-sm font-semibold text-gray-500 leading-snug line-clamp-2 h-[2.75rem]">
            {product.categories?.[0]?.name || 'Uncategorized'}
          </p>
          <p className="text-sm font-bold mt-1 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {product.title}
          </p>
          <ProductPrice
            store={store}
            price_list={price_list}
            dealPrice={dealPrice}
            product={product}
            region={region}
            variant={variant}
            version="card"
          />
        </Link>

        <div
          className={`flex md:flex-row mt-4 gap-4 w-full ${isDealsPage ? 'flex-row' : 'flex-col'}`}
        >
          <NumberInput
            hideControls
            classNames={{
              input: `text-center bg-gray-300 rounded-full px-6 py-2 font-medium w-full}`,
              root: `flex items-center rounded-full ${isDealsPage ? 'justify-center md:w-full' : 'w-full'}`,
            }}
            disabled={!inStock}
            leftSection={
              <button
                className="text-gray-500 px-1 py-1 hover:text-black bg-white rounded-full"
                disabled={!inStock}
                onClick={handleDecrement}
              >
                <Icon icon="raphael:arrowleft" />
              </button>
            }
            max={variant.inventory_quantity}
            min={inStock && variant.inventory_quantity! < 6 ? 1 : 6}
            rightSection={
              <button
                className="text-gray-500 px-1 py-1 hover:text-black bg-white rounded-full mr-2"
                disabled={!inStock}
                onClick={handleIncrement}
              >
                <Icon icon="raphael:arrowright" />
              </button>
            }
            step={1}
            value={quantity}
            onChange={(value) => setQuantity(Number(value))}
          />

          <ButtonCartItemAdd
            dealPrice={dealPrice}
            disabled={!inStock}
            productVariant={variant}
            quantity={quantity}
            variantId={variant.id as string}
          />
        </div>
      </div>
    </div>
  );
}
