'use client';

import B2BConditional from '@/components/b2b/B2BConditional';
import CompanyField from '@/components/company/CompanyField';
import { useCompanies } from '@/components/company/useCompanies';
import { updateCustomerCompany } from '@/modules/account/actions';
import { TextInput } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import AccountInfo from '../account-info';

type MyInformationProps = {
  customer: Omit<Customer, 'password_hash'>;
};

const ProfileCompany: React.FC<MyInformationProps> = ({ customer }) => {
  const defaultCompanyValue = (customer.metadata?.company as string) || '';

  const { companies } = useCompanies();
  const [successState, setSuccessState] = useState(false);

  const [state, formAction] = useFormState(updateCustomerCompany, {
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

  // Extract the company name from customer metadata
  const currentCompany = companies?.find((item) => item.value === defaultCompanyValue);

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        clearState={clearState}
        currentInfo={currentCompany?.label || defaultCompanyValue}
        errorMessage={state.error}
        isError={!!state.error}
        isSuccess={successState}
        label={t('checkout.company')}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <B2BConditional>
            <CompanyField defaultCompanyValue={defaultCompanyValue} />
          </B2BConditional>
          <B2BConditional elseif>
            <TextInput
              autoComplete="company"
              defaultValue={defaultCompanyValue}
              label={t('checkout.company')}
              name="company"
            />
          </B2BConditional>
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileCompany;
