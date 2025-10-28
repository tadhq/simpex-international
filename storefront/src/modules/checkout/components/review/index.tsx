'use client';

import { Badge, Title } from '@mantine/core';
import { Cart } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import PaymentButton from '../payment-button';

const Review = ({
  cart,
  store,
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  store: string;
}) => {
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('step') === 'review';

  const previousStepsCompleted =
    cart.shipping_address && cart.shipping_methods.length > 0 && cart.payment_session;

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Title
          className={cn('flex flex-row text-3xl-regular gap-x-2 items-center', {
            'opacity-50 pointer-events-none select-none': !isOpen,
          })}
          order={3}
        >
          <Badge circle size="lg" variant="default">
            4
          </Badge>
          {t('review')}
        </Title>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <p className="mb-1">{t('reviewDescription')}</p>
            </div>
          </div>
          <PaymentButton cart={cart} store={store} />
        </>
      )}
    </div>
  );
};

export default Review;
