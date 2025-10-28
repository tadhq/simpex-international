import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';

type OrderDetailsProps = {
  order: Order;
  showStatus?: boolean;
};

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const t = useTranslations();
  const formatStatus = (str: string) => {
    const formatted = str.split('_').join(' ');

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
  };

  return (
    <div>
      <p>
        {t('orderCompleted.orderConfirmationDetailsSent')}{' '}
        <span className="text-ui-fg-medium-plus font-bold">{order.email}</span>.
      </p>
      <p className="mt-2">
        {t('orderCompleted.orderDate')}: {new Date(order.created_at).toDateString()}
      </p>
      <p className="mt-2 text-ui-fg-interactive">
        {t('orderCompleted.orderNumber')}: {order.display_id}
      </p>
      {(order.shipping_address?.metadata as any)?.purchase_order_number && (
        <p className="mt-2 text-ui-fg-interactive">
          {t('orderCompleted.purchaseOrderNumber')}:{' '}
          {(order.shipping_address?.metadata as any)?.purchase_order_number}
        </p>
      )}

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <p>
              {t('orderCompleted.orderStatus')}:{' '}
              <span className="text-base-600">{formatStatus(order.fulfillment_status)}</span>
            </p>
            <p>
              {t('orderCompleted.paymentStatus')}:{' '}
              <span className="text-base-600">{formatStatus(order.payment_status)}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
