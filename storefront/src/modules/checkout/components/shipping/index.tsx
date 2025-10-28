'use client';

import RadioDecoration from '@/components/common/RadioDecoration';
import { Icon } from '@/components/iconify';
import { getStoreSettings } from '@/lib/directus/api';
import { formatAmount } from '@/lib/medusa/utils';
import { setShippingMethod } from '@/modules/checkout/actions';
import ErrorMessage from '@/modules/checkout/components/error-message';
import { useShippingInfoMap } from '@/modules/checkout/shipping';
import { RadioGroup } from '@headlessui/react';
import { Badge, Button, Divider, Loader, Select, Text, Title } from '@mantine/core';
import { Cart } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import { cn } from '@tadsr/web-core/tailwindcss';
import { deleteCookie, setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ShippingProps = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  availableShippingMethods: PricedShippingOption[] | null;
};

const Shipping: React.FC<ShippingProps> = ({ cart, availableShippingMethods }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [stores, setStores] = useState<{ value: string; label: string }[]>([]);
  const [loadingStores, setLoadingStores] = useState(true); // Track store fetch loading state

  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { shippingInfoMap } = useShippingInfoMap();

  const errorMap: any = {
    not_allowed: t('checkout.deliveryWithinCityNotAllowed'),
  };

  const isOpen = searchParams.get('step') === 'delivery';

  const handleEdit = () => {
    router.push(pathname + '?step=delivery', { scroll: false });
  };

  const handleSubmit = () => {
    const selectedShippingMethod = cart.shipping_methods[0]?.shipping_option.name;
    if (selectedShippingMethod === 'pickup-from-store' && !selectedStore) {
      setStoreError('Required');
      return;
    }

    setStoreError(null);
    setIsLoading(true);
    router.push(pathname + '?step=payment', { scroll: false });
  };

  const set = async (id: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await setShippingMethod(id);
      setIsLoading(false);
      if (data) {
        setError(errorMap[data] ?? data);
      }
    } catch (err) {
      // setError(err);
      setIsLoading(false);
    }
  };

  // const handleChange = (value: string) => {
  //   set(value);
  // };

  const handleStoreSelection = (value: string | null) => {
    const selected = stores.find((store) => store.value === value);

    if (selected) {
      setSelectedStore(selected.value);
      setCookie('selectedStore', selected?.label, { maxAge: 86400 }); // Store as JSON
    } else {
      setSelectedStore(null);
      deleteCookie('selectedStore');
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setError(null);
  }, [isOpen]);

  // Fetch stores dynamically from Directus
  useEffect(() => {
    async function fetchStores() {
      try {
        const storeData = await getStoreSettings();

        if (storeData && Array.isArray(storeData)) {
          const formattedStores = storeData.map((store: any) => ({
            value: store.id.toString(),
            label: store.address,
          }));

          setStores(formattedStores);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoadingStores(false);
      }
    }

    fetchStores();
  }, []);

  const shippingProvince = cart.shipping_address?.province;

  // Filter availableShippingMethods based on the matching shippingProvince
  const matchedShippingMethod = availableShippingMethods?.find((option) => {
    return (
      option.name === shippingProvince &&
      option?.metadata?.district_name === cart.shipping_address?.city
    ); // Match the shipping method name with the shippingProvince
  });

  // If a matching method is found, you can access the price_incl_tax
  const deliveryFee = matchedShippingMethod ? matchedShippingMethod.price_incl_tax : null;

  const handleChange = (value: string) => {
    set(value);
  };

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Title
          className={cn('flex flex-row text-3xl-regular gap-x-2 items-center', {
            'opacity-50 pointer-events-none select-none':
              !isOpen && cart.shipping_methods.length === 0,
          })}
          order={3}
        >
          <Badge circle size="lg" variant="default">
            2
          </Badge>
          {t('checkout.delivery')}
          {!isOpen && cart.shipping_methods.length > 0 && (
            <Icon icon="ph:circle-check-circle-bold" />
          )}
        </Title>
        {!isOpen && cart?.shipping_address && cart?.billing_address && cart?.email && (
          <p>
            <Button variant="default" onClick={handleEdit}>
              {t('global.buttons.edit')}
            </Button>
          </p>
        )}
      </div>

      {isOpen ? (
        <div>
          <div>
            <RadioGroup
              value={cart.shipping_methods[0]?.shipping_option_id}
              onChange={(value: string) => handleChange(value)}
            >
              {availableShippingMethods ? (
                availableShippingMethods
                  .filter(
                    (option) =>
                      option.name === 'pickup-from-store' ||
                      (option.name === shippingProvince &&
                        option?.metadata?.district_name === cart.shipping_address?.city)
                  )
                  .map((option) => {
                    const isPickup = option.name === 'pickup-from-store';
                    const isDelivery = option.name === shippingProvince;

                    return (
                      <div key={option.id}>
                        <RadioGroup.Option
                          className={cn(
                            'flex items-center justify-between text-sm cursor-pointer p-4 border rounded-xl mb-2 hover:shadow transition',
                            {
                              'border-primary-600':
                                option.id === cart.shipping_methods[0]?.shipping_option_id,
                            }
                          )}
                          value={option.id}
                        >
                          <div className="flex items-center gap-x-4">
                            <RadioDecoration
                              checked={option.id === cart.shipping_methods[0]?.shipping_option_id}
                            />
                            <span className="text-base-regular">
                              {isPickup
                                ? t('checkout.pickupFromStore')
                                : isDelivery
                                  ? t('checkout.delivery')
                                  : ''}
                            </span>
                          </div>
                          {option.amount !== 0 && (
                            <span className="justify-self-end">
                              {formatAmount({
                                amount: option.amount!,
                                region: cart?.region,
                                includeTaxes: false,
                              })}
                            </span>
                          )}
                        </RadioGroup.Option>

                        {isDelivery &&
                          option.id === cart.shipping_methods[0]?.shipping_option_id && (
                            <div className="mt-2 bg-primary-50 px-6 py-4 rounded-xl border border-primary-600">
                              <h1 className="font-bold mb-2">{t('checkout.deliveryCosts')}</h1>
                              <div className="flex justify-between">
                                <p>{shippingProvince}</p>
                                <p>
                                  {deliveryFee !== null && deliveryFee !== undefined
                                    ? formatAmount({
                                        amount: deliveryFee,
                                        region: cart?.region,
                                        includeTaxes: false,
                                      })
                                    : 'No delivery fee available'}
                                </p>
                              </div>
                            </div>
                          )}

                        {isPickup && option.id === cart.shipping_methods[0]?.shipping_option_id && (
                          <div className="mt-4 mb-6">
                            {loadingStores ? (
                              <Loader size="sm" />
                            ) : (
                              <>
                                <Select
                                  clearable
                                  withAsterisk
                                  className="text-sm w-full md:w-1/2"
                                  data={stores}
                                  label={t('checkout.storeLocation')}
                                  placeholder={t('checkout.selectLocation')}
                                  value={selectedStore}
                                  onChange={handleStoreSelection}
                                />
                                {storeError && (
                                  <Text className="mt-2" color="red" size="sm">
                                    {storeError}
                                  </Text>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-8">
                  <Loader />
                </div>
              )}
            </RadioGroup>
          </div>

          <ErrorMessage error={error} />

          <Button
            className="mt-6"
            disabled={!cart.shipping_methods[0]}
            loading={isLoading}
            size="md"
            onClick={handleSubmit}
          >
            {t('global.buttons.continueToPayment')}
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-sm">
            {cart && cart.shipping_methods.length > 0 && (
              <p className="text-base-700">
                {cart.shipping_methods[0]?.shipping_option.name === 'pickup-from-store'
                  ? t('checkout.pickupFromStore')
                  : cart.shipping_methods[0]?.shipping_option.name === shippingProvince
                    ? t('checkout.delivery')
                    : shippingInfoMap[cart.shipping_methods[0]?.shipping_option.name]?.title}
              </p>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Shipping;
