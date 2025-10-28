'use client';

import { Icon } from '@/components/iconify';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// TODO better empty state
export default function OrderCompletedEmptyState({ id }: { id: string }) {
  const t = useTranslations('global');

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Icon className="text-primary-600" height={48} icon="ph:receipt" />
      <h3>{t('messages.orderNotFound', { id })}</h3>
      <Button
        component={Link}
        href="/"
        leftSection={<Icon height={16} icon="ph:house-bold" />}
        variant="default"
      >
        {t('buttons.backHome')}
      </Button>
    </div>
  );
}
