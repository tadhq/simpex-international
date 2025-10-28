import { useTranslations } from 'next-intl';

export const useShippingInfoMap = () => {
  const t = useTranslations();

  const shippingInfoMap: Record<string, { title: string }> = {
    // delivery: {
    //   title: 'Delivery',
    // },
    // 'delivery-within-city': {
    //   title: t('checkout.deliveryWithinCity'),
    // },
    'bank-transfer': {
      title: t('checkout.bankTransfer'),
    },
    cash: {
      title: t('checkout.cash'),
    },
    'pin-on-delivery': {
      title: t('checkout.pickupFromStore'),
    },
    'pickup-from-store': {
      title: t('checkout.pickupFromStore'),
    },
  };

  return {
    shippingInfoMap,
  };
};
