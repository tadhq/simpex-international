'use client';

import { Icon } from '@/components/iconify';
import { notification } from '@/components/notification';
import { addToCart } from '@/lib/medusa/cart/server';
import { Button, ButtonProps } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Props extends ButtonProps {
  variantId: string;
  quantity: number;
  label?: string;
  iconSize?: number;
  dealPrice?: number;
  productVariant?: PricedVariant;
}

export default function ButtonCartItemAdd({
  variantId,
  quantity,
  label,
  dealPrice,
  iconSize,
  productVariant,
  ...props
}: Props) {
  const t = useTranslations('global');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (quantity > (productVariant?.inventory_quantity ?? 0)) {
      notifications.show({
        title: 'Insufficient stock',
        message: `Only ${productVariant?.inventory_quantity ?? 0} items available in stock.`,
        icon: <Icon icon="raphael:cross" />,
        color: 'red',
      });
      return;
    }
    setIsAdding(true);
    try {
      await addToCart({
        variantId,
        quantity,
        dealPrice,
      });
      notification.success(t('messages.addToCartSuccess'));
    } catch (error: any) {
      notification.error(error.message ?? t('messages.genericError'));
    } finally {
      setIsAdding(false);
    }
  };

  const pathname = usePathname();
  const isDealsPage = pathname.includes('/deals');

  return (
    <Button
      className={`px-8 rounded-full ${isDealsPage ? 'w-1/2 md:w-28' : ''}`}
      color="secondary"
      loading={isAdding}
      onClick={handleAddToCart}
      {...props}
    >
      <Icon
        className="w-5 h-5 md:w-8 md:h-8"
        icon="solar:cart-large-minimalistic-bold"
        style={{ width: iconSize, height: iconSize }}
      />
      {label && <span className="text-sm ml-2">{label}</span>}
    </Button>
  );
}
