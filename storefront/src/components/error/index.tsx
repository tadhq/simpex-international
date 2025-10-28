'use client';

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  // reset: () => void;
  // HACK silent the type error: Props must be serializable
  reset: any;
}

export default function Error({ error, reset }: Props) {
  const t = useTranslations('global');

  useEffect(() => {
    // TODO send to error tracking service
    console.error(error.message);
  }, [error]);

  return (
    <main className="flex-1 grid place-items-center">
      <div className="container text-center py-8">
        <h1 className="text-2xl font-bold mb-3">{t('messages.genericError')}</h1>
        <div className="break-all text-sm text-base-600 font-mono whitespace-pre text-wrap mb-6">
          {error.stack}
        </div>
        <Button onClick={reset}>{t('buttons.retry')}</Button>
      </div>
    </main>
  );
}
