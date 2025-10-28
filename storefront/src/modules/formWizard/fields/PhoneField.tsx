import { TextInput, TextInputProps } from '@mantine/core';
import { CountrySelector, defaultCountries, usePhoneInput } from 'react-international-phone';
import { GetInputPropsReturnType } from '../types';

interface Props extends TextInputProps {
  inputProps: GetInputPropsReturnType;
}

export default function PhoneField({ inputProps, ...props }: Props) {
  const { value, onChange, ...otherInputProps } = inputProps;
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    countries: defaultCountries,
    defaultCountry: 'sr',
    forceDialCode: true,
    value: value,
    onChange: (data) => onChange(data.phone),
  });

  return (
    <TextInput
      ref={inputRef}
      autoComplete="tel"
      error={inputProps.error}
      leftSection={
        // TODO add subset of countries
        <CountrySelector
          buttonStyle={{
            ['--react-international-phone-height' as any]: 'calc(var(--_input-size) - 2px)',
            ['--react-international-phone-country-selector-background-color' as any]: 'transparent',
            ['--react-international-phone-country-selector-background-color-hover' as any]:
              'transparent',
            border: 'none',
          }}
          preferredCountries={['sr', 'nl']}
          selectedCountry={country.iso2}
          onSelect={({ iso2 }) => setCountry(iso2)}
        />
      }
      leftSectionPointerEvents="visible"
      leftSectionWidth={55}
      styles={{
        section: { zIndex: 'initial' },
      }}
      type="tel"
      value={inputValue}
      onChange={handlePhoneValueChange}
      {...otherInputProps}
      {...props}
    />
  );
}
