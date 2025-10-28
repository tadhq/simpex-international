import { Metadata } from 'next';

import OrderCompletedEmptyState from '@/components/order/OrderCompletedEmptyState';
import { PRICE_LIST_ID } from '@/config/env';
import { getPriceListProducts, retrieveOrder } from '@/lib/medusa/api';
import { enrichLineItems } from '@/lib/medusa/cart/server';
import OrderCompletedTemplate from '@/modules/order/templates/order-completed-template';
import { LineItem, Order } from '@medusajs/medusa';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string; store: string };
};

async function getOrder(id: string) {
  const order = await retrieveOrder(id).catch((error) => {
    console.error(error?.message);
  });

  if (!order) {
    return {
      order: null,
    };
  }

  const enrichedItems = await enrichLineItems(order.items);

  return {
    order: {
      ...order,
      items: enrichedItems as LineItem[],
    } as Order,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('orderCompleted.orderPlaced'),
    description: t('orderCompleted.orderPlacedDescription'),
  };
}

export default async function OrderConfirmedPage({ params }: Props) {
  const store = params.store;
  const price_list = await getPriceListProducts(PRICE_LIST_ID);
  const { order } = await getOrder(params.id);

  if (!order) {
    return (
      <main className="flex-1 grid place-items-center">
        <OrderCompletedEmptyState id={params.id} />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <OrderCompletedTemplate order={order} price_list={price_list} store={store} />
    </main>
  );
}
