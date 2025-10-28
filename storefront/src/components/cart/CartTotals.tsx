// TODO refactor

import { formatAmount } from '@/lib/medusa/utils';
import type { Cart, Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';

interface Props {
  data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
}

// TODO translate
export default function CartTotals({ data }: Props) {
  const { subtotal, discount_total, gift_card_total, tax_total, shipping_total, total } = data;
  const t = useTranslations();

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: data.region,
      includeTaxes: false,
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-y-2 text-base-700">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">{t('money.subtotal')}</span>
          <span>{getAmount(subtotal)}</span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>{t('money.discount')}</span>
            <span className="text-ui-fg-interactive">- {getAmount(discount_total)}</span>
          </div>
        )}
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>{t('money.giftcard')}</span>
            <span className="text-ui-fg-interactive">- {getAmount(gift_card_total)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>{t('money.shipping')}</span>
          <span>{getAmount(shipping_total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center">{t('money.taxes')}</span>
          <span>{getAmount(tax_total)}</span>
        </div>
      </div>
      <div className="h-px w-full border-b border-base-200 my-4" />
      <div className="flex items-center justify-between mb-2 font-bold">
        <span>{t('money.total')}</span>
        <span className="txt-xlarge-plus">{getAmount(total)}</span>
      </div>
      <div className="h-px w-full border-b border-base-200 mt-4" />
    </div>
  );
}
