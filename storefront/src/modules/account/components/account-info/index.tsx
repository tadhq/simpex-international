import { Disclosure } from '@headlessui/react';
import { Alert, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';

type AccountInfoProps = {
  label: string;
  currentInfo: string | React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  clearState: () => void;
  children?: React.ReactNode;
};

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage,
  children,
}: AccountInfoProps) => {
  const [state, { close, toggle }] = useDisclosure();

  const { pending } = useFormStatus();

  const t = useTranslations();

  const handleToggle = () => {
    clearState();
    setTimeout(() => toggle(), 100);
  };

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess, close]);

  return (
    <div className="text-sm">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <span className="uppercase">{label}</span>
          <div className="flex items-center flex-1 basis-0 gap-x-4">
            {typeof currentInfo === 'string' ? (
              <span className="font-bold">{currentInfo}</span>
            ) : (
              errorMessage
            )}
          </div>
        </div>
        <div>
          <Button
            className="w-[100px] min-h-[25px] py-1"
            size="xs"
            type={state ? 'reset' : 'button'}
            variant="default"
            onClick={handleToggle}
          >
            {state ? t('global.buttons.cancel') : t('global.buttons.edit')}
          </Button>
        </div>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={cn(
            'transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden',
            {
              'max-h-[1000px] opacity-100': isSuccess,
              'max-h-0 opacity-0': !isSuccess,
            }
          )}
        >
          <Alert className="p-2 my-4" color="green">
            <span>
              {label} {t('global.messages.updatedSuccessful')}
            </span>
          </Alert>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={cn(
            'transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden',
            {
              'max-h-[1000px] opacity-100': isError,
              'max-h-0 opacity-0': !isError,
            }
          )}
        >
          <Alert className="p-2 my-4" color="red">
            <span>{errorMessage || t('global.messages.errorOccurred')}</span>
          </Alert>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={cn(
            'transition-[max-height,opacity] duration-300 ease-in-out overflow-visible',
            {
              'max-h-[1000px] opacity-100': state,
              'max-h-0 opacity-0': !state,
            }
          )}
        >
          <div className={cn('flex flex-col gap-y-2 py-4', state ? 'flex' : 'hidden')}>
            <div>{children}</div>
            <div className="flex items-center justify-end mt-2">
              <Button className="w-full lg:max-w-[180px]" loading={pending} type="submit">
                {t('global.buttons.saveChanges')}
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
};

export default AccountInfo;
