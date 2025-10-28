'use client';

import { LineItem, Region } from '@medusajs/medusa';

import { ButtonCartItemRemove } from '@/components/cart';
import { Icon } from '@/components/iconify';
import { BASE_MEDIA_URL } from '@/config/env';
import { getDirectusFile } from '@/lib/directus/utils';
import { TableTd } from '@/lib/mantine';
import Image from '@/lib/mantine/Image';
import { updateLineItem } from '@/lib/medusa/cart/server';
import ErrorMessage from '@/modules/checkout/components/error-message';
import LineItemOptions from '@/modules/common/components/line-item-options';
import LineItemPrice from '@/modules/common/components/line-item-price';
import LineItemUnitPrice from '@/modules/common/components/line-item-unit-price';
import { Loader, NumberInput, TableTr } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type ItemProps = {
  item: Omit<LineItem, 'beforeInsert'>;
  region: Region;
  type?: 'full' | 'preview';
  price_list?: any;
};

const Item = ({ item, region, type = 'full', price_list }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(item.quantity);
  const params = useParams(); // Read the [store] parameter
  const store = params.store; // Access the store value (e.g., 'retail' or 'webshop')

  const { handle } = item.variant.product;

  let inStock = item.variant.inventory_quantity ? item.variant.inventory_quantity > 0 : false;
  const isLowStock = inStock && item.variant.inventory_quantity! < 6;

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    const message = await updateLineItem({
      lineId: item.id,
      quantity,
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
      setQuantity(quantity); // ✅ Keep local state in sync
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

    changeQuantity(newQty); // ✅ Trigger server update and sync price
  };

  return (
    <TableTr className="w-full">
      <TableTd className="!pl-0 p-4">
        <Link
          // className={cn('flex', {
          //   'w-16': type === 'preview',
          //   'sm:w-24 w-12': type === 'full',
          // })}
          href={`/products/${handle}`}
          prefetch={false}
        >
          <div className="aspect-[4/3] relative h-16">
            <Image
              fill
              alt="Product image"
              className="object-contain object-center"
              fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
              src={`${BASE_MEDIA_URL}/${item.variant.sku}.png`}
            />
          </div>
        </Link>
      </TableTd>

      <TableTd className="text-left">
        <p className="text-sm line-clamp-2 max-w-44">{item.title}</p>
        <p className="text-sm text-gray-500">{item.variant.sku}</p>
        <LineItemOptions variant={item.variant} />
      </TableTd>

      {type === 'full' && (
        <TableTd>
          <div className="flex gap-2 items-center w-28 2xl:w-36">
            <NumberInput
              hideControls
              classNames={{
                input:
                  'text-center bg-gray-300 rounded-full px-6 py-3 md:w-20 2xl:w-32 font-medium',
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
                    changeQuantity(Math.min(item.variant.inventory_quantity + 1, quantity + 1))
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
            {updating && (
              <div className="ml-2">
                <Loader color="blue" size="xs" />
              </div>
            )}
            {/* <CartItemSelect
              className="w-14 h-10 p-4"
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
            >
              {Array.from(
                {
                  length: Math.min(
                    item.variant.inventory_quantity > 0 ? item.variant.inventory_quantity : 10,
                    10
                  ),
                },
                (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                )
              )}
            </CartItemSelect>
            {updating && <Loader />} */}
          </div>
          <ErrorMessage error={error} />
        </TableTd>
      )}

      {type === 'full' && (
        <TableTd className="hidden sm:table-cell">
          <LineItemUnitPrice
            item={item}
            price_list={price_list}
            region={region}
            store={store as string}
            style="tight"
          />
        </TableTd>
      )}

      <TableTd className="!pr-0 text-right">
        <div className="flex flex-col items-end justify-center">
          <div className="flex items-center gap-x-1 text-sm text-gray-500">
            <p>{item.quantity}x</p>
            <LineItemUnitPrice
              item={item}
              price_list={price_list}
              region={region}
              store={store as string}
              style="tight"
            />
          </div>
          <LineItemPrice
            item={item}
            price_list={price_list}
            region={region}
            store={store as string}
            style="tight"
          />
        </div>
      </TableTd>

      {type === 'full' && (
        <TableTd className="text-center">
          <ButtonCartItemRemove appearance="icon" lineId={item.id} />
        </TableTd>
      )}
    </TableTr>
  );
};

export default Item;
