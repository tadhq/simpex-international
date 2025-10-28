'use client';

import { Icon } from '@/components/iconify';
import { DIRECTUS_TOKEN } from '@/config/env';
import { SubmitButton } from '@/modules/checkout/components/submit-button';
import { Button, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import CustomerGroupField from './CustomerGroupField';

const Register = () => {
  const t = useTranslations();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const AccountCreationMessage = () => {
    return (
      <div className="bg-green-100 border border-green-400 p-10 rounded-lg max-w-sm text-center justify-center flex flex-col items-center">
        <Icon className="text-green-800" height={60} icon={'iconoir:check-circle-solid'} />
        <p className="mt-4">Your request is submitted. Wait for approval before logging in.</p>
        <span className="text-center text-sm mt-6">
          <Link className="underline" href="/" prefetch={false}>
            <Button className="rounded-full px-10" size="md">
              Go back to homepage
            </Button>
          </Link>
        </span>
      </div>
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert(t('validations.sameConfirmPassword'));
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    formData.delete('confirm_password');

    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('https://cms.hj.nep2.cloud.tad.sr/items/user_validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.status === 200) {
        setSuccess(true);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success === true ? (
        <AccountCreationMessage />
      ) : (
        <div className="max-w-sm flex flex-col items-center">
          <h1 className="text-lg font-bold uppercase mb-6">{t('login.signUp')}</h1>
          <p className="text-center text-base-regular  mb-4">{t('register.registerDescription')}</p>
          <form className="w-full flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-y-2">
              <CustomerGroupField />
              <TextInput
                required
                autoComplete="given-name"
                label={t('register.firstname')}
                name="first_name"
              />
              <TextInput
                required
                autoComplete="family-name"
                label={t('register.lastname')}
                name="last_name"
              />
              <TextInput
                required
                autoComplete="adress"
                label={t('register.address')}
                name="address"
              />
              <TextInput required autoComplete="email" label="Email" name="email" type="email" />
              <TextInput
                required
                autoComplete="tel"
                label={t('checkout.phone')}
                name="phone_number"
                type="tel"
              />
              <TextInput
                required
                autoComplete="new-password"
                label={t('login.password')}
                name="password"
                type="password"
                onChange={handlePasswordChange}
              />
              <TextInput
                required
                label={t('validations.confirmYourPassword')}
                name="confirm_password"
                type="password"
                onChange={handleConfirmPasswordChange}
              />
            </div>
            <span className="text-center text-sm mt-6">
              {t('register.policyDescription')}{' '}
              <Link className="underline" href="/legal/privacy-policy" prefetch={false}>
                {t('register.privacyPolicy')}
              </Link>{' '}
              {t('register.and')}{' '}
              <Link className="underline" href="/legal/terms-of-use" prefetch={false}>
                {t('register.termsOfUse')}
              </Link>
              .
            </span>
            <SubmitButton className="w-full mt-6">{t('global.buttons.createAccount')}</SubmitButton>
          </form>
          <span className="text-center text-sm mt-6">
            {t('login.title')}{' '}
            <Link className="underline" href="/auth/login" prefetch={false}>
              {t('global.buttons.loginIcon')}
            </Link>
            .
          </span>
        </div>
      )}
    </>
  );
};

export default Register;
