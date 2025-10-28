import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { formatAmount } from '../price/utils';
import { CalculatedVariant, RegionInfo } from '../types';
import { PRICE_LIST_ID } from '@/config/env';

export function getProductPrice({
  price_list,
  product,
  variantId,
  region,
}: {
  price_list: any;
  product: PricedProduct;
  variantId?: string;
  region: RegionInfo;
}) {
  if (!product || !product.id) {
    throw new Error('No product provided');
  }

  const getPercentageDiff = (original: number, calculated: number) => {
    if (!original || original === 0) return '0';
    const diff = original - calculated;
    const decrease = (diff / original) * 100;
    return decrease.toFixed();
  };

  const getRawPrice = (variant: CalculatedVariant): number => {
    const match = variant.prices?.find(
      (p) => p.currency_code?.toLowerCase() === region.currency_code?.toLowerCase()
    );
    return match?.amount ?? 0;
  };

  const cheapestPrice = () => {
    if (!product || !product.variants?.length || !region) return null;

    const variants = product.variants as unknown as CalculatedVariant[];

    const cheapestVariant = variants.reduce((prev, curr) => {
      const prevPrice = prev.calculated_price ?? getRawPrice(prev);
      const currPrice = curr.calculated_price ?? getRawPrice(curr);
      return prevPrice < currPrice ? prev : curr;
    });

    const calculated = cheapestVariant.calculated_price ?? getRawPrice(cheapestVariant);
    const original = cheapestVariant.original_price ?? getRawPrice(cheapestVariant);

    return {
      calculated_price: formatAmount({
        amount: calculated,
        region,
        includeTaxes: false,
      }),
      original_price: formatAmount({
        amount: original,
        region,
        includeTaxes: false,
      }),
      price_type: cheapestVariant.calculated_price_type ?? 'default',
      percentage_diff: getPercentageDiff(original, calculated),
    };
  };

  const variantPrice = () => {
    if (!product || !variantId || !region) return null;

    const variant = product.variants.find(
      (v) => v.id === variantId || v.sku === variantId
    ) as unknown as CalculatedVariant;

    if (!variant) return null;

    const calculated = variant.calculated_price ?? getRawPrice(variant);
    const original = variant.original_price ?? getRawPrice(variant);

    return {
      calculated_price: formatAmount({
        amount: calculated,
        region,
        includeTaxes: false,
      }),
      original_price: formatAmount({
        amount: original,
        region,
        includeTaxes: false,
      }),
      price_type: variant.calculated_price_type ?? 'default',
      percentage_diff: getPercentageDiff(original, calculated),
    };
  };

  const priceListPrice = () => {
    if (!price_list || !variantId || !region) return null;

    const variant = price_list.variants.find(
      (v: any) => v.id === variantId
    ) as unknown as CalculatedVariant;

    if (!variant) return null;

    const price = variant.prices.find(
      (p: any) =>
        (p.price_list_id === PRICE_LIST_ID || p.price_list?.id === PRICE_LIST_ID) &&
        p.currency_code === region.currency_code
    );

    if (!price) return null;

    const original = price.amount;

    return {
      calculated_price: formatAmount({
        amount: original,
        region,
        includeTaxes: false,
      }),
      original_price: formatAmount({
        amount: original,
        region,
        includeTaxes: false,
      }),
      price_type: 'default',
      percentage_diff: getPercentageDiff(original, original),
    };
  };

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
    listPrice: priceListPrice(),
  };
}
