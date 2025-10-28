import { BASE_MEDIA_URL } from '@/config/env';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { formatAmount } from '@/lib/medusa/utils';
import { Badge, Button } from '@mantine/core';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

type OrderCardProps = {
  order: Omit<Order, 'beforeInsert'>;
  store: any;
};

const OrderCard = ({ order, store }: OrderCardProps) => {
  const t = useTranslations();
  const numberOfLines = useMemo(() => {
    return order.items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }, [order]);

  const numberOfProducts = useMemo(() => {
    return order.items.length;
  }, [order]);

  const cancelBtnCheck = order.status !== 'canceled' && order.status !== 'completed';

  return (
    <div className="bg-white flex flex-col p-6 rounded-[20px]">
      <div className="mb-1 justify-between flex items-center">
        <div className="uppercase text-lg font-bold">#{order.display_id}</div>
        <Badge
          color={
            order.status === 'completed' ? 'green' : order.status === 'canceled' ? 'red' : 'orange'
          }
          size="lg"
          variant="filled"
        >
          {order.status}
        </Badge>
      </div>
      <div className="flex items-center divide-x divide-base-200 text-sm">
        <span className="pr-2">{new Date(order.created_at).toDateString()}</span>
        <span className="px-2">
          {formatAmount({
            amount: order.total,
            region: order.region,
            includeTaxes: false,
          })}
        </span>
        <span className="pl-2">{`${numberOfLines} ${numberOfLines > 1 ? 'items' : 'item'}`}</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4 spacer">
        {order.items.slice(0, 3).map((i) => {
          return (
            <div key={i.id} className="flex flex-col gap-y-2">
              <div className="aspect-[4/3] relative h-24">
                <Image
                  fill
                  alt="Product image"
                  className="object-contain object-center"
                  fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
                  src={`${BASE_MEDIA_URL}/${i.variant.sku}.png`}
                />
              </div>
              <div className="flex items-center text-sm">
                <span>{i.title}</span>
                <span className="ml-2">x</span>
                <span>{i.quantity}</span>
              </div>
              <div className="text-sm text-gray-500">{i.variant?.sku}</div>
            </div>
          );
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-sm">+ {numberOfLines - 4}</span>
            <span className="text-sm">{t('accountOrders.more')}</span>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        {cancelBtnCheck && (
          <Button
            component={Link}
            href={`/${store}/account/orders/canceled/${order.id}`}
            variant="default"
          >
            Cancel Order
          </Button>
        )}
        <Button
          component={Link}
          href={`/${store}/account/orders/details/${order.id}`}
          variant="default"
        >
          {t('accountOrders.seeDetails')}
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
