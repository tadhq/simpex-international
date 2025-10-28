import { Icon } from '@/components/iconify';
import { defaultRegion } from '@/config/medusa';
import Image from '@/lib/mantine/Image';
import { Button } from '@mantine/core';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import type { Route } from 'next';
import Link from 'next/link';
import ProductPrice from './ProductPrice';

interface Props {
  product: PricedProduct;
  buttonText: string;
  currency?: string;
}

export default function ProductCardWide({ product, buttonText, currency }: Props) {
  // TODO get region
  const region = { ...defaultRegion, currency_code: currency as string };
  // Product has only one variant
  const variant = product.variants[0];

  return (
    <div className="flex h-full">
      <div className="flex-none w-[36%] p-4 aspect-square relative">
        <Image
          fill
          alt="Product image"
          className="object-contain object-center"
          src={product.thumbnail}
        />
      </div>
      <div className="flex flex-col justify-center p-4">
        <div className="space-y-1">
          <h3 className="font-bold leading-snug">{product.title}</h3>
          <ProductPrice product={product} region={region} variant={variant} version="box" />
          <p className="text-sm text-base-600 line-clamp-2">{product.description}</p>
        </div>
        <Button
          className="self-start mt-3"
          color="secondary"
          component={Link}
          href={`/products/${product.handle}` as Route}
          rightSection={<Icon height={16} icon="ph:arrow-right-bold" />}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
