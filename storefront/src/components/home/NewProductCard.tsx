'use client';

import { BASE_MEDIA_URL } from '@/config/env';
import { defaultRegion } from '@/config/medusa';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { useMedusaClient } from '@/lib/medusa/context';
import { Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '../iconify';
import ProductPrice from '../product/ProductPrice';

interface Props {
  product: PricedProduct;
  dealPrice?: number;
}

export default function NewProductCard({ product, dealPrice }: Props) {
  const t = useTranslations('product');
  // console.log(dealPrice);
  const { currency } = useMedusaClient();
  const [quantity, setQuantity] = useState(1);
  // TODO get region
  const region = { ...defaultRegion, currency_code: currency as string };
  // Product has only one variant
  const variant = product.variants[0];

  let inStock = variant.inventory_quantity ? variant.inventory_quantity > 0 : false;

  const url = `/products/${product.handle}` as Route;
  const image_url = `${BASE_MEDIA_URL}/${product.metadata?.item_code}.png`;

  const pathname = usePathname();
  const isDealsPage = pathname.includes('/deals');

  const isSmallScreen = useMediaQuery('(max-width: 640px)');

  return (
    <div className="relative flex flex-col h-full group bg-white transition rounded-[20px] md:py-3 2xl:py-2">
      {dealPrice && (
        <div className="absolute right-[-20px] z-10 rotate-6">
          <Badge color="red" size="lg" variant="filled">
            Deal
          </Badge>
        </div>
      )}
      <div
        className={`flex items-center justify-between px-4 md:px-8 ${isDealsPage ? 'mt-10' : 'mt-6'}`}
      >
        <div>
          {!inStock && (
            <Badge color="red" size={isSmallScreen ? 'sm' : 'md'} variant="filled">
              {t('outOfStock')}
            </Badge>
          )}
          {inStock && variant.inventory_quantity! < 6 && (
            <Badge color="orange" size={isSmallScreen ? 'sm' : 'md'} variant="filled">
              {t('lowOnStock')}
            </Badge>
          )}
        </div>
        <Icon
          className="cursor-pointer transition hover:scale-110"
          height={isSmallScreen ? 18 : 24}
          icon="si:heart-line"
        />
      </div>
      <Link href={url} prefetch={false}>
        <div className="relative aspect-[16/10] mb-2 mt-4">
          <Image
            fill
            alt="Product image"
            className="object-contain object-center transition hover:scale-110"
            fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
            src={image_url}
          />
        </div>
      </Link>
      <div className="px-4 md:px-8 pb-4 flex-1 rounded-lg relative">
        <Link className="block" href={url} prefetch={false}>
          <p className="text-sm font-semibold text-gray-500">
            {product.categories?.[0]?.name || 'Uncategorized'}
          </p>
          <p className="text-sm font-bold mt-1 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {product.title}
          </p>
          <ProductPrice
            dealPrice={dealPrice}
            product={product}
            region={region}
            variant={variant}
            version="card"
          />
          {/* <p className="text-sm text-gray-500 mt-2">Minimum order quantity: 6</p> */}
        </Link>

        {/* <div className="flex flex-col md:flex-row mt-4 gap-4">
          <NumberInput
            hideControls
            classNames={{
              input: 'text-center bg-gray-300 rounded-full px-6 py-2 w-full font-medium',
              root: 'flex items-center border border-gray-300 rounded-full',
            }}
            disabled={!inStock}
            leftSection={
              <button
                className="text-gray-500 px-1 py-1 hover:text-black bg-white rounded-full"
                disabled={!inStock || quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon icon="raphael:arrowleft" />
              </button>
            }
            max={50}
            min={1}
            rightSection={
              <button
                className="text-gray-500 px-1 py-1 hover:text-black bg-white rounded-full mr-2"
                disabled={!inStock || quantity >= 50}
                onClick={() => setQuantity(Math.min(50, quantity + 1))}
              >
                <Icon icon="raphael:arrowright" />
              </button>
            }
            step={1}
            value={quantity}
            onChange={(value) => setQuantity(Number(value))}
          />

          <ButtonCartItemAdd
            disabled={!inStock}
            quantity={quantity}
            variantId={variant.id as string}
          />
        </div> */}
      </div>
    </div>
  );
}
