import isEmpty from 'lodash/isEmpty';
import {
  ComputeAmountParams,
  ConvertToLocaleParams,
  FormatAmountParams,
  RegionInfo,
} from '../types';

function convertToDecimal(amount: number) {
  return Math.floor(amount) / 100;
}

function getTaxRate(region?: RegionInfo) {
  return region && !isEmpty(region) ? region?.tax_rate / 100 : 0;
}

/**
 * Takes an amount, a region, and returns the amount as a decimal including or excluding taxes
 */
export function computeAmount({ amount, region, includeTaxes = true }: ComputeAmountParams) {
  const toDecimal = convertToDecimal(amount);

  const taxRate = includeTaxes ? getTaxRate(region) : 0;

  const amountWithTaxes = toDecimal * (1 + taxRate);

  return amountWithTaxes;
}

function convertToLocale({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: ConvertToLocaleParams) {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString();
}

/**
 * Takes an amount and a region, and converts the amount to a localized decimal format
 */
export function formatAmount({ amount, region, includeTaxes = true, ...rest }: FormatAmountParams) {
  const taxAwareAmount = computeAmount({
    amount,
    region,
    includeTaxes,
  });

  return convertToLocale({
    amount: taxAwareAmount,
    currency_code: region.currency_code,
    ...rest,
  });
}

export const getPercentageDiff = (original: number, calculated: number) => {
  const diff = original - calculated;
  const decrease = (diff / original) * 100;

  return decrease.toFixed();
};
