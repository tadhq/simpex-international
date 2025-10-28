import { retrieveOrder, cancelOrder } from '@/lib/medusa/api';
import OrderCanceledTemplate from '@/modules/order/templates/order-deleted-template';
import OrderDetailsTemplate from '@/modules/order/templates/order-details-template';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
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
  const order = await retrieveOrder(params.id).catch(() => null);
  const cancel = await cancelOrder(params.id).catch(() => null);

  if (!order) {
    notFound();
  }

  if (!cancel) {
    notFound();
  } else {
    return <OrderCanceledTemplate orderId={order.id} />;
  }
}
