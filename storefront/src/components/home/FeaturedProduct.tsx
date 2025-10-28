import { ProductCardWide } from '@/components/product';
import { getCurrency, getPricedProductByHandle } from '@/lib/medusa/server';
import { getTranslations } from 'next-intl/server';

interface Props {
  handle: string | null;
}

export default async function FeaturedProduct({ handle }: Props) {
  if (!handle) return null;

  const t = await getTranslations('global');
  const currency = await getCurrency();
  const product = await getPricedProductByHandle(handle, { currency });

  return (
    <ProductCardWide
      buttonText={t('buttons.shopNow')}
      currency={currency}
      product={product as any}
    />
  );
}
