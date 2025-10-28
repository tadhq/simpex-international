'use client';

import { Icon } from '@/components/iconify';
import { formatAmount } from '@/lib/medusa/utils';
import { removeDiscount, removeGiftCard, submitDiscountForm } from '@/modules/checkout/actions';
import ErrorMessage from '@/modules/checkout/components/error-message';
import { ActionIcon, TextInput, Title } from '@mantine/core';
import { Cart } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../submit-button';

type DiscountCodeProps = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const { discounts, gift_cards, region } = cart;

  const t = useTranslations();

  const appliedDiscount = useMemo(() => {
    if (!discounts || !discounts.length) {
      return undefined;
    }

    switch (discounts[0].rule.type) {
      case 'percentage':
        return `${discounts[0].rule.value}%`;
      case 'fixed':
        return `- ${formatAmount({
          amount: discounts[0].rule.value,
          region: region,
        })}`;

      default:
        return t('checkout.freeShipping');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discounts, region]);

  const removeGiftCardCode = async (code: string) => {
    await removeGiftCard(code, gift_cards);
  };

  const removeDiscountCode = async () => {
    await removeDiscount(discounts[0].code);
  };

  const [message, formAction] = useFormState(submitDiscountForm, null);

  return (
    <div className="w-full flex flex-col">
      <div className="txt-medium">
        {gift_cards.length > 0 && (
          <div className="flex flex-col mb-4">
            <Title className="txt-medium" order={4}>
              {t('cart.giftcardApplied')}
            </Title>
            {gift_cards?.map((gc) => (
              <div
                key={gc.id}
                className="flex items-center justify-between txt-small-plus"
                data-testid="gift-card"
              >
                <p className="flex gap-x-1 items-baseline">
                  <span>Code: </span>
                  <span className="truncate" data-testid="gift-card-code">
                    {gc.code}
                  </span>
                </p>
                <p className="font-semibold" data-testid="gift-card-amount" data-value={gc.balance}>
                  {formatAmount({
                    region: region,
                    amount: gc.balance,
                    includeTaxes: false,
                  })}
                </p>
                <ActionIcon
                  color="red"
                  data-testid="remove-gift-card-button"
                  title={t('checkout.removeGiftCardFromOrder')}
                  onClick={() => removeGiftCardCode(gc.code)}
                >
                  <Icon icon="ph:trash-bold" />
                </ActionIcon>
              </div>
            ))}
          </div>
        )}

        {appliedDiscount ? (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Title className="txt-medium" order={4}>
                {t('cart.discountApplied')}
              </Title>
              <div
                className="flex items-center justify-between w-full max-w-full"
                data-testid="discount-row"
              >
                <p className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                  <span>Code:</span>
                  <span className="truncate" data-testid="discount-code">
                    {discounts[0].code}
                  </span>
                  <span
                    className="min-w-fit"
                    data-testid="discount-amount"
                    data-value={discounts[0].rule.value}
                  >
                    ({appliedDiscount})
                  </span>
                </p>
                <ActionIcon
                  color="red"
                  data-testid="remove-discount-button"
                  title={t('checkout.removeDiscountCodeFromOrder')}
                  onClick={removeDiscountCode}
                >
                  <Icon icon="ph:trash-bold" />
                </ActionIcon>
              </div>
            </div>
          </div>
        ) : (
          <form action={formAction} className="w-full">
            <div className="flex w-full gap-x-2 items-center">
              <TextInput
                className="flex-1"
                data-testid="discount-input"
                name="code"
                placeholder={t('cart.giftcardDiscountCode')}
              />
              <SubmitButton data-testid="discount-apply-button" size="sm">
                {t('global.buttons.apply')}
              </SubmitButton>
            </div>
            <ErrorMessage data-testid="discount-error-message" error={message} />
          </form>
        )}
      </div>
    </div>
  );
};

export default DiscountCode;
