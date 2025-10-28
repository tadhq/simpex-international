import { CartEmptyState } from '@/components/cart';
import Wrapper from '@/components/checkout/Wrapper';
import { getCustomer } from '@/lib/medusa/api';
import { fetchCart, getCurrency } from '@/lib/medusa/server';
import CheckoutForm from '@/modules/checkout/templates/checkout-form';
import CheckoutSummary from '@/modules/checkout/templates/checkout-summary';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; store: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations('global');

  return {
    title: t('pages.checkout'),
  };
}

export default async function Page({ params }: Props) {
  const store = params.store;
  const customer = await getCustomer().catch(() => null);
  const currency = await getCurrency();
  const cart = await fetchCart({ currency });

  if (!customer) {
    redirect(`/${store}/auth/login`);
  }

  if (!cart) {
    notFound();
  }

  const cartId = cookies().get('_medusa_cart_id')?.value;

  if (!cartId) {
    return (
      <main className="flex-1 grid place-items-center">
        <CartEmptyState />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="container grid grid-cols-1 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_450px] gap-x-10 xl:gap-x-20 py-6">
        <Wrapper cart={cart}>
          <CheckoutForm store={store} />
        </Wrapper>
        <CheckoutSummary />
      </div>
    </main>
  );
}
