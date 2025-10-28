import ShopAllTemplate from '@/components/shop/ShopAllTemplate';
import { PRICE_LIST_ID } from '@/config/env';
import { getShopSettings } from '@/lib/directus/api';
import { DirectusFile } from '@/lib/directus/types';
import { getCustomer, getPriceListProducts } from '@/lib/medusa/api';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export default async function Page({ params }: Props) {
  const shopSettings = await getShopSettings();
  const accessToken = cookies().get('_medusa_jwt')?.value;
  const customer = await getCustomer(accessToken);
  const price_list = await getPriceListProducts(PRICE_LIST_ID);

  return (
    <main className="flex-1">
      <ShopAllTemplate
        price_list={price_list}
        customerProp={customer}
        emptyStateImage={shopSettings?.image_empty_state as DirectusFile}
      />
    </main>
  );
}
