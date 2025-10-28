'use client';

import { Icon } from '@/components/iconify';
import { getCitySettings, getResortSettings } from '@/lib/directus/api';
import { addCustomerShippingAddress } from '@/modules/account/actions';
import CountrySelect from '@/modules/checkout/components/country-select';
import { SubmitButton } from '@/modules/checkout/components/submit-button';
import { Button, Modal, Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Region } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

const AddAddress = ({ region }: { region: Region }) => {
  const t = useTranslations();
  const [successState, setSuccessState] = useState(false);
  const [state, { open, close: closeModal }] = useDisclosure(false);
  const [citySettings, setCitySettings] = useState<{ value: string; label: string; id: number }[]>(
    []
  );
  const [resortSettings, setResortSettings] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filteredResorts, setFilteredResorts] = useState<{ value: string; label: string }[]>([]);

  const [formState, formAction] = useFormState(addCustomerShippingAddress, {
    success: false,
    error: null,
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
      <button
        className="border hover:shadow transition rounded-xl p-5 min-h-[220px] h-full w-full flex flex-col justify-between bg-white"
        onClick={open}
      >
        <span className="font-bold">{t('accountAddresses.newAddress')}</span>
        <Icon icon="ph:plus-bold" />
      </button>

      <Modal opened={state} title={t('accountAddresses.addAddress')} onClose={close}>
        <form action={formAction}>
          <div className="flex flex-col gap-y-2">
            <div className="grid grid-cols-2 gap-x-2">
              <TextInput
                required
                autoComplete="given-name"
                label={t('register.firstname')}
                name="first_name"
              />
              <TextInput
                required
                autoComplete="family-name"
                label={t('register.lastname')}
                name="last_name"
              />
            </div>
            <TextInput autoComplete="organization" label={t('checkout.company')} name="company" />
            <TextInput
              required
              autoComplete="address-line1"
              label={t('checkout.address')}
              name="address_1"
            />
            <TextInput
              autoComplete="address-line2"
              label={t('accountAddresses.addressLine2')}
              name="address_2"
            />
            <CountrySelect
              autoDefaultValue
              required
              allowDeselect={false}
              autoComplete="country"
              label={t('checkout.country')}
              name="country_code"
              region={region}
            />
            <Select
              required
              autoComplete="locality"
              checkIconPosition="right"
              data={citySettings}
              label={t('checkout.city')}
              name="city"
              onChange={(value) => setSelectedCity(value)} // Update selected city
            />
            {selectedCity && (
              <Select
                required
                autoComplete="address-level1"
                checkIconPosition="right"
                data={filteredResorts} // Resorts filtered by city
                label="Resort"
                name="province"
              />
            )}
            <TextInput required autoComplete="phone" label={t('checkout.phone')} name="phone" />
          </div>
          {formState.error && <div className="text-rose-500 text-sm py-2">{formState.error}</div>}
          <footer className="flex gap-3 mt-6">
            <Button size="md" type="reset" variant="default" onClick={close}>
              {t('global.buttons.cancel')}
            </Button>
            <SubmitButton>{t('newPassword.save')}</SubmitButton>
          </footer>
        </form>
      </Modal>
    </>
  );
};

export default AddAddress;
