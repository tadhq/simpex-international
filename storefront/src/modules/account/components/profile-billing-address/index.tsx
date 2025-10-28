'use client';

import { updateCustomerBillingAddress } from '@/modules/account/actions';
import { Select, TextInput } from '@mantine/core';
import { Customer, Region } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import AccountInfo from '../account-info';

type MyInformationProps = {
  customer: Omit<Customer, 'password_hash'>;
  regions: Region[];
};

const ProfileBillingAddress: React.FC<MyInformationProps> = ({ customer, regions }) => {
  const regionOptions = useMemo(() => {
    return (
      regions
        ?.map((region) => {
          return region.countries.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          }));
        })
        .flat() || []
    );
  }, [regions]);

  const [successState, setSuccessState] = useState(false);

  const [state, formAction] = useFormState(updateCustomerBillingAddress, {
    error: false,
    success: false,
  });

  const t = useTranslations();

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  const currentInfo = useMemo(() => {
    if (!customer.billing_address) {
      return t('accountProfile.noBillingAddress');
    }

    const country =
      regionOptions?.find((country) => country.value === customer.billing_address.country_code)
        ?.label || customer.billing_address.country_code?.toUpperCase();

    return (
      <div className="flex flex-col font-bold">
        <span>
          {customer.billing_address.first_name} {customer.billing_address.last_name}
        </span>
        <span>{customer.billing_address.company}</span>
        <span>
          {customer.billing_address.address_1}
          {customer.billing_address.address_2 ? `, ${customer.billing_address.address_2}` : ''}
        </span>
        <span>
          {customer.billing_address.postal_code ? `${customer.billing_address.postal_code}, ` : ''}
          {customer.billing_address.city}
        </span>
        <span>{country}</span>
      </div>
    );
  }, [customer.billing_address, regionOptions, t]);

  return (
    <form action={formAction} className="w-full" onReset={() => clearState()}>
      <AccountInfo
        clearState={clearState}
        currentInfo={currentInfo}
        isError={!!state.error}
        isSuccess={successState}
        label={t('checkout.billingAddress')}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <TextInput
              required
              defaultValue={customer.billing_address?.first_name || undefined}
              label={t('register.firstname')}
              name="billing_address.first_name"
            />
            <TextInput
              required
              defaultValue={customer.billing_address?.last_name || undefined}
              label={t('register.lastname')}
              name="billing_address.last_name"
            />
          </div>
          <TextInput
            defaultValue={customer.billing_address?.company || undefined}
            label={t('checkout.company')}
            name="billing_address.company"
          />
          <TextInput
            required
            defaultValue={customer.billing_address?.address_1 || undefined}
            label={t('checkout.address')}
            name="billing_address.address_1"
          />
          <TextInput
            defaultValue={customer.billing_address?.address_2 || undefined}
            label={t('accountAddresses.addressLine2')}
            name="billing_address.address_2"
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <TextInput
              defaultValue={customer.billing_address?.postal_code || undefined}
              label={t('checkout.postalCode')}
              name="billing_address.postal_code"
            />
            <TextInput
              required
              defaultValue={customer.billing_address?.city || undefined}
              label={t('checkout.city')}
              name="billing_address.city"
            />
          </div>
          <TextInput
            defaultValue={customer.billing_address?.province || undefined}
            label="Province"
            name="billing_address.province"
          />
          <Select
            required
            data={regionOptions}
            defaultValue={customer.billing_address?.country_code || undefined}
            label={t('checkout.country')}
            name="billing_address.country_code"
          />
          <TextInput
            required
            defaultValue={customer.billing_address?.phone || undefined}
            label={t('checkout.phone')}
            name="billing_address.phone"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

const mapBillingAddressToFormData = ({ customer }: MyInformationProps) => {
  return {
    billing_address: {
      first_name: customer.billing_address?.first_name || undefined,
      last_name: customer.billing_address?.last_name || undefined,
      company: customer.billing_address?.company || undefined,
      address_1: customer.billing_address?.address_1 || undefined,
      address_2: customer.billing_address?.address_2 || undefined,
      city: customer.billing_address?.city || undefined,
      province: customer.billing_address?.province || undefined,
      postal_code: customer.billing_address?.postal_code || undefined,
      country_code: customer.billing_address?.country_code || undefined,
    },
  };
};

export default ProfileBillingAddress;
