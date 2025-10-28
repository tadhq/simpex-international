import { RegionInfo } from '@/lib/medusa/types';
import { getProductPrice } from '@/lib/medusa/utils';
import type { PricedProduct, PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import { useTranslations } from 'next-intl';

interface Props {
  product: PricedProduct;
  variant?: PricedVariant;
  region: RegionInfo;
  /** Different version of styling */
  version?: 'card' | 'box';
  appearance?: 'tight';
  dealPrice?: number;
  price_list?: any;
  store?: any;
}

// TODO unify this logic
export default function ProductPrice({
  product,
  variant,
  region,
  version,
  appearance,
  dealPrice,
  price_list,
  store,
}: Props) {
  const t = useTranslations('product');

  const { cheapestPrice, variantPrice, listPrice } = getProductPrice({
    price_list,
    product,
    variantId: variant?.id,
    region,
  });

  const selectedPrice = variant
    ? store === 'wholesale'
      ? listPrice
      : variantPrice
    : cheapestPrice;

  if (!selectedPrice) return null;

  const isSale = selectedPrice.price_type === 'sale';

  if (version === 'card') {
    return (
      <div>
        {dealPrice != null ? (
          <div className="flex items-baseline gap-2">
            <p className="text-sm line-through text-gray-500">
              {selectedPrice.original_price || selectedPrice.calculated_price}
            </p>
            <p className="font-extrabold text-primary-500">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: region.currency_code || 'USD',
              }).format(dealPrice)}
            </p>
          </div>
        ) : (
          <div>
            {/* <span className="text-red-600 text-sm mr-1">-{selectedPrice.percentage_diff}%</span> */}
            <span className="font-extrabold text-primary-500 text-xl">
              {selectedPrice.original_price}
            </span>
          </div>
          // <p>
          //   {!variant && <span className="text-xs opacity-50 mr-1">{t('priceFrom')}</span>}
          //   <span className="font-extrabold text-primary-500">{selectedPrice.calculated_price}</span>
          // </p>
          // {isSale && (
        )}
      </div>
    );
  }

  if (version === 'box') {
    return (
      <div>
        {dealPrice != null ? (
          <div className="flex items-baseline gap-3">
            <p className="text-md line-through text-gray-500">
              {selectedPrice.original_price || selectedPrice.calculated_price}
            </p>
            <p className="font-extrabold text-primary-500 text-xl">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: region.currency_code || 'USD',
              }).format(dealPrice)}
            </p>
          </div>
        ) : (
          <div>
            {/* <span className="text-red-600 text-sm mr-1">-{selectedPrice.percentage_diff}%</span> */}
            <span className="font-extrabold text-primary-500 text-xl">
              {selectedPrice.original_price}
            </span>
          </div>
          //   <span className="text-red-600">-{selectedPrice.percentage_diff}%</span>
          // </div>
        )}
      </div>
    );
  }

  if (appearance === 'tight') {
    return (
      <div>
        {!variant && <p className="text-xs opacity-50">{t('priceFrom')}</p>}
        <p className="text-sm font-bold text-primary-600">{selectedPrice.calculated_price}</p>
        {isSale && (
          <div>
            <p className="opacity-50 text-sm">
              <span>{t('priceOriginal')}: </span>
              <span className="line-through">{selectedPrice.original_price}</span>
            </p>
            <span className="text-red-600">-{selectedPrice.percentage_diff}%</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}
