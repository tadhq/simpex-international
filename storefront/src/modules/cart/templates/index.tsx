import { LoginPrompt } from '@/components/auth';
import { CartEmptyState } from '@/components/cart';
import { CartWithCheckoutStep } from '@/lib/medusa/types';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Divider } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import ItemsTemplate from './items';
import Summary from './summary';

interface Props {
  cart: CartWithCheckoutStep | null;
  // TODO save type
  customer: Omit<Customer, 'password_hash'> | null;
  price_list: any;
}

export default function CartTemplate({ cart, customer, price_list }: Props) {
  return (
    <section className="mb-8 lg:mb-12">
      <div className="container">
        {cart?.items.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            <MotionDiv
              className="flex flex-col py-6 gap-y-6 bg-white p-6 rounded-[20px] border border-gray-300"
              {...fadeInUpEaseProps}
            >
              {!customer && (
                <>
                  <LoginPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate price_list={price_list} items={cart?.items} region={cart?.region} />
            </MotionDiv>
            <div className="relative bg-white px-6 rounded-[20px] shadow-md">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <MotionDiv
                    className="py-6"
                    {...fadeInUpEaseProps}
                    transition={{
                      ...fadeInUpEaseProps.transition,
                      delay: 0.1,
                    }}
                  >
                    <Summary cart={cart} />
                  </MotionDiv>
                )}
              </div>
            </div>
          </div>
        ) : (
          <CartEmptyState />
        )}
      </div>
    </section>
  );
}
