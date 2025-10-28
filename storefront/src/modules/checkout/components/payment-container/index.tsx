import RadioDecoration from '@/components/common/RadioDecoration';
import { RadioGroup } from '@headlessui/react';
import { PaymentSession } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import BankTransferInstructions from './BankTransferInstructions';

type PaymentContainerProps = {
  paymentSession: PaymentSession;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentSession,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  return (
    <>
      <RadioGroup.Option
        key={paymentSession.id}
        className={cn(
          'flex flex-col gap-y-2 text-sm cursor-pointer border rounded-xl p-4 mb-2 hover:shadow',
          {
            'border-primary-600': selectedPaymentOptionId === paymentSession.provider_id,
          }
        )}
        disabled={disabled}
        value={paymentSession.provider_id}
      >
        <div className="flex justify-between">
          <div className="flex gap-x-4">
            <RadioDecoration checked={selectedPaymentOptionId === paymentSession.provider_id} />
            <div>
              <p className="font-semibold">
                {paymentInfoMap[paymentSession.provider_id]?.title || paymentSession.provider_id}
              </p>
              {paymentSession.provider_id === 'bank-transfer' &&
                paymentSession.provider_id === selectedPaymentOptionId && (
                  <BankTransferInstructions />
                )}
            </div>
          </div>
          <span className="justify-self-end">
            {paymentInfoMap[paymentSession.provider_id]?.icon}
          </span>
        </div>
      </RadioGroup.Option>
    </>
  );
};

export default PaymentContainer;
