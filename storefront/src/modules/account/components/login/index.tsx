'use client';

import { logCustomerIn } from '@/modules/account/actions';
import ErrorMessage from '@/modules/checkout/components/error-message';
import { SubmitButton } from '@/modules/checkout/components/submit-button';
import { TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useFormState } from 'react-dom';

type Props = {};

const Register = ({}: Props) => {
  const [message, formAction] = useFormState(logCustomerIn, null);
  const t = useTranslations();

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-lg font-bold uppercase mb-6">{t('login.welcomeBack')}</h1>
      <p className="text-center text-base-regular  mb-8">{t('login.loginDescription')}</p>
      <form action={formAction} className="w-full">
        <div className="flex flex-col w-full gap-y-2">
          <TextInput
            required
            autoComplete="email"
            label="Email"
            name="email"
            title={t('validations.enterValidEmail')}
            type="email"
          />
          <TextInput
            required
            autoComplete="current-password"
            label={t('login.password')}
            name="password"
            type="password"
          />
        </div>
        <ErrorMessage error={message} />
        <SubmitButton className="w-full mt-6">{t('global.buttons.signIn')}</SubmitButton>
      </form>
      <span className="text-center text-sm mt-6">
        {t('login.noAccount')}{' '}
        <Link className="underline" href="/auth/register" prefetch={false}>
          {t('login.signUp')}
        </Link>
        .
      </span>
      <span className="text-center text-sm mt-6">
        <Link className="underline" href="/auth/password/reset" prefetch={false}>
          {t('login.forgetPassword')}
        </Link>
      </span>
    </div>
  );
};

export default Register;
