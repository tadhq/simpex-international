import { createPaymentSessions, getCustomer, listShippingMethods } from '@/lib/medusa/api';
import { CartWithCheckoutStep } from '@/lib/medusa/types';
import { getCheckoutStep } from '@/lib/medusa/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import Addresses from '@/modules/checkout/components/addresses';
import Payment from '@/modules/checkout/components/payment';
import Review from '@/modules/checkout/components/review';
import Shipping from '@/modules/checkout/components/shipping';
import { cookies } from 'next/headers';

export default async function CheckoutForm({ store }: any) {
  const cartId = cookies().get('_medusa_cart_id')?.value;

  if (!cartId) {
    return null;
  }

  // create payment sessions and get cart
  const cart = (await createPaymentSessions(cartId)) as CartWithCheckoutStep;

  if (!cart) {
    return null;
  }

  cart.checkout_step = cart && getCheckoutStep(cart);

  // get available shipping methods
  const availableShippingMethods = await listShippingMethods(cart.region_id).then((methods) =>
    methods?.filter((m) => !m.is_return)
  );

  if (!availableShippingMethods) {
    return null;
  }

  // get customer if logged in
  const customer = await getCustomer();

  return (
    <MotionDiv {...fadeInUpEaseProps}>
      <div className="w-full grid grid-cols-1 gap-y-8 bg-white p-6 lg:p-10 rounded-[20px] shadow-md">
        <div>
          <Addresses
            availableShippingMethods={availableShippingMethods}
            cart={cart}
            customer={customer}
            store={store}
          />
        </div>

        <div>
          <Shipping availableShippingMethods={availableShippingMethods} cart={cart} />
        </div>

        <div>
          <Payment cart={cart} />
        </div>

        <div>
          <Review cart={cart} store={store} />
        </div>
      </div>
    </MotionDiv>
  );
}
