'use client';

import { updateCustomerEmail } from '@/modules/account/actions';
import { TextInput } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import AccountInfo from '../account-info';

type MyInformationProps = {
  customer: Omit<Customer, 'password_hash'>;
};

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false);

  const [state, formAction] = useFormState(updateCustomerEmail, {
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
    <form action={formAction} className="w-full">
      <AccountInfo
        clearState={clearState}
        currentInfo={`${customer.email}`}
        errorMessage={state.error}
        isError={!!state.error}
        isSuccess={successState}
        label="Email"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <TextInput
            required
            autoComplete="email"
            defaultValue={customer.email}
            label="Email"
            name="email"
            type="email"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileEmail;
