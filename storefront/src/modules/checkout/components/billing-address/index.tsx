import B2BConditional from '@/components/b2b/B2BConditional';
import CompanyField from '@/components/company/CompanyField';
import { Select, TextInput } from '@mantine/core';
import { Cart, Customer } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import AddressSelect from '../address-select';
import CountrySelect from '../country-select';

const BillingAddress = ({
  customer,
  cart,
  countryCode,
  availableShippingMethods,
}: {
  customer: Omit<Customer, 'password_hash'> | null;
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  countryCode: string;
  availableShippingMethods: PricedShippingOption[] | null;
}) => {
  const [defaultSelectedAddressId, setDefaultSelectedAddressId] = useState<string | undefined>();

  useEffect(() => {
    const storedAddressId = Cookies.get('selected_address_id');
    if (storedAddressId) {
      setDefaultSelectedAddressId(storedAddressId);
    }
  }, []);

  const [formData, setFormData] = useState({
    'billing_address.first_name': cart?.billing_address?.first_name || customer?.first_name || '',
    'billing_address.last_name': cart?.billing_address?.last_name || customer?.last_name || '',
    'billing_address.address_1': cart?.billing_address?.address_1 || '',
    'billing_address.company':
      cart?.billing_address?.company || (customer?.metadata?.company as string) || '',
    // 'billing_address.postal_code': cart?.billing_address?.postal_code || '',
    'billing_address.city': cart?.billing_address?.city || '',
    'billing_address.country_code': cart?.billing_address?.country_code || countryCode || '',
    'billing_address.province': cart?.billing_address?.province || '',
    'billing_address.phone': cart?.billing_address?.phone || '',
  });

  const countriesInRegion = useMemo(
    () => cart?.region.countries.map((c) => c.iso_2),
    [cart?.region]
  );

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.shipping_addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.shipping_addresses, countriesInRegion]
  );

  useEffect(() => {
    setFormData({
      'billing_address.first_name': cart?.billing_address?.first_name || customer?.first_name || '',
      'billing_address.last_name': cart?.billing_address?.last_name || customer?.last_name || '',
      'billing_address.address_1': cart?.billing_address?.address_1 || '',
      'billing_address.company':
        cart?.billing_address?.company || (customer?.metadata?.company as string) || '',
      // 'billing_address.postal_code': cart?.billing_address?.postal_code || '',
      'billing_address.city': cart?.billing_address?.city || '',
      'billing_address.country_code': cart?.billing_address?.country_code || '',
      'billing_address.province': cart?.billing_address?.province || '',
      'billing_address.phone': cart?.billing_address?.phone || '',
    });
  }, [
    cart?.billing_address,
    customer?.metadata?.company,
    customer?.first_name,
    customer?.last_name,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [citySettings, setCitySettings] = useState<{ value: string; label: string; id: number }[]>(
    []
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [availableMethodsByCity, setAvailableMethodsByCity] = useState<
    {
      value: string;
      label: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    if (!availableShippingMethods) return;

    const uniqueDistricts = new Set(); // Set to track unique district IDs
    const uniqueCitySettings = availableShippingMethods.reduce<
      { value: string; label: string; id: number }[]
    >(
      (acc, method) => {
        const districtId = method.metadata?.district_id;

        if (districtId && !uniqueDistricts.has(districtId)) {
          uniqueDistricts.add(districtId);
          acc.push({
            value:
              typeof method.metadata?.district_name === 'string'
                ? method.metadata.district_name
                : 'Unknown',
            label:
              typeof method.metadata?.district_name === 'string'
                ? method.metadata.district_name
                : 'Unknown',
            id: Number(districtId), // Ensure ID is a number
          });
        }

        return acc;
      },
      [] // Initial empty array
    );

    setCitySettings(uniqueCitySettings);
  }, [availableShippingMethods]);

  // Update resorts when city changes
  useEffect(() => {
    if (!selectedCity || !availableShippingMethods) return;
    const filteredMethods = availableShippingMethods.filter(
      (method) => method.metadata?.district_name === selectedCity
    );
    // Create an array with value, label, and name for each filtered method
    const methodDetails = filteredMethods
      .map((method) => ({
        value: method.name,
        label: method.name,
        name: method.name,
      }))
      .filter(
        (item): item is { value: string; label: string; name: string } => item.value !== undefined
      );
    setAvailableMethodsByCity(methodDetails);
  }, [selectedCity, availableShippingMethods]);

  const t = useTranslations();

  const handleCityChange = (city: string) => {
    setSelectedCity(city); // Update the selected city state
    setFormData({
      ...formData,
      'billing_address.city': city, // Update the form data with the selected city
    });
  };

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <div className="mb-6 flex flex-col gap-y-4">
          <AddressSelect
            addresses={customer.shipping_addresses}
            addressType="billing_address"
            cart={cart}
            defaultSelectedId={defaultSelectedAddressId}
            onCityChange={handleCityChange}
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          required
          autoComplete="given-name"
          label={t('register.firstname')}
          name="billing_address.first_name"
          value={formData['billing_address.first_name']}
          onChange={handleChange}
        />
        <TextInput
          required
          autoComplete="family-name"
          label={t('register.lastname')}
          name="billing_address.last_name"
          value={formData['billing_address.last_name']}
          onChange={handleChange}
        />
        <TextInput
          required
          autoComplete="address-line1"
          label={t('checkout.address')}
          name="billing_address.address_1"
          value={formData['billing_address.address_1']}
          onChange={handleChange}
        />
        <B2BConditional>
          <CompanyField defaultCompanyValue={formData['billing_address.company']} />
        </B2BConditional>
        <B2BConditional elseif>
          <TextInput
            autoComplete="organization"
            label={t('checkout.company')}
            name="billing_address.company"
            value={formData['billing_address.company']}
            onChange={handleChange}
          />
        </B2BConditional>
        {/* <TextInput
          autoComplete="postal-code"
          label={t('checkout.postalCode')}
          name="billing_address.postal_code"
          value={formData['billing_address.postal_code']}
          onChange={handleChange}
        /> */}
        <CountrySelect
          required
          allowDeselect={false}
          autoComplete="country"
          label={t('checkout.country')}
          name="billing_address.country_code"
          region={cart?.region}
          value={formData['billing_address.country_code']}
          onChange={handleChange}
        />
        <Select
          clearable
          required
          autoComplete="address-level2"
          data={citySettings}
          label={t('checkout.city')}
          name="billing_address.city"
          value={formData['billing_address.city']}
          onChange={(value) => {
            setSelectedCity(value);
            handleChange({ target: { name: 'billing_address.city', value } } as any);
          }}
        />
        {selectedCity && (
          <Select
            autoComplete="address-level1"
            data={availableMethodsByCity}
            label={t('checkout.stateProvince')}
            name="billing_address.province"
            value={formData['billing_address.province']}
            onChange={(value) => {
              handleChange({ target: { name: 'billing_address.province', value } } as any);
            }}
          />
        )}
        <TextInput
          required
          autoComplete="tel"
          label={t('checkout.phone')}
          name="billing_address.phone"
          value={formData['billing_address.phone']}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default BillingAddress;
