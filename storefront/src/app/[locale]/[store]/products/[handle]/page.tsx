import { BreadcrumbsSection } from '@/components/common';
import { ProductDetailsTemplate } from '@/components/product-details';
import { medusaApi } from '@/lib/medusa/common';
import { getCurrency, getPricedProductByHandle } from '@/lib/medusa/server';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; handle: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await medusaApi.getProductByHandle(params.handle);

  if (!product) notFound();

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const t = await getTranslations('global');
  const currency = await getCurrency();
  const pricedProduct = await getPricedProductByHandle(params.handle, { currency });

  if (!pricedProduct) notFound();

  const category = pricedProduct.categories?.[0];

  return (
    <main className="flex-1">
      <BreadcrumbsSection
        items={[
          { label: t('pages.home'), url: '/' },
          {
            label: category?.name || t('pages.shop'),
            url: category?.id ? `/shop/${category.id}` : '/shop',
          },
          { label: pricedProduct.title || t('pages.product') },
        ]}
      />
      <ProductDetailsTemplate product={pricedProduct} />
    </main>
  );
}
