import { Select, SelectProps } from '@mantine/core';
import { Region } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface Props extends Omit<SelectProps, 'data'> {
  autoDefaultValue?: boolean;
  region?: Region;
  onChange?: (e: any) => void;
}

export default function CountrySelect({
  region,
  defaultValue,
  onChange,
  name,
  autoDefaultValue,
  ...props
}: Props) {
  const countryOptions = useMemo(() => {
    if (!region) {
      return [];
    }

    return region.countries.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [region]);

  const t = useTranslations('checkout');

  return (
    <Select
      checkIconPosition="right"
      data={countryOptions}
      defaultValue={autoDefaultValue ? countryOptions?.[0]?.value : defaultValue}
      label={t('country')}
      name={name}
      onChange={(value) =>
        onChange &&
        onChange({
          target: {
            name,
            value,
          },
        })
      }
      {...props}
    />
  );
}
