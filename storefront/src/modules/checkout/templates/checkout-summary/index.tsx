import CartTotals from '@/components/cart/CartTotals';
import { PRICE_LIST_ID } from '@/config/env';
import { getPriceListProducts } from '@/lib/medusa/api';
import { getCartWithRegion } from '@/lib/medusa/server';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import ItemsPreviewTemplate from '@/modules/cart/templates/preview';
import { Divider, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import DiscountCode from '../../components/discount-code';

const CheckoutSummary = async () => {
  const t = await getTranslations();
  const price_list = await getPriceListProducts(PRICE_LIST_ID);

  let { cart } = await getCartWithRegion();

  if (!cart) {
    return null;
  }

  return (
    <div className="sticky top-0 flex flex-col-reverse sm:flex-col gap-y-8 py-8 sm:py-0">
      <MotionDiv
        className="w-full flex flex-col bg-white p-10 rounded-[20px] shadow-lg"
        {...fadeInUpEaseProps}
        transition={{
          ...fadeInUpEaseProps.transition,
          delay: 0.1,
        }}
      >
        <Title className="flex flex-row text-3xl-regular items-baseline mb-3" order={2}>
          {t('checkout.inYourCart')}
        </Title>
        <div className="my-3">
          <DiscountCode cart={cart} />
        </div>
        <Divider className="my-3" />
        <ItemsPreviewTemplate items={cart?.items} price_list={price_list} region={cart?.region} />
        <Divider className="my-3" />
        <CartTotals data={cart} />
      </MotionDiv>
    </div>
  );
};

export default CheckoutSummary;
