'use client';

import { useState } from 'react';
import { MedusaClientContext } from './MedusaClientContext';

interface Props extends React.PropsWithChildren {
  currency: string | undefined;
  defaultCurrency: string;
}

export default function MedusaClientProvider({ children, currency, defaultCurrency }: Props) {
  const [state] = useState({
    currency: currency ?? defaultCurrency,
  });

  return <MedusaClientContext.Provider value={state}>{children}</MedusaClientContext.Provider>;
}
