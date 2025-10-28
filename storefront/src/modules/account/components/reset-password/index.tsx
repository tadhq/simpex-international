'use client';

import { sendResetPasswordEmail } from '@/modules/account/actions';
import ErrorMessage from '@/modules/checkout/components/error-message';
import { SubmitButton } from '@/modules/checkout/components/submit-button';
import { TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {}

//TODO translations for english and dutch are not implemented yet
const ResetPassword = ({}: Props) => {
  const [message, formAction] = useFormState(sendResetPasswordEmail, null);
  const [submit, setSubmit] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const t = useTranslations();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  useEffect(() => {
    if (message?.success) {
      setSubmit(true);
    }
  }, [message]);

  if (submit && isValidEmail) {
    return (
      <div className=" w-full flex flex-col items-center">
        <h1 className="text-lg font-bold uppercase mb-6">{t('resetPassword.emailSent')}</h1>
        <p className="text-center text-base-regular">
          {t('resetPassword.mailSendTo')}&nbsp;
          <strong>{email}</strong>.
        </p>
        <p className="text-center text-base-regular mb-4">
          {t('resetPassword.followInstructions')}
        </p>
        <ErrorMessage error={message?.error} />
        <SubmitButton className="w-full max-w-sm mt-4" onClick={() => setSubmit(false)}>
          {t('global.buttons.retry')}
        </SubmitButton>
        <span className="text-center text-sm mt-6">
          <Link className="underline" href="/auth/login" prefetch={false}>
            {t('resetPassword.goBackToLogin')}
          </Link>
        </span>
      </div>
    );
  }

  return (
    <div className=" w-full flex flex-col items-center">
      <h1 className="text-lg font-bold uppercase mb-6">{t('resetPassword.resetTitle')}</h1>
      <p className="text-center text-base-regular">
        {t('resetPassword.resetDescriptionFirst')} <strong>{t('resetPassword.sendMail')}</strong>.
      </p>
      <p className="text-center text-base-regular mb-8">
        {t('resetPassword.resetDescriptionSecond')}
      </p>
      <form action={formAction} className="max-w-sm w-full">
        <div className="flex flex-col w-full gap-y-2">
          <TextInput
            required
            autoComplete="email"
            error={email && !isValidEmail ? t('validations.invalidEmail') : undefined}
            label="Email"
            name="email"
            title={t('validations.enterValidEmail')}
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <ErrorMessage error={message?.error} />
        <SubmitButton className="w-full mt-6" disabled={!isValidEmail}>
          {t('resetPassword.sendMail')}
        </SubmitButton>
      </form>
      <span className="text-center text-sm mt-6">
        <Link className="underline" href="/auth/login" prefetch={false}>
          {t('resetPassword.goBackToLogin')}
        </Link>
      </span>
    </div>
  );
};

export default ResetPassword;
