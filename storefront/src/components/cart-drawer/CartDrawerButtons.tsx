'use client';

import { Icon } from '@/components/iconify';
import { notification } from '@/components/notification';
import { removeLineItems } from '@/lib/medusa/cart/server';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { useCartDrawer } from './CartDrawerContext';
import { useParams } from 'next/navigation'; // Import useParams

export default function CartDrawerButtons() {
  const params = useParams(); // Read the [store] parameter
  const store = params.store; // Access the store value (e.g., 'retail' or 'webshop')
  const t = useTranslations('global');
  const [opened, { close }] = useCartDrawer();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClearCart = async () => {
    setIsRemoving(true);
    try {
      await removeLineItems();
    } catch (error: any) {
      notification.error(error.message ?? t('messages.genericError'));
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        component={Link}
        href={`/${store}/cart`}
        leftSection={<Icon height={16} icon="solar:cart-large-minimalistic-bold" />}
        onClick={close}
      >
        {t('buttons.goToCart')}
      </Button>
      {/* TODO unhide when needed */}
      <Button
        className="hidden"
        component={Link}
        href={`/${store}/checkout`}
        leftSection={<Icon height={16} icon="ph:shopping-cart-bold" />}
        onClick={close}
      >
        {t('buttons.goToCheckout')}
      </Button>
      <Button
        leftSection={<Icon height={16} icon="ph:trash-bold" />}
        loading={isRemoving}
        variant="default"
        onClick={handleClearCart}
      >
        {t('buttons.clearCart')}
      </Button>
    </div>
  );
}
