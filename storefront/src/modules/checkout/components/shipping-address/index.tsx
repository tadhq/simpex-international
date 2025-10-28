import B2BConditional from '@/components/b2b/B2BConditional';
import CompanyField from '@/components/company/CompanyField';
import { Checkbox, Select, TextInput } from '@mantine/core';
import { Cart, Customer } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import AddressSelect from '../address-select';
import CountrySelect from '../country-select';

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  countryCode,
  availableShippingMethods,
}: {
  customer: Omit<Customer, 'password_hash'> | null;
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  checked: boolean;
  onChange: () => void;
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
    'shipping_address.first_name': cart?.shipping_address?.first_name || customer?.first_name || '',
    'shipping_address.last_name': cart?.shipping_address?.last_name || customer?.last_name || '',
    'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
    'shipping_address.company':
      cart?.shipping_address?.company || (customer?.metadata?.company as string) || '',
    // 'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
    'shipping_address.city': cart?.shipping_address?.city || '',
    'shipping_address.country_code': cart?.shipping_address?.country_code || countryCode || '',
    'shipping_address.province': cart?.shipping_address?.province || '',
    email: cart?.email || '',
    'shipping_address.phone': cart?.shipping_address?.phone || customer?.phone || '',
    'shipping_address.metadata.purchase_order_number':
      cart?.shipping_address?.metadata?.purchase_order_number || '',
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
      'shipping_address.first_name':
        cart?.shipping_address?.first_name || customer?.first_name || '',
      'shipping_address.last_name': cart?.shipping_address?.last_name || customer?.last_name || '',
      'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
      'shipping_address.company':
        cart?.shipping_address?.company || (customer?.metadata?.company as string) || '',
      // 'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
      'shipping_address.city': cart?.shipping_address?.city || '',
      'shipping_address.country_code': cart?.shipping_address?.country_code || '',
      'shipping_address.province': cart?.shipping_address?.province || '',
      email: cart?.email || '',
      'shipping_address.phone': cart?.shipping_address?.phone || customer?.phone || '',
      'shipping_address.metadata.purchase_order_number':
        cart?.shipping_address?.metadata?.purchase_order_number || '',
    });
  }, [
    cart?.shipping_address,
    cart?.email,
    cart?.shipping_address?.metadata?.purchase_order_number,
    customer?.phone,
    customer?.first_name,
    customer?.last_name,
    customer?.metadata?.company,
  ]);
  const [saveAddressCheck, setSaveAddressCheck] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (checkExistingAddress) {
      setSaveAddressCheck(false);
    }
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // console.log('Province received in ShippingAddress:', cart?.shipping_address?.province);
  // useEffect(() => {}, [cart?.shipping_address?.province]);

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
      'shipping_address.city': city, // Update the form data with the selected city
    });
  };

  const address1 = formData['shipping_address.address_1'];
  const city = formData['shipping_address.city'];

  const checkExistingAddress = addressesInRegion?.some(
    (regionAddress) => regionAddress.address_1 === address1 && regionAddress.city === city
  );

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <div className="mb-6 flex flex-col gap-y-4">
          <p className="text-sm">
            {t('checkout.greetingUseSavedAddress', { firstName: customer.first_name })}
          </p>
          <AddressSelect
            addresses={addressesInRegion || []}
            addressType="shipping_address"
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
          name="shipping_address.first_name"
          value={formData['shipping_address.first_name']}
          onChange={handleChange}
        />
        <TextInput
          required
          autoComplete="family-name"
          label={t('register.lastname')}
          name="shipping_address.last_name"
          value={formData['shipping_address.last_name']}
          onChange={handleChange}
        />
        <TextInput
          required
          autoComplete="address-line1"
          label={t('checkout.address')}
          name="shipping_address.address_1"
          value={formData['shipping_address.address_1']}
          onChange={handleChange}
        />
        <B2BConditional>
          <CompanyField defaultCompanyValue={formData['shipping_address.company']} />
        </B2BConditional>
        <B2BConditional elseif>
          <TextInput
            autoComplete="organization"
            label={t('checkout.company')}
            name="shipping_address.company"
            value={formData['shipping_address.company']}
            onChange={handleChange}
          />
        </B2BConditional>
        {/* <TextInput
          autoComplete="postal-code"
          label={t('checkout.postalCode')}
          name="shipping_address.postal_code"
          value={formData['shipping_address.postal_code']}
          onChange={handleChange}
        /> */}

        <CountrySelect
          required
          allowDeselect={false}
          autoComplete="country"
          label={t('checkout.country')}
          name="shipping_address.country_code"
          region={cart?.region}
          value={formData['shipping_address.country_code']}
          onChange={handleChange}
        />
        <Select
          clearable
          required
          autoComplete="address-level2"
          data={citySettings}
          label={t('checkout.city')}
          name="shipping_address.city"
          value={formData['shipping_address.city']}
          onChange={(value) => {
            setSelectedCity(value);
            handleChange({ target: { name: 'shipping_address.city', value } } as any);
          }}
        />

        {selectedCity && (
          <Select
            autoComplete="address-level1"
            data={availableMethodsByCity}
            label={t('checkout.stateProvince')}
            name="shipping_address.province"
            value={formData['shipping_address.province']}
            onChange={(value) => {
              handleChange({ target: { name: 'shipping_address.province', value } } as any);
            }}
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <TextInput
          required
          autoComplete="email"
          label="Email"
          name="email"
          title="Enter a valid email address."
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          required
          autoComplete="tel"
          label={t('checkout.phone')}
          name="shipping_address.phone"
          value={formData['shipping_address.phone']}
          onChange={handleChange}
        />
        <B2BConditional>
          <TextInput
            label={t('checkout.purchaseOrderNumber')}
            name="shipping_address.metadata.purchase_order_number"
            value={formData['shipping_address.metadata.purchase_order_number'] as string}
            onChange={handleChange}
          />
        </B2BConditional>
      </div>
      <div className="mb-4 mt-8">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={checked}
            className="text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500"
            label={t('checkout.billingSameAsShipping')}
            name="same_as_billing"
            onChange={onChange}
          />
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            checked={saveAddressCheck}
            className="text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500"
            disabled={checkExistingAddress}
            label={t('checkout.saveAddressFuture')}
            name="save_address"
            onChange={(e) => {
              setSaveAddressCheck(e.currentTarget.checked);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ShippingAddress;
