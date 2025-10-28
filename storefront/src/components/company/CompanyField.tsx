'use client';

import { Select, SelectProps } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCompanies } from './useCompanies';

interface Props extends SelectProps {
  autoDefaultValue?: boolean;
  defaultCompanyValue?: string;
}

export default function CompanyField({ autoDefaultValue, defaultCompanyValue, ...props }: Props) {
  const t = useTranslations();

  const { companies } = useCompanies();
  const [company, setCompany] = useState<string | null>(defaultCompanyValue || '');

  useEffect(() => {
    if (companies.length > 0) {
      const value = companies?.[0]?.value;
      if (autoDefaultValue && value) {
        setCompany(value);
      }
    }
  }, [companies, autoDefaultValue]);

  return (
    <Select
      required
      allowDeselect={false}
      autoComplete="company"
      data={companies}
      label={t('checkout.company')}
      name="company"
      placeholder={t('register.companyPlaceholder')}
      value={company}
      onChange={(value) => setCompany(value)}
      {...props}
    />
  );
}
