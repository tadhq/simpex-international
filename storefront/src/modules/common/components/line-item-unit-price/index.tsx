import { PRICE_LIST_ID } from '@/config/env';
import { CalculatedVariant } from '@/lib/medusa/types';
import { formatAmount, getPercentageDiff } from '@/lib/medusa/utils';
import { LineItem, Region } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';

type LineItemUnitPriceProps = {
  item: Omit<LineItem, 'beforeInsert'>;
  region: Region;
  style?: 'default' | 'tight';
  price_list?: any;
  store: string; // Add params to check the store
};

const LineItemUnitPrice = ({
  item,
  region,
  style = 'default',
  price_list,
  store,
}: LineItemUnitPriceProps) => {
  const t = useTranslations();

  if (store === 'wholesale' && price_list) {
    // Wholesale-specific logic
    const variant = price_list.variants.find(
      (v: any) => v.id === item.variant_id
    ) as unknown as CalculatedVariant;

    if (!variant) return null;

    const price =
      variant.prices.find(
        (p: any) =>
          (p.price_list_id === PRICE_LIST_ID || p.price_list?.id === PRICE_LIST_ID) &&
          p.currency_code === region.currency_code
      )?.amount || 0;

    const hasReducedPrice = (price * item.quantity || 0) > item.total!;
    const totalItems = price * item.quantity;
    const reducedPrice = (totalItems || 0) / item.quantity!;

    return (
      <div className="flex flex-col text-ui-fg-muted justify-center h-full">
        {hasReducedPrice && (
          <>
            <p>
              {style === 'default' && (
                <span className="text-ui-fg-muted">{t('product.original')}: </span>
              )}
              <span className="line-through">
                {formatAmount({
                  amount: price,
                  region: region,
                  includeTaxes: false,
                })}
              </span>
            </p>
            {style === 'default' && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(price, reducedPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className={cn('text-base-regular', {
            'text-ui-fg-interactive': hasReducedPrice,
          })}
        >
          {formatAmount({
            amount: reducedPrice || item.unit_price || 0,
            region: region,
            includeTaxes: false,
          })}
        </span>
      </div>
    );
  }

  // Default logic for non-wholesale stores
  const originalPrice = (item.variant as CalculatedVariant).original_price;
  const hasReducedPrice = (originalPrice * item.quantity || 0) > item.total!;
  const reducedPrice = (item.total || 0) / item.quantity!;

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === 'default' && (
              <span className="text-ui-fg-muted">{t('product.original')}: </span>
            )}
            <span className="line-through">
              {formatAmount({
                amount: originalPrice,
                region: region,
                includeTaxes: false,
              })}
            </span>
          </p>
          {style === 'default' && (
            <span className="text-ui-fg-interactive">
              -{getPercentageDiff(originalPrice, reducedPrice || 0)}%
            </span>
          )}
        </>
      )}
      <span
        className={cn('text-base-regular', {
          'text-ui-fg-interactive': hasReducedPrice,
        })}
      >
        {formatAmount({
          amount: reducedPrice || item.unit_price || 0,
          region: region,
          includeTaxes: false,
        })}
      </span>
    </div>
  );
};

export default LineItemUnitPrice;
