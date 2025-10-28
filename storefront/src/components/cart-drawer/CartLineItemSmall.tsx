'use client';

import { ButtonCartItemRemove } from '@/components/cart';
import { ProductPrice } from '@/components/product';
import { BASE_MEDIA_URL } from '@/config/env';
import { defaultRegion } from '@/config/medusa';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { updateLineItem } from '@/lib/medusa/cart/server';
import { Loader, NumberInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { LineItem } from '@medusajs/medusa';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '../iconify';

interface Props {
  item: LineItem;
  currency: string | undefined;
}

export default function CartLineItemSmall({ item, currency }: Props) {
  // const currency = await getCurrency();
  const t = useTranslations('product');
  const locale = useLocale();
  const marginRightClass = locale === 'nl' ? 'mr-8 md:mr-10' : 'mr-14 md:mr-16';

  // TODO get region
  const region = { ...defaultRegion, currency_code: currency as string };
  // Reshape the line item
  const product = { ...item, variants: [item.variant], variant: undefined };

  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let inStock = item.variant.inventory_quantity ? item.variant.inventory_quantity > 0 : false;
  const isLowStock = inStock && item.variant.inventory_quantity! < 6;

  const changeQuantity = async (newQty: number) => {
    if (newQty === quantity) return;
    setUpdating(true);
    setError(null);

    const message = await updateLineItem({
      lineId: item.id,
      quantity: newQty,
    })
      .catch((err) => err.message)
      .finally(() => setUpdating(false));

    if (message) {
      // setError(message);
      notifications.show({
        title: 'Inventory warning',
        message:
          message.includes('insufficient') || message.includes('inventory')
            ? 'Not enough items in stock.'
            : message,
        color: 'red',
        icon: <Icon className="text-xl" icon="raphael:cross" />,
      });
    } else {
      setQuantity(newQty);
    }
  };

  const handleDecrement = () => {
    const isLowStock = inStock && item.variant.inventory_quantity! < 6;
    const minQty = isLowStock ? 1 : 6;

    const newQty = Math.max(minQty, quantity - 1);

    if (newQty === quantity) {
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

    changeQuantity(newQty);
  };

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <Link href={`/products/${item.variant.product.handle}`} prefetch={false}>
        <div className="aspect-[4/3] relative">
          <Image
            fill
            alt="Product image"
            className="object-contain object-center"
            fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
            src={`${BASE_MEDIA_URL}/${product.variants[0].sku}.png`}
          />
        </div>
      </Link>
      {/* FIXME overflow */}
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col flex-1 mb-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm line-clamp-2 max-w-48 mb-2">
                <Link
                  className="break-all"
                  href={`/products/${item.variant.product.handle}`}
                  prefetch={false}
                >
                  {item.title}
                </Link>
              </h3>
              <div className="flex justify-end gap-[92px] md:gap-[102px]">
                <div className="flex items-center gap-2">
                  <NumberInput
                    hideControls
                    classNames={{
                      input: 'text-center bg-gray-300 rounded-full px-6 py-3 w-32 font-medium',
                      root: 'flex items-center rounded-full',
                    }}
                    leftSection={
                      <button
                        className="text-gray-500 px-1 py-1 hover:text-black bg-white rounded-full"
                        disabled={updating}
                        onClick={handleDecrement}
                      >
                        <Icon icon="raphael:arrowleft" />
                      </button>
                    }
                    max={item.variant.inventory_quantity}
                    min={6}
                    rightSection={
                      <button
                        className="text-gray-500 px-1 py-1 hover:text-black bg-white rounded-full mr-3"
                        disabled={updating}
                        onClick={() =>
                          changeQuantity(
                            Math.min(item.variant.inventory_quantity + 1, quantity + 1)
                          )
                        }
                      >
                        <Icon icon="raphael:arrowright" />
                      </button>
                    }
                    size="xs"
                    step={1}
                    value={quantity}
                    variant="filled"
                    onChange={(value) => changeQuantity(Number(value))}
                  />
                  <div className={`ml-2 w-4 h-4 flex items-center ${marginRightClass}`}>
                    {updating && <Loader color="blue" size="xs" />}
                  </div>
                  <ButtonCartItemRemove lineId={item.id} />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </div>

            <div className="flex -ml-32">
              <ProductPrice
                appearance="tight"
                product={product as any}
                region={region}
                variant={item.variant as any}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
