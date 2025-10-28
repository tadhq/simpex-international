import { getCustomer, listCustomerOrders } from '@/lib/medusa/api';
import Overview from '@/modules/account/components/overview';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; store: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: 'Account',
    description: t('account.metaAccountDescription'),
  };
}

export default async function OverviewTemplate({ params }: Props) {
  const store = params.store;
  const customer = await getCustomer().catch(() => null);
  const orders = (await listCustomerOrders().catch(() => null)) || null;

  if (!customer) {
    redirect(`/${store}/auth/login`);
  }

  return <Overview customer={customer} orders={orders} store={store} />;
}
