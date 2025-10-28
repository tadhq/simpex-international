'use client';

import { PaymentSession } from '@medusajs/medusa';

interface Props extends React.PropsWithChildren {
  cart: any;
  children: React.ReactNode;
}

export default function Wrapper({ cart, children }: Props) {
  const paymentSession = cart.payment_session as PaymentSession;

  if (paymentSession?.provider_id === 'stripe' && cart) {
    return children;
  }

  return children;
}
