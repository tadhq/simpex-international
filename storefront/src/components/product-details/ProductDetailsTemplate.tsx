import { BASE_MEDIA_URL } from '@/config/env';
import { defaultRegion } from '@/config/medusa';
import { getProductDeals } from '@/lib/directus/api/deals';
import { getCurrency } from '@/lib/medusa/server';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Badge } from '@mantine/core';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import ImageGallery from './ImageGallery';
import ProductBox from './ProductBox';
import ProductInfo from './ProductInfo';

interface Props {
  product: PricedProduct;
}

export default async function ProductDetailsTemplate({ product }: Props) {
  const currency = await getCurrency();
  // TODO get region
  const region = { ...defaultRegion, currency_code: currency as string };
  // Product has only one variant
  const variant = product.variants[0];

  const deals = await getProductDeals();
  const featured_deals = (deals || []).flatMap(
    (d) => (d.product_deals as { handle: string; deal_price?: number }[]) || []
  );

  return (
    <div className="sm:flex gap-6 mt-8 bg-white p-6 md:p-8 xl:p-12 pt-7 pb-16 mb-20 rounded-[20px] mx-4 xl:container">
      <main className="flex-1">
        <section className="grid grid-cols-12 gap-6">
          <MotionDiv
            className="relative col-span-12 lg:col-span-6 border-2 rounded-xl lg:rounded-2xl border-primary-50 py-8"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.2,
            }}
          >
            {featured_deals.some((deal) => deal.handle === product.handle) && (
              <div className="absolute top-4 right-[-20px] z-10 rotate-6">
                <Badge className="px-6 py-1" color="red" size="lg" variant="filled">
                  Deal
                </Badge>
              </div>
            )}

            <ImageGallery
              images={`${BASE_MEDIA_URL}/${product.metadata?.item_code}.png`}
              picture={`${BASE_MEDIA_URL}/${product.metadata?.item_code}.png`}
            />
          </MotionDiv>
          <MotionDiv
            className="col-span-12 lg:col-span-6 md:ml-4"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.3,
            }}
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <p className="text-base-600 text-sm">
                Item code: {product.metadata?.item_code as string}
              </p>
              <div className="sm:hidden">
                <ProductBox
                  featured_deals={featured_deals}
                  product={product}
                  region={region}
                  variant={variant}
                />
              </div>
              <ProductInfo product={product} />
            </div>
          </MotionDiv>
        </section>
      </main>
      <aside className="sm:max-w-xs flex-1 sm:sticky top-[80px] md:top-[136px] self-start hidden sm:block">
        <MotionDiv
          {...fadeInUpEaseProps}
          transition={{
            ...fadeInUpEaseProps.transition,
            delay: 0.4,
          }}
        >
          <ProductBox
            featured_deals={featured_deals}
            product={product}
            region={region}
            variant={variant}
          />
        </MotionDiv>
      </aside>
    </div>
  );
}
