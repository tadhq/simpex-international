'use client';

import { Icon } from '@/components/iconify';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCartDrawer } from '../cart-drawer';
import { useParams } from 'next/navigation';

// TODO better empty state
export default function CartEmptyState() {
  const params = useParams(); // Read the [store] parameter
  const store = params.store; // Access the store value (e.g., 'retail' or 'webshop')
  const t = useTranslations('global');
  const [opened, { open, close }] = useCartDrawer();

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Icon className="text-primary-600" height={48} icon="solar:cart-large-minimalistic-bold" />
      <h3>{t('messages.emptyCart')}</h3>
      <Button
        component={Link}
        href={`/${store}/shop`}
        rightSection={<Icon height={16} icon="ph:arrow-right-bold" />}
        onClick={close}
      >
        {t('buttons.continueShopping')}
      </Button>
    </div>
  );
}
