'use client';

import { Button } from '@mantine/core';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import OrderCard from '../order-card';

const OrderOverview = ({ orders, store }: { orders: Order[]; store: any }) => {
  const t = useTranslations();

  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div key={o.id} className="border-b border-base-200 pb-6 last:pb-0 last:border-none">
            <OrderCard order={o} store={store} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-y-4">
      <h2 className="text-lg font-bold">{t('accountOrders.emptyOrderTitle')}</h2>
      <p className="text-base-regular">{t('accountOrders.emptyOrderDescription')}</p>
      <div className="mt-4">
        <Button component={Link} href="/">
          {t('global.buttons.continueShopping')}
        </Button>
      </div>
    </div>
  );
};

export default OrderOverview;
