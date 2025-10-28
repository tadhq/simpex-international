'use client';

import { updateCustomerPassword } from '@/modules/account/actions';
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

  const [state, formAction] = useFormState(updateCustomerPassword, {
    customer,
    success: false,
    error: false,
  });

  const t = useTranslations();

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  return (
    <form action={formAction} className="w-full" onReset={() => clearState()}>
      <AccountInfo
        clearState={clearState}
        currentInfo={<span>{t('accountProfile.passwordNotShown')}</span>}
        errorMessage={state.error}
        isError={!!state.error}
        isSuccess={successState}
        label={t('login.password')}
      >
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            required
            label={t('accountProfile.oldPassword')}
            name="old_password"
            type="password"
          />
          <TextInput
            required
            label={t('newPassword.newPasswordTitle')}
            name="new_password"
            type="password"
          />
          <TextInput
            required
            label={t('register.confirmPassword')}
            name="confirm_password"
            type="password"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileName;
