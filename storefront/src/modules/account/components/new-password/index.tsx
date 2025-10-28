'use client';

import { updatePassword } from '@/modules/account/actions';
import ErrorMessage from '@/modules/checkout/components/error-message';
import { SubmitButton } from '@/modules/checkout/components/submit-button';
import { TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

type Props = {};

//TODO translations for english and dutch are not implemented yet
const NewPassword = ({}: Props) => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const t = useTranslations();

  const [message, formAction] = useFormState(updatePassword, null);
  const [submit, setSubmit] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  useEffect(() => {
    if (message?.success) {
      setSubmit(true);
    }
  }, [message]);

  if (submit) {
    return (
      <div className=" w-full flex flex-col items-center">
        <h1 className="text-lg font-bold uppercase mb-6">{t('newPassword.passwordUpdated')}</h1>
        <p className="text-center text-base-regular flex">
          {t('newPassword.passwordUpdatedDescription')}
        </p>
        <p className="text-center text-base-regular mb-8">{t('newPassword.pressButtonToLogin')}</p>
        <ErrorMessage error={message?.error} />
        <Link
          className="w-full max-w-sm mt-6 text-center bg-primary-600 text-white font-bold rounded-lg py-2"
          href={'/auth/login'}
        >
          {t('headerMain.login')}
        </Link>
      </div>
    );
  }

  return (
    <div className=" w-full flex flex-col items-center">
      <h1 className="text-lg font-bold uppercase mb-6">{t('newPassword.newPasswordTitle')}</h1>
      <p className="text-center text-base-regular flex mb-6">{t('newPassword.enterNewPassword')}</p>
      <form action={formAction} className="max-w-sm w-full">
        <div className="flex flex-col w-full gap-y-2">
          <input name="email" type="hidden" value={email || ''}></input>
          <input name="token" type="hidden" value={token || ''}></input>
          <TextInput
            required
            autoComplete="password"
            error={
              password.length > 0 && !(password.length >= 6)
                ? t('validations.passwordLength')
                : null
            }
            label={t('login.password')}
            name="password"
            title={t('validations.enterValidPassword')}
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <TextInput
            required
            error={password === confirmPassword ? null : t('validations.sameConfirmPassword')}
            label={t('register.confirmPassword')}
            name="confirm_password"
            title={t('validations.confirmYourPassword')}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <ErrorMessage error={message?.error} />
        <SubmitButton className="w-full mt-6" disabled={password !== confirmPassword}>
          {t('newPassword.save')}
        </SubmitButton>
      </form>
    </div>
  );
};

export default NewPassword;
