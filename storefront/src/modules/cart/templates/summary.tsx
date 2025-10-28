'use client';

import CartTotals from '@/components/cart/CartTotals';
import { CartWithCheckoutStep } from '@/lib/medusa/types';
import DiscountCode from '@/modules/checkout/components/discount-code';
import { Button, Divider, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type SummaryProps = {
  cart: CartWithCheckoutStep;
};

const Summary = ({ cart }: SummaryProps) => {
  const t = useTranslations();
  const params = useParams(); // Read the [store] parameter
  const store = params.store; // Access the store value (e.g., 'retail' or 'webshop')

  return (
    <div className="flex flex-col gap-y-4">
      <Title className="text-[2rem] leading-[2.75rem]" order={3}>
        {t('cart.summary')}
      </Title>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals data={cart} />
      <Button
        className="w-full h-10"
        component={Link}
        href={`/${store}/checkout?step=` + cart.checkout_step}
      >
        {t('global.buttons.goToCheckout')}
      </Button>
    </div>
  );
};

export default Summary;
