'use client';

import { ButtonCartItemAdd } from '@/components/cart';
import { Icon } from '@/components/iconify';
import { ProductPrice } from '@/components/product';
import { RegionInfo } from '@/lib/medusa/types';
import { Badge, NumberInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { PricedProduct, PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Props {
  product: PricedProduct;
  variant: PricedVariant;
  region: RegionInfo;
  featured_deals?: { handle: string; deal_price?: number }[] | null;
}

export default function ProductBox({ product, variant, region, featured_deals }: Props) {
  const matchedDeal = featured_deals?.find((deal) => deal.handle === product.handle);
  const dealprice = matchedDeal?.deal_price;
  const t = useTranslations();
  const [quantity, setQuantity] = useState(6);

  let inStock = variant.inventory_quantity ? variant.inventory_quantity > 0 : false;
  const isLowStock = inStock && variant.inventory_quantity! < 6;
  const minQty = isLowStock ? 1 : 6;

  return (
    <div className="flex flex-col gap-3 bg-primary-50 p-4 lg:p-6 rounded-xl md:ml-4">
      <Badge color={!inStock ? 'red' : isLowStock ? 'orange' : 'green'} variant="dot">
        {!inStock
          ? t('product.outOfStock')
          : isLowStock
            ? t('product.lowOnStock')
            : t('product.inStock')}
      </Badge>

      <ProductPrice
        dealPrice={dealprice}
        product={product}
        region={region}
        variant={variant}
        version="box"
      />

      <NumberInput
        disabled={!inStock}
        leftSection={t('product.quantity')}
        leftSectionProps={{ className: 'text-sm' }}
        leftSectionWidth={72}
        max={variant.inventory_quantity}
        min={minQty}
        step={1}
        value={quantity}
        onChange={(value) => {
          const newQty = Number(value);

          if (newQty < minQty) {
            notifications.show({
              title: `Minimum order quantity`,
              message: `You must order at least ${minQty} item${minQty > 1 ? 's' : ''}.`,
              color: 'yellow',
              icon: <Icon className="text-xl" icon="ph:exclamation-mark-bold" />,
            });
            setQuantity(minQty);
          } else {
            setQuantity(newQty);
          }
        }}
      />

      <ButtonCartItemAdd
        disabled={!inStock}
        iconSize={20}
        label={t('global.buttons.addToCart')}
        productVariant={variant}
        quantity={quantity}
        variantId={variant.id as any}
      />
    </div>
  );
}
