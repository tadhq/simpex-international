'use client';

import { notification } from '@/components/notification';
import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { createPdf } from './utils';

interface Props {
  filename: string;
  onChange: (value: boolean) => void;
}

export default function OrderDownloadPDFButton({ filename, onChange }: Props) {
  const t = useTranslations();

  const handler = () => {
    onChange(true);
    setTimeout(() => {
      createPdf({
        target: '#order-details',
        filename,
      })
        .catch((error) => {
          notification.error(error.message, { title: t('global.messages.failedPdfGeneration') });
        })
        .finally(() => {
          onChange(false);
        });
    }, 1000);
  };

  return (
    <Button variant="default" onClick={handler}>
      {t('accountOrders.downloadAsPdf')}
    </Button>
  );
}
