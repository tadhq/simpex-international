'use client';

import { notification } from '@/components/notification';
import { subscribeNewsletter } from '@/lib/directus/actions/newsletter';
import { Button, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

export default function NewsletterForm() {
  const t = useTranslations();

  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(subscribeNewsletter, null);

  useEffect(() => {
    switch (state?.message) {
      case 'success':
        notification.success(t('newsletter.submitSuccess'));
        formRef.current?.reset();
        break;
      case 'error':
        notification.error(t('newsletter.submitError'));
        break;
      case 'RECORD_NOT_UNIQUE':
        notification.error(t('newsletter.submitErrorUnique'));
        break;
      default:
        if (typeof state?.message === 'string') {
          notification.error(state?.message);
        }
    }
  }, [state, t]);

  return (
    <form ref={formRef} action={formAction}>
      <TextInput
        required
        className="max-w-sm"
        name="email"
        placeholder={t('newsletter.input')}
        radius={'xl'}
        rightSection={<SubmitButton />}
        rightSectionWidth={130}
        size="md"
        type="email"
      />
    </form>
  );
}

function SubmitButton() {
  const t = useTranslations();

  const { pending } = useFormStatus();

  return (
    <Button fullWidth disabled={pending} loading={pending} radius={'xl'} size="md" type="submit">
      {t('newsletter.submit')}
    </Button>
  );
}
