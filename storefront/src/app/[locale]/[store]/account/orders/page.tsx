import { listCustomerOrders } from '@/lib/medusa/api';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import OrderOverview from '@/modules/account/components/order-overview';
import { Title } from '@mantine/core';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; store: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('account.orders'),
    description: t('account.metaOrdersDescription'),
  };
}

export default async function Orders({ params }: Props) {
  const store = params.store;
  const orders = await listCustomerOrders();

  const t = await getTranslations();

  if (!orders) {
    notFound();
  }

  return (
    <MotionDiv
      className="w-full"
      {...fadeInUpEaseProps}
      transition={{
        ...fadeInUpEaseProps.transition,
        delay: 0.1,
      }}
    >
      <div className="mb-8 flex flex-col gap-y-4">
        <Title order={3}>{t('account.orders')}</Title>
        <p className="text-base-regular">{t('account.ordersDescription')}</p>
      </div>
      <div>
        <OrderOverview orders={orders} store={store} />
      </div>
    </MotionDiv>
  );
}
