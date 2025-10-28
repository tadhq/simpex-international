import RadioDecoration from '@/components/common/RadioDecoration';
import { Icon } from '@/components/iconify';
import { compareAddresses } from '@/lib/medusa/utils';
import { Listbox, Transition } from '@headlessui/react';
import { Address, AddressPayload, Cart } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import Cookies from 'js-cookie';
import { omit } from 'lodash';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect, useMemo } from 'react';
import { cartUpdate } from '../../actions';

type AddressSelectProps = {
  addresses: Address[];
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  addressType: 'shipping_address' | 'billing_address';
  onCityChange: (city: string) => void; // Prop for city change handler
  defaultSelectedId?: string;
};

const AddressSelect = ({
  addresses,
  cart,
  addressType,
  onCityChange,
  defaultSelectedId,
}: AddressSelectProps) => {
  const t = useTranslations();

  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id);
    if (savedAddress) {
      cartUpdate({
        [addressType]: omit(savedAddress, [
          'id',
          'created_at',
          'updated_at',
          'country',
          'deleted_at',
          'metadata',
          'customer_id',
          // 'city',
          // 'province',
        ]) as AddressPayload,
      });

      Cookies.set(`selected_address_id`, id, { expires: 7 });

      // Pass city back to parent (ShippingAddress) component
      if (savedAddress.city) {
        onCityChange(savedAddress.city); // Trigger parent city change handler
      }
    }
  };

  useEffect(() => {
    if (defaultSelectedId) {
      handleSelect(defaultSelectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedId]);

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, cart?.[addressType]));
  }, [addresses, cart, addressType]);

  return (
    <Listbox value={selectedAddress?.id} onChange={handleSelect}>
      <div className="relative">
        <Listbox.Button className="relative w-full flex justify-between items-center px-4 py-[10px] text-left bg-white cursor-default focus:outline-none border rounded-xl focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-base-300 focus-visible:ring-offset-2 focus-visible:border-base-300 text-base-regular">
          {({ open }) => (
            <>
              <span className="block truncate">
                {selectedAddress ? selectedAddress.address_1 : t('checkout.chooseAddress')}
              </span>
              <Icon
                className={cn('transition-rotate duration-200', {
                  'transform rotate-180': open,
                })}
                icon="ph:caret-down-bold"
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 w-full overflow-auto text-sm bg-white border border-top-0 max-h-60 focus:outline-none sm:text-sm">
            {addresses.map((address) => {
              return (
                <Listbox.Option
                  key={address.id}
                  className="cursor-default select-none relative pl-6 pr-10 hover:bg-base-50 py-4"
                  value={address.id}
                >
                  <div className="flex gap-x-4 items-start">
                    <RadioDecoration checked={selectedAddress?.id === address.id} />
                    <div className="flex flex-col">
                      <span className="text-left font-bold">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.company && <span className="text-sm">{address.company}</span>}
                      <div className="flex flex-col text-left text-base-regular mt-2">
                        <span>
                          {address.address_1}
                          {address.address_2 && <span>, {address.address_2}</span>}
                        </span>
                        <span>
                          {address.postal_code ? `${address.postal_code}, ` : ''}
                          {address.city}
                        </span>
                        <span>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default AddressSelect;
