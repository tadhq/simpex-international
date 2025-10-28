'use client';

import { Icon } from '@/components/iconify';
import { getPaymentsSettings } from '@/lib/directus/api';
import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';
import { Alert } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function BankTransferInstructions() {
  const t = useTranslations();
  const [accounts, setAccounts] = useState<{ bank_name: string; details: string }[]>([]);

  useEffect(() => {
    getPaymentsSettings().then((data) => {
      if (data?.bank_transfer_accounts?.length) {
        setAccounts(data.bank_transfer_accounts as any);
      }
    });
  }, []);

  return (
    <div className="mt-2">
      <p className="text-base-700 mb-2">{t('checkout.bankTransferInstructions')}</p>
      <div className="flex items-center gap-3 p-4 border border-pr rounded-lg bg-primary-100 text-primary-800 shadow-sm">
        <div className="flex-shrink-0">
          <div className="bg-primary-500 text-white rounded-full p-1.5">
            <Icon className="text-xl" icon="ph:info" />
          </div>
        </div>
        <p className="font-medium">
          {t('checkout.sendOrderTo')}{' '}
          <a
            className="underline hover:text-primary-600 transition font-bold"
            href="mailto:orders_express@hjgroup.sr"
          >
            orders_express@hjgroup.sr
          </a>
          .
        </p>
      </div>

      <AnimatePresence>
        {!!accounts.length && (
          <MotionDiv className="mt-4" {...fadeInEaseProps}>
            <h4 className="font-semibold">{t('checkout.bankAccountNumbers')}</h4>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(12rem,100%),1fr))] gap-2 mt-2">
              {accounts.map((account, index) => (
                <Alert key={index} title={account.bank_name}>
                  <article dangerouslySetInnerHTML={{ __html: account.details }}></article>
                </Alert>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
