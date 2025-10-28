'use client';

import { Icon } from '@/components/iconify';
import { removeLineItem } from '@/lib/medusa/cart/server';
import { ActionIcon, Button, ButtonProps } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { notification } from '../notification';

interface Props extends ButtonProps {
  lineId: string;
  appearance?: 'normal' | 'icon';
}

export default function ButtonCartItemRemove({ lineId, appearance = 'normal', ...props }: Props) {
  const t = useTranslations('global');
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeLineItem(lineId);
    } catch (error: any) {
      notification.error(error.message ?? t('messages.genericError'));
    } finally {
      setIsRemoving(false);
    }
  };

  if (appearance === 'icon') {
    return (
      <ActionIcon color="red" loading={isRemoving} variant="subtle" onClick={handleRemove}>
        <Icon height={14} icon="ph:trash-bold" />
      </ActionIcon>
    );
  }

  return (
    <Button
      color="red"
      leftSection={<Icon height={14} icon="ph:trash-bold" />}
      loading={isRemoving}
      size="xs"
      variant="subtle"
      onClick={handleRemove}
      {...props}
    >
      {t('buttons.remove')}
    </Button>
  );
}
