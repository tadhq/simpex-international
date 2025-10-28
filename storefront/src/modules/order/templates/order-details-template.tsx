'use client';

import { DIRECTUS_URL } from '@/config/env';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import Items from '@/modules/order/components/items';
import OrderDetails from '@/modules/order/components/order-details';
import OrderSummary from '@/modules/order/components/order-summary';
import { Title } from '@mantine/core';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import OrderDownloadPDFButton from '../components/download-pdf';
import ShippingDetails from '../components/shipping-details';

type OrderDetailsTemplateProps = {
  order: Order;
  price_list: any;
  store: string;
};

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
  price_list,
  store,
}) => {
  const [onPdfDownload, setOnPdfDownload] = useState(false);
  const t = useTranslations('accountOrders');

  return (
    <div
      id="order-details"
      style={{
        padding: onPdfDownload ? '2rem' : undefined,
      }}
    >
      <MotionDiv
        className={`flex flex-col justify-center gap-y-4  ${
          onPdfDownload ? '' : 'bg-white rounded-[20px] p-6'
        }`}
        {...fadeInUpEaseProps}
        transition={{
          ...fadeInUpEaseProps.transition,
          delay: 0.1,
        }}
      >
        <div className="flex gap-2 justify-between sm:items-center">
          <Title order={3}>{t('orderDetails')}</Title>
          {onPdfDownload && (
            <div>
              <img
                alt="Logo"
                className="w-44"
                src={`${DIRECTUS_URL}/assets/4972e4dc-d1fe-4f2d-a710-c4f55d64f78d`}
              />
            </div>
          )}
          {!onPdfDownload && (
            <div className="flex gap-4 flex-col sm:flex-row">
              <Link
                className="flex gap-2 items-center text-primary-600 justify-end"
                href="/account/orders"
                prefetch={false}
              >
                {t('backToOverview')}
              </Link>
              <div className="sm:-order-1">
                <OrderDownloadPDFButton
                  filename={`Order ${order.display_id} - ${order.customer.first_name} ${order.customer.last_name}`}
                  onChange={setOnPdfDownload}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 h-full w-full">
          <OrderDetails showStatus order={order} />
          <Items
            hideImage={onPdfDownload}
            items={order.items}
            price_list={price_list}
            region={order.region}
            store={store}
          />
          <ShippingDetails order={order} />
          <OrderSummary order={order} />
        </div>
      </MotionDiv>
    </div>
  );
};

export default OrderDetailsTemplate;
