'use client';

import { updateCustomerName } from '@/modules/account/actions';
import { TextInput } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import AccountInfo from '../account-info';

type MyInformationProps = {
  customer: Omit<Customer, 'password_hash'>;
};

const ProfileName: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false);

  const t = useTranslations();

  const [state, formAction] = useFormState(updateCustomerName, {
    error: false,
    success: false,
  });

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  return (
    <form action={formAction} className="w-full overflow-visible">
      <AccountInfo
        clearState={clearState}
        currentInfo={`${customer.first_name} ${customer.last_name}`}
        isError={!!state?.error}
        isSuccess={successState}
        label={t('shop.name')}
      >
        <div className="grid grid-cols-2 gap-x-4">
          <TextInput
            required
            defaultValue={customer.first_name}
            label={t('register.firstname')}
            name="first_name"
          />
          <TextInput
            required
            defaultValue={customer.last_name}
            label={t('register.lastname')}
            name="last_name"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileName;
