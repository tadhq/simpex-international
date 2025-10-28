'use client';

import { Icon } from '@/components/iconify';
import { mutateForm } from '@/lib/directus/api';
import { showDirectusErrors } from '@/lib/directus/errors';
import { DirectusSchema, FormItem } from '@/lib/directus/types';
import { renderFields } from '@/modules/formWizard/renderFields';
import { FormWizardField } from '@/modules/formWizard/types';
import { getInitialValues } from '@/modules/formWizard/utils/initialValues';
import { getValidations } from '@/modules/formWizard/utils/validations';
import { validators } from '@/modules/formWizard/utils/validators';
import { Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function SubmitForm({
  settings: { schema, collection, notification_success_options },
}: {
  settings: FormItem;
}) {
  // Hydrate validations
  const fields = schema.map((field) => {
    if (field.meta?.validation) {
      const validatorFn = validators[field.meta.validation as keyof typeof validators];
      if (validatorFn) field.meta.validation = validatorFn();
    }
    return field;
  }) as FormWizardField[];

  const [pending, setPending] = useState(false);
  const form = useForm({
    validateInputOnBlur: true,
    initialValues: getInitialValues(fields),
    validate: (values) => getValidations(fields, values),
  });

  const t = useTranslations();

  const handleSubmit = async (values: Record<string, any>) => {
    // Disable submit button
    setPending(true);

    try {
      await mutateForm(collection as keyof DirectusSchema, values);
      showNotification({
        title: 'Success',
        message: t('global.messages.informationSent'),
        color: 'green.6',
        icon: <Icon icon="ph:check-bold" />,
        autoClose: 5000,
        ...(notification_success_options ?? {}),
      });
      form.reset();
    } catch (error) {
      showDirectusErrors(error);
    } finally {
      setPending(false);
    }
  };

  const renderedFields = renderFields({ fields, form });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-2 mb-6">
        {renderedFields}
      </div>
      <Button
        fullWidth
        disabled={pending}
        rightSection={<Icon icon="ph:paper-plane-right" />}
        type="submit"
      >
        {t('global.buttons.send')}
      </Button>
    </form>
  );
}
