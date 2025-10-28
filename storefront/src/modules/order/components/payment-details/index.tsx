import { usePaymentInfoMap } from '@/modules/checkout/payments';
import { Title } from '@mantine/core';
import { Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';

type PaymentDetailsProps = {
  order: Order;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const t = useTranslations();
  const payment = order.payments[0];
  const { paymentInfoMap } = usePaymentInfoMap();

  return (
    <div>
      <Title className="flex flex-row text-3xl-regular my-6" order={3}>
        {t('checkout.payment')}
      </Title>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3 gap-0.5">
              <p className="font-bold mb-1">{t('checkout.paymentMethod')}</p>
              <p className="text-base-700">{paymentInfoMap[payment.provider_id].title}</p>
            </div>
            <div className="flex flex-col w-2/3">
              <p className="font-bold mb-1">{t('checkout.paymentDetails')}</p>
              <div className="flex gap-2 text-base-700 items-center">
                <div className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id].icon}
                </div>
                <p>
                  {payment.provider_id === 'stripe' && `**** **** **** ${payment.data.card_last4}`}
                  {payment.provider_id === 'bank-transfer' && t('checkout.payBankTransfer')}
                  {payment.provider_id === 'cash' && t('checkout.payCash')}
                  {payment.provider_id === 'pin-on-delivery' && t('checkout.payPinOnDelivery')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
