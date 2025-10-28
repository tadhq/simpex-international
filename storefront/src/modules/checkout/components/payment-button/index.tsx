'use client';

import { placeOrder } from '@/modules/checkout/actions';
import { Button } from '@mantine/core';
import { Cart, PaymentSession } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ErrorMessage from '../error-message';

type PaymentButtonProps = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  store: string;
};

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart, store }) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    cart.shipping_methods.length < 1
      ? true
      : false;

  const paymentSession = cart.payment_session as PaymentSession;
  const t = useTranslations();
  switch (paymentSession.provider_id) {
    case 'manual':
      return <ManualTestPaymentButton notReady={notReady} store={store} />;
    case 'bank-transfer':
      return <ManualTestPaymentButton notReady={notReady} store={store} />;
    case 'cash':
      return <ManualTestPaymentButton notReady={notReady} store={store} />;
    case 'pin-on-delivery':
      return <ManualTestPaymentButton notReady={notReady} store={store} />;
    default:
      return <Button disabled>{t('global.buttons.selectPaymentMethod')}</Button>;
  }
};

const ManualTestPaymentButton = ({ notReady, store }: { notReady: boolean; store: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPaymentCompleted = async () => {
    await placeOrder(store).catch((err) => {
      setErrorMessage(err.toString());
      setSubmitting(false);
    });
  };

  const handlePayment = () => {
    setSubmitting(true);

    onPaymentCompleted();
  };

  const t = useTranslations();

  return (
    <>
      <Button disabled={notReady} loading={submitting} size="md" onClick={handlePayment}>
        {t('global.buttons.placeOrder')}
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  );
};

export default PaymentButton;
