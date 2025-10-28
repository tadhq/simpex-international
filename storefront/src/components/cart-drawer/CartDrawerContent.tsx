'use server';

import { defaultRegion } from '@/config/medusa';
import { fetchCart, getCurrency } from '@/lib/medusa/server';
import { formatAmount } from '@/lib/medusa/utils';
import { getTranslations } from 'next-intl/server';
import CartEmptyState from '../cart/CartEmptyState';
import CartDrawerButtons from './CartDrawerButtons';
import CartLineItemSmall from './CartLineItemSmall';

export default async function CartDrawerContent() {
  const t = await getTranslations();
  const currency = await getCurrency();
  const { items, subtotal } = await fetchCart({ currency });

  // Show new line items at the top
  const sortedItems = items?.sort((a, b) => (a.created_at > b.created_at ? -1 : 1));

  return (
    <>
      <main className="overflow-y-auto flex-1 px-4 pb-4 space-y-4">
        {sortedItems?.length ? (
          sortedItems.map((item) => (
            <CartLineItemSmall key={item.id} currency={currency} item={item} />
          ))
        ) : (
          <CartEmptyState />
        )}
      </main>
      <footer className="flex flex-col gap-2 border-t border-base-200 py-3 px-4 flex-none">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="font-bold text-sm">{t('money.subtotal')}</span>
            <span className="text-xs text-neutral-600 ml-1">{t('money.excludeTax')}</span>
          </div>
          <h3 className="text-lg font-bold truncate">
            {formatAmount({
              amount: subtotal || 0,
              region: { ...defaultRegion, currency_code: currency as string },
              includeTaxes: false,
            })}
          </h3>
        </div>
        <CartDrawerButtons />
      </footer>
    </>
  );
}
