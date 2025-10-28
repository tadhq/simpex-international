import { Icon } from '@/components/iconify';
import { useTranslations } from 'next-intl';

export const usePaymentInfoMap = () => {
  const t = useTranslations();

  const paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }> = {
    manual: {
      title: t('checkout.manual'),
      icon: <Icon height={18} icon="ph:money" />,
    },
    'bank-transfer': {
      title: t('checkout.bankTransfer'),
      icon: <Icon height={18} icon="ph:bank" />,
    },
    cash: {
      title: t('checkout.cash'),
      icon: <Icon height={18} icon="ph:money" />,
    },
    'pin-on-delivery': {
      title: t('checkout.pinOnDelivery'),
      icon: <Icon height={18} icon="streamline:credit-card-1" />,
    },
  };

  return {
    paymentInfoMap,
  };
};
