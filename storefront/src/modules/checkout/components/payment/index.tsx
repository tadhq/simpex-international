'use client';

import ErrorMessage from '@/modules/checkout/components/error-message';
import { RadioGroup } from '@headlessui/react';
import { Cart } from '@medusajs/medusa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Icon } from '@/components/iconify';
import { setPaymentMethod } from '@/modules/checkout/actions';
import PaymentContainer from '@/modules/checkout/components/payment-container';
import { Badge, Button, Divider, Loader, Title } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';
import { usePaymentInfoMap } from '../../payments';

const Payment = ({ cart }: { cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null }) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get('step') === 'payment';

  const paymentReady = cart?.payment_session && cart?.shipping_methods.length !== 0;

  const { paymentInfoMap } = usePaymentInfoMap();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const set = async (providerId: string) => {
    setIsLoading(true);
    await setPaymentMethod(providerId)
      .catch((err) => setError(err.toString()))
      .finally(() => {
        if (providerId === 'paypal') return;
        setIsLoading(false);
      });
  };

  const handleChange = (providerId: string) => {
    setError(null);
    set(providerId);
  };

  const handleEdit = () => {
    router.push(pathname + '?' + createQueryString('step', 'payment'), {
      scroll: false,
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    router.push(pathname + '?' + createQueryString('step', 'review'), {
      scroll: false,
    });
  };

  useEffect(() => {
    setIsLoading(false);
    setError(null);
  }, [isOpen]);

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Title
          className={cn('flex flex-row text-3xl-regular gap-x-2 items-center', {
            'opacity-50 pointer-events-none select-none': !isOpen && !paymentReady,
          })}
          order={3}
        >
          <Badge circle size="lg" variant="default">
            3
          </Badge>
          {t('checkout.payment')}
          {!isOpen && paymentReady && <Icon icon="ph:circle-check-circle-bold" />}
        </Title>
        {!isOpen && paymentReady && (
          <p>
            <Button variant="default" onClick={handleEdit}>
              {t('global.buttons.edit')}
            </Button>
          </p>
        )}
      </div>
      <div>
        {cart?.payment_sessions?.length ? (
          <div className={isOpen ? 'block' : 'hidden'}>
            <RadioGroup
              value={cart.payment_session?.provider_id || ''}
              onChange={(value: string) => handleChange(value)}
            >
              {cart.payment_sessions
                .filter((session) => session.provider_id !== 'manual')
                .sort((a, b) => {
                  return a.provider_id > b.provider_id ? 1 : -1;
                })
                .map((paymentSession) => {
                  return (
                    <PaymentContainer
                      key={paymentSession.id}
                      paymentInfoMap={paymentInfoMap}
                      paymentSession={paymentSession}
                      selectedPaymentOptionId={cart.payment_session?.provider_id || null}
                    />
                  );
                })}
            </RadioGroup>

            <ErrorMessage error={error} />

            <Button
              className="mt-6"
              disabled={!cart.payment_session}
              loading={isLoading}
              size="md"
              onClick={handleSubmit}
            >
              {t('global.buttons.continueToReview')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-16">
            <Loader />
          </div>
        )}

        <div className={isOpen ? 'hidden' : 'block'}>
          {cart && paymentReady && cart.payment_session && (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3 gap-0.5">
                <p className="font-bold mb-1">{t('checkout.paymentMethod')}</p>
                <p className="text-base-700">
                  {paymentInfoMap[cart.payment_session.provider_id]?.title ||
                    cart.payment_session.provider_id}
                </p>
              </div>
              <div className="flex flex-col w-2/5 gap-0.5">
                <p className="font-bold mb-1">{t('checkout.paymentDetails')}</p>
                <div className="flex gap-2 text-base-700 items-center">
                  <div className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[cart.payment_session.provider_id]?.icon || (
                      <Icon icon="ph:credit-card-bold" />
                    )}
                  </div>
                  <p>
                    {cart.payment_session.provider_id === 'stripe' && cardBrand ? cardBrand : ''}
                    {cart.payment_session.provider_id === 'bank-transfer' &&
                      t('checkout.payBankTransfer')}
                    {cart.payment_session.provider_id === 'cash' && t('checkout.payCash')}
                    {cart.payment_session.provider_id === 'pin-on-delivery' &&
                      t('checkout.payPinOnDelivery')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default Payment;
