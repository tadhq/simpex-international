import { PRICE_LIST_ID } from '@/config/env';
import { CalculatedVariant } from '@/lib/medusa/types';
import { formatAmount, getPercentageDiff } from '@/lib/medusa/utils';
import { LineItem, Region } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';

type LineItemPriceProps = {
  item: Omit<LineItem, 'beforeInsert'>;
  region: Region;
  style?: 'default' | 'tight';
  price_list?: any;
  store: string;
};

const LineItemPrice = ({
  item,
  region,
  style = 'default',
  price_list,
  store,
}: LineItemPriceProps) => {
  const t = useTranslations();

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

  const originalPrice = price * item.quantity;
  const totalPrice = price * item.quantity;
  const hasReducedPrice = (totalPrice || 0) < originalPrice;

  if (store === 'wholesale') {
    return (
      <div className="flex flex-col gap-x-2 text-base-600 items-end">
        <div className="text-left">
          {hasReducedPrice && (
            <>
              <p>
                {style === 'default' && (
                  <span className="text-base-600">{t('product.original')}: </span>
                )}
                <span className="line-through text-ui-fg-muted">
                  {formatAmount({
                    amount: originalPrice,
                    region: region,
                    includeTaxes: false,
                  })}
                </span>
              </p>
              {style === 'default' && (
                <span className="text-ui-fg-interactive">
                  -{getPercentageDiff(originalPrice, item.total || 0)}%
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
              amount: totalPrice || 0,
              region: region,
              includeTaxes: false,
            })}
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-x-2 text-base-600 items-end">
        <div className="text-left">
          {hasReducedPrice && (
            <>
              <p>
                {style === 'default' && (
                  <span className="text-base-600">{t('product.original')}: </span>
                )}
                <span className="line-through text-ui-fg-muted">
                  {formatAmount({
                    amount: originalPrice,
                    region: region,
                    includeTaxes: false,
                  })}
                </span>
              </p>
              {style === 'default' && (
                <span className="text-ui-fg-interactive">
                  -{getPercentageDiff(originalPrice, item.total || 0)}%
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
              amount: item.total || 0,
              region: region,
              includeTaxes: false,
            })}
          </span>
        </div>
      </div>
    );
  }
};

export default LineItemPrice;
