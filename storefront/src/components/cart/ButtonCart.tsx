'use server';

import { defaultRegion } from '@/config/medusa';
import { fetchCart, getCurrency } from '@/lib/medusa/server';
import { formatAmount } from '@/lib/medusa/utils';
import ButtonCartElement from './ButtonCartElement';

export default async function ButtonCart() {
  const currency = await getCurrency();
  const { subtotal, totalItems } = await fetchCart({ currency });

  return (
    <ButtonCartElement
      indicatorProps={{
        disabled: !totalItems,
        label: totalItems,
      }}
    >
      {formatAmount({
        amount: subtotal || 0,
        region: { ...defaultRegion, currency_code: currency as string },
        includeTaxes: false,
      })}
    </ButtonCartElement>
  );
}
