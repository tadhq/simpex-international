'use client';

import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Title, Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type OrderCanceledTemplateProps = {
  orderId: string;
};

const OrderCanceledTemplate: React.FC<OrderCanceledTemplateProps> = ({ orderId }) => {
  const t = useTranslations('accountOrders');

  return (
    <div id="order-canceled" className="flex flex-col items-center justify-center h-full p-6">
      <MotionDiv
        className="bg-white rounded-[20px] p-6 flex flex-col items-center gap-y-4"
        {...fadeInUpEaseProps}
        transition={{
          ...fadeInUpEaseProps.transition,
          delay: 0.1,
        }}
      >
        <Title order={3} className="text-center">
          Order
        </Title>
        <p className="text-center text-gray-600">Canceled : {orderId}</p>
        <div className="flex gap-4 mt-4">
          <Button component={Link} href="/account/orders" variant="default">
            Back to Orders
          </Button>
          <Button component={Link} href="/" variant="filled">
            Back to
          </Button>
        </div>
      </MotionDiv>
    </div>
  );
};

export default OrderCanceledTemplate;
