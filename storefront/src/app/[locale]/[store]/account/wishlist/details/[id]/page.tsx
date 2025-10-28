import { PRICE_LIST_ID } from '@/config/env';
import { cancelOrder, getPriceListProducts, retrieveOrder } from '@/lib/medusa/api';
import OrderDetailsTemplate from '@/modules/order/templates/order-details-template';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    store: string;
    locale: string;
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order = await retrieveOrder(params.id).catch(() => null);
  const t = await getTranslations();

  if (!order) {
    notFound();
  }

  return {
    title: t('accountOrders.orderDetailsTitle', { display_id: order.display_id }),
    description: t('accountOrders.metaOrderDetailsDescription'),
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const store = params.store;
  const price_list = await getPriceListProducts(PRICE_LIST_ID);

  try {
    const order = await retrieveOrder(params.id);
    if (!order) {
      notFound();
    }

    // Optional: Handle cancellation separately if needed
    try {
      await cancelOrder(params.id);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      // You can log this error or show a non-blocking message to the user
    }

    return <OrderDetailsTemplate order={order} price_list={price_list} store={store} />;
  } catch (error) {
    console.error('Failed to retrieve order:', error);
    notFound(); // Redirect to a 404 page if the order cannot be retrieved
  }
}
