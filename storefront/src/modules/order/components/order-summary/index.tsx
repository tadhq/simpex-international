import { formatAmount } from '@/lib/medusa/utils';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const t = useTranslations();

  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return formatAmount({ amount: 0, region: order.region, includeTaxes: false });
    }

    return formatAmount({ amount, region: order.region, includeTaxes: false });
  };

  return (
    <div>
      <h2 className="font-bold">{t('accountOrders.orderSummary')}</h2>
      <div className="my-2">
        <div className="flex items-center justify-between mb-2">
          <span>{t('money.subtotal')}</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{t('money.discount')}</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{t('money.giftcard')}</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>{t('money.shipping')}</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{t('money.taxes')}</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-base-200 border-dashed my-4" />
        <div className="flex items-center justify-between font-bold text-lg mb-2">
          <span>{t('money.total')}</span>
          <span>{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
