'use client';

import { Icon } from '@/components/iconify';
import { getCitySettings, getResortSettings } from '@/lib/directus/api';
import {
  deleteCustomerShippingAddress,
  updateCustomerShippingAddress,
} from '@/modules/account/actions';
import CountrySelect from '@/modules/checkout/components/country-select';
import { SubmitButton } from '@/modules/checkout/components/submit-button';
import { Button, Loader, Modal, Select, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Address, Region } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

type EditAddressProps = {
  region: Region;
  address: Address;
  isActive?: boolean;
};

const EditAddress: React.FC<EditAddressProps> = ({ region, address, isActive = false }) => {
  const [removing, setRemoving] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [state, { open, close: closeModal }] = useDisclosure(false);
  const [citySettings, setCitySettings] = useState<{ value: string; label: string; id: number }[]>(
    []
  );
  const [resortSettings, setResortSettings] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(address.city || null);
  const [filteredResorts, setFilteredResorts] = useState<{ value: string; label: string }[]>([]);

  const t = useTranslations();

  const [formState, formAction] = useFormState(updateCustomerShippingAddress, {
    success: false,
    error: null,
    addressId: address.id,
  });

  const close = () => {
    setSuccessState(false);
    closeModal();
  };

  useEffect(() => {
    if (successState) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState]);

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true);
    }
  }, [formState]);

  const removeAddress = async () => {
    setRemoving(true);
    await deleteCustomerShippingAddress(address.id);
    setRemoving(false);
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [cities, resorts] = await Promise.all([getCitySettings(), getResortSettings()]);

        if (cities) {
          setCitySettings(
            cities.map((city: any) => ({
              value: city.fullname,
              label: city.fullname,
              id: city.id, // Store city ID for filtering resorts
            }))
          );
        }

        if (resorts) {
          setResortSettings(resorts);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }

    fetchSettings();
  }, []);

  // Update resorts when city changes
  useEffect(() => {
    if (selectedCity) {
      const city = citySettings.find((c) => c.value === selectedCity);
      if (city) {
        const filtered = resortSettings
          .filter((resort) => resort.district_id?.id === city.id) // Filter by city ID
          .map((resort) => ({
            value: resort.fullname,
            label: resort.fullname,
          }));

        setFilteredResorts(filtered);
      }
    } else {
      setFilteredResorts([]); // Reset resorts if no city is selected
    }
  }, [selectedCity, resortSettings, citySettings]);

  return (
    <>
      <div
        className={cn(
          'border rounded-xl p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors bg-white border-primary-400',
          {
            'border-base-900': isActive,
          }
        )}
      >
        <div className="flex flex-col">
          <Title className="text-left" order={4}>
            {address.first_name} {address.last_name}
          </Title>
          {address.company && <p className="txt-compact-small">{address.company}</p>}
          <p className="flex flex-col text-left text-base-regular mt-2">
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
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          <button className="text-sm flex items-center gap-x-2 text-primary-600" onClick={open}>
            <Icon icon="ph:pencil-bold" />
            {t('global.buttons.edit')}
          </button>
          <button
            className="text-sm flex items-center gap-x-2 text-red-600"
            onClick={removeAddress}
          >
            {removing ? <Loader /> : <Icon icon="ph:trash-bold" />}
            {t('global.buttons.remove')}
          </button>
        </div>
      </div>

      <Modal opened={state} title={t('accountAddresses.editAddress')} onClose={close}>
        <form action={formAction}>
          <div className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-2 gap-x-2">
              <TextInput
                required
                autoComplete="given-name"
                defaultValue={address.first_name || undefined}
                label={t('register.firstname')}
                name="first_name"
              />
              <TextInput
                required
                autoComplete="family-name"
                defaultValue={address.last_name || undefined}
                label={t('register.lastname')}
                name="last_name"
              />
            </div>
            <TextInput
              autoComplete="organization"
              defaultValue={address.company || undefined}
              label={t('checkout.company')}
              name="company"
            />
            <TextInput
              required
              autoComplete="address-line1"
              defaultValue={address.address_1 || undefined}
              label={t('checkout.address')}
              name="address_1"
            />
            <TextInput
              autoComplete="address-line2"
              defaultValue={address.address_2 || undefined}
              label={t('accountAddresses.addressLine2')}
              name="address_2"
            />
            {/* <div className="grid grid-cols-[144px_1fr] gap-x-2">
              <TextInput
                autoComplete="postal-code"
                defaultValue={address.postal_code || undefined}
                label={t('checkout.postalCode')}
                name="postal_code"
              /> */}
            <Select
              required
              autoComplete="locality"
              checkIconPosition="right"
              data={citySettings}
              defaultValue={address.city || undefined}
              label={t('checkout.city')}
              name="city"
              onChange={(value) => setSelectedCity(value)}
            />
            {/* </div> */}
            {selectedCity && (
              <Select
                autoComplete="address-level1"
                checkIconPosition="right"
                data={filteredResorts}
                defaultValue={address.province || undefined}
                label={t('checkout.stateProvince')}
                name="province"
              />
            )}
            <CountrySelect
              required
              allowDeselect={false}
              autoComplete="country"
              label={t('checkout.country')}
              name="country_code"
              region={region}
              value={address.country_code || undefined}
            />
            <TextInput
              required
              autoComplete="phone"
              defaultValue={address.phone || undefined}
              label={t('checkout.phone')}
              name="phone"
            />
          </div>
          {formState.error && <div className="text-rose-500 text-sm py-2">{formState.error}</div>}
          <footer className="flex gap-3 mt-6">
            <Button className="h-10" type="reset" variant="default" onClick={close}>
              {t('global.buttons.cancel')}
            </Button>
            <SubmitButton>{t('newPassword.save')}</SubmitButton>
          </footer>
        </form>
      </Modal>
    </>
  );
};

export default EditAddress;
