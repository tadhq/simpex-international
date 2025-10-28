import { BreadcrumbsSection } from '@/components/common';
import { PRICE_LIST_ID } from '@/config/env';
import { getPriceListProducts } from '@/lib/medusa/api';
import { fetchCartWithCheckoutStep } from '@/lib/medusa/cart/server';
import { medusaApi } from '@/lib/medusa/common';
import { getCurrency } from '@/lib/medusa/server';
import CartTemplate from '@/modules/cart/templates';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations('global');

  return {
    title: t('pages.cart'),
  };
}

export default async function Page() {
  const t = await getTranslations('global');
  // TODO move currency to server action
  const currency = await getCurrency();
  const cart = await fetchCartWithCheckoutStep({ currency });
  const customer = await medusaApi.getCustomer();
  const price_list = await getPriceListProducts(PRICE_LIST_ID);

  return (
    <main className="flex-1">
      <BreadcrumbsSection
        items={[{ label: t('pages.home'), url: '/' }, { label: t('pages.cart') }]}
      />
      <CartTemplate cart={cart} customer={customer} price_list={price_list} />
    </main>
  );
}
