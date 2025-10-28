'use client';

import { Cart, Customer } from '@medusajs/medusa';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@/components/iconify';
import { compareAddresses } from '@/lib/medusa/utils';
import { Badge, Button, Divider, Loader, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import { useTranslations } from 'next-intl';
import { useFormState } from 'react-dom';
import { setAddresses } from '../../actions';
import BillingAddress from '../billing-address';
import ErrorMessage from '../error-message';
import ShippingAddress from '../shipping-address';
import { SubmitButton } from '../submit-button';

const Addresses = ({
  cart,
  customer,
  availableShippingMethods,
  store,
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  customer: Omit<Customer, 'password_hash'> | null;
  availableShippingMethods: PricedShippingOption[] | null;
  store: any;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const countryCode = params.countryCode as string;

  const isOpen = searchParams.get('step') === 'address';

  const [sameAsSBilling, { toggle: toggleSameAsBilling }] = useDisclosure(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  );

  const handleEdit = () => {
    router.push(pathname + '?step=address');
  };

  const [message, formAction] = useFormState(
    (state: unknown, formData: FormData) => setAddresses(state, formData, store),
    null
  );

  const t = useTranslations();

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <Title className="flex flex-row text-3xl-regular gap-x-2 items-center" order={3}>
          <Badge circle size="lg" variant="default">
            1
          </Badge>
          {t('checkout.shippingAddress')}
          {!isOpen && <Icon icon="ph:circle-check-circle-bold" />}
        </Title>
        {!isOpen && cart?.shipping_address && (
          <p>
            <Button variant="default" onClick={handleEdit}>
              {t('global.buttons.edit')}
            </Button>
          </p>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div>
            <ShippingAddress
              availableShippingMethods={availableShippingMethods}
              cart={cart}
              checked={sameAsSBilling}
              countryCode={countryCode}
              customer={customer}
              onChange={toggleSameAsBilling}
            />

            {!sameAsSBilling && (
              <div>
                <Title className="text-3xl-regular gap-x-4 pb-6 pt-8" order={3}>
                  {t('checkout.billingAddress')}
                </Title>

                <BillingAddress
                  availableShippingMethods={availableShippingMethods}
                  cart={cart}
                  countryCode={countryCode}
                  customer={customer}
                />
              </div>
            )}
            <SubmitButton className="mt-6">{t('global.buttons.continueToDelivery')}</SubmitButton>
            <ErrorMessage error={message} />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-sm">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="grid gap-3 w-full grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold mb-1">{t('checkout.shippingAddress')}</p>
                    <p className="text-base-700">
                      {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                    </p>
                    <p className="text-base-700">
                      {cart.shipping_address.address_1} {cart.shipping_address.address_2}
                    </p>
                    <p className="text-base-700">
                      {/* {cart.shipping_address.postal_code
                        ? `${cart.shipping_address.postal_code}, `
                        : ''} */}
                      {cart.shipping_address.city}
                    </p>
                    <p className="text-base-700">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </p>
                    {(cart?.shipping_address?.metadata as any)?.purchase_order_number && (
                      <p className="text-base-700">
                        {t('checkout.poNumber')}:{' '}
                        {(cart?.shipping_address?.metadata as any)?.purchase_order_number}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold mb-1">Contact</p>
                    <p className="text-base-700">{cart.shipping_address.phone}</p>
                    <p className="text-base-700">{cart.email}</p>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold mb-1">{t('checkout.billingAddress')}</p>

                    {sameAsSBilling ? (
                      <p className="text-base-700">{t('checkout.billingAddressSameAsDelivery')}</p>
                    ) : (
                      <>
                        <p className="text-base-700">
                          {cart.billing_address.first_name} {cart.billing_address.last_name}
                        </p>
                        <p className="text-base-700">
                          {cart.billing_address.address_1} {cart.billing_address.address_2}
                        </p>
                        <p className="text-base-700">
                          {/* {cart.billing_address.postal_code
                            ? `${cart.billing_address.postal_code}, `
                            : ''} */}
                          {cart.billing_address.city}
                        </p>
                        <p className="text-base-700">
                          {cart.billing_address.country_code?.toUpperCase()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Addresses;
