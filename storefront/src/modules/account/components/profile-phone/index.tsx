'use client';

import { updateCustomerPhone } from '@/modules/account/actions';
import { TextInput } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import AccountInfo from '../account-info';

type MyInformationProps = {
  customer: Omit<Customer, 'password_hash'>;
};

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false);

  const [state, formAction] = useFormState(updateCustomerPhone, {
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

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        clearState={clearState}
        currentInfo={`${customer.phone}`}
        errorMessage={state.error}
        isError={!!state.error}
        isSuccess={successState}
        label={t('checkout.phone')}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <TextInput
            required
            autoComplete="phone"
            defaultValue={customer.phone}
            label={t('checkout.phone')}
            name="phone"
            type="phone"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileEmail;
