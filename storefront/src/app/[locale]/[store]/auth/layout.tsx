import { getCustomer } from '@/lib/medusa/api';
import { redirect } from 'next/navigation';

interface Props extends React.PropsWithChildren {
  params: { locale: string; store: string };
}

export default async function AccountPageLayout({ children, params }: Props) {
  const store = params.store;
  const customer = await getCustomer().catch(() => null);

  if (customer) {
    redirect(`/${store}/checkout?step=address`);
  }

  return <main className="flex-1">{children}</main>;
}
