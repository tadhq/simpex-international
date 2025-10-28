'use client';

import { formatAmount } from '@/lib/medusa/utils';
import { useShippingInfoMap } from '@/modules/checkout/shipping';
import { Divider, Title } from '@mantine/core';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';

type ShippingDetailsProps = {
  order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const t = useTranslations();
  const { shippingInfoMap } = useShippingInfoMap();

  return (
    <div>
      <Title className="flex flex-row text-3xl-regular my-6" order={3}>
        {t('checkout.delivery')}
      </Title>
      <div className="flex items-start gap-x-8">
        <div className="flex flex-col w-1/3 gap-0.5">
          <p className="font-bold mb-1">{t('checkout.shippingAddress')}</p>
          <p className="text-base-700">
            {order.shipping_address.first_name} {order.shipping_address.last_name}
          </p>
          <p className="text-base-700">
            {order.shipping_address.address_1} {order.shipping_address.address_2}
          </p>
          <p className="text-base-700">
            {order.shipping_address.postal_code ? `${order.shipping_address.postal_code}, ` : ''}
            {order.shipping_address.city}
          </p>
          <p className="text-base-700">{order.shipping_address.country_code?.toUpperCase()}</p>
        </div>

        <div className="flex flex-col w-1/3 gap-0.5">
          <p className="font-bold mb-1">Contact</p>
          <p className="text-base-700">{order.shipping_address.phone}</p>
          <p className="text-base-700 break-words">{order.email}</p>
        </div>

        <div className="flex flex-col w-1/3 gap-0.5">
          <p className="font-bold mb-1">{t('checkout.method')}</p>
          <p className="text-base-700">
            {order.shipping_methods[0].shipping_option?.name === 'pickup-from-store'
              ? shippingInfoMap[order.shipping_methods[0].shipping_option?.name]?.title
              : order.shipping_methods[0].shipping_option?.name}{' '}
            {order.shipping_methods[0].shipping_option?.name !== 'pickup-from-store' && (
              <>
                (
                {formatAmount({
                  amount: order.shipping_methods[0].price,
                  region: order.region,
                  includeTaxes: false,
                })
                  .replace(/,/g, '')
                  .replace(/\./g, ',')}
                )
              </>
            )}
          </p>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default ShippingDetails;
