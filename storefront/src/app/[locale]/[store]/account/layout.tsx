import { getCustomer } from '@/lib/medusa/api';
import AccountLayout from '@/modules/account/templates/account-layout';
import { redirect } from 'next/navigation';

interface Props extends React.PropsWithChildren {
  params: { locale: string; store: string };
}

export default async function AccountPageLayout({ children, params }: Props) {
  const store = params.store;
  const customer = await getCustomer().catch(() => null);

  if (!customer) {
    redirect(`/${store}/auth`);
  }

  return (
    <AccountLayout customer={customer} store={store}>
      {children}
    </AccountLayout>
  );
}
