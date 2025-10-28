import type { Cart, ProductVariant, Region } from '@medusajs/medusa';

export interface ComputeAmountParams {
  amount: number;
  region: RegionInfo;
  includeTaxes?: boolean;
}

export interface ConvertToLocaleParams {
  amount: number;
  currency_code: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}

export interface FormatAmountParams {
  amount: number;
  region: RegionInfo;
  includeTaxes?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}

export interface CalculatedVariant extends ProductVariant {
  amount: number;
  calculated_price: number;
  calculated_price_type: 'sale' | 'default';
  original_price: number;
}

export interface CartWithCheckoutStep
  extends Omit<Cart, 'beforeInsert' | 'beforeUpdate' | 'afterUpdateOrLoad'> {
  checkout_step: 'address' | 'delivery' | 'payment';
}

export interface ProductContextParams {
  region?: string;
  currency?: string;
}

export type RegionInfo = Pick<Region, 'currency_code' | 'tax_code' | 'tax_rate'>;
