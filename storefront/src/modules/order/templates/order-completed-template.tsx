import CartTotals from '@/components/cart/CartTotals';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import Items from '@/modules/order/components/items';
import OrderDetails from '@/modules/order/components/order-details';
import PaymentDetails from '@/modules/order/components/payment-details';
import ShippingDetails from '@/modules/order/components/shipping-details';
import { Title } from '@mantine/core';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';

type OrderCompletedTemplateProps = {
  order: Order;
  price_list: any;
  store: string;
};

export default function OrderCompletedTemplate({
  order,
  price_list,
  store,
}: OrderCompletedTemplateProps) {
  const t = useTranslations();

  return (
    <section className="py-6">
      <MotionDiv
        className="container flex flex-col justify-center items-center gap-y-10 max-w-5xl h-full w-full"
        {...fadeInUpEaseProps}
      >
        <div className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full p-6 md:p-10 rounded-[20px] shadow-lg">
          <Title className="flex flex-col gap-y-3  text-3xl mb-4" order={2}>
            <span>{t('orderCompleted.thankYou')}</span>
            <span>{t('orderCompleted.orderPlacedSuccessfully')}</span>
          </Title>
          <OrderDetails order={order} />
          <Title className="flex flex-row text-3xl-regular" order={3}>
            {t('cart.summary')}
          </Title>
          <Items items={order.items} price_list={price_list} region={order.region} store={store} />
          <CartTotals data={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
        </div>
      </MotionDiv>
    </section>
  );
}
