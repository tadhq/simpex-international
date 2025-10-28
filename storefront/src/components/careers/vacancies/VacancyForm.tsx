'use client';
import { CAPTCHA_SITE_KEY, DIRECTUS_TOKEN, DIRECTUS_URL } from '@/config/env';
import { getDirectusFile } from '@/lib/directus/utils';
import { FormFieldsType, useVacancySubmit } from '@/lib/ecommerce/hooks/useVacancySubmit';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Button, FileInput, Select, TextInput, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';

interface VacancyFormProps {
  vacancyId?: number;
}

export function VacancyForm({ vacancyId }: VacancyFormProps) {
  const t = useTranslations();
  const isSmallScreen = useMediaQuery('(max-width: 366px)');
  const genders = [
    { label: 'Man', value: 'male' },
    { label: t('careers.woman'), value: 'female' },
    { label: t('careers.other'), value: 'other' },
  ];
  const filesRef = useRef<any[]>([]);

  const { captcha, form, onSubmit, loading } = useVacancySubmit({
    onPreSubmit: (fields: FormFieldsType) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        const FOLDER_APPLICANTS_ID = 'c06b40d5-1aa2-4b95-b777-277426ae5a94';
        const fullName = `${fields.first_name} ${fields.last_name}`;
        formData.append('title', `${fullName} - CV`);
        formData.append('folder', FOLDER_APPLICANTS_ID);
        formData.append('file', fields.cv);
        formData.append('title', `${fullName} - Diplomas en Certificaten`);
        formData.append('folder', FOLDER_APPLICANTS_ID);
        formData.append('file', fields.diplomas);
        fetch(DIRECTUS_URL.concat('/files'), {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.errors) {
              const error = result.errors?.[0]?.message ?? 'Failed to upload files';
              reject(error);
            } else {
              filesRef.current = result.data;
              resolve(result);
            }
          })
          .catch((ex) => {
            reject(ex);
          });
      });
    },
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    successMessage: t('careers.thankYou'),
    onSuccess: () => {},
    transformFormData: (_fields: FormFieldsType) => {
      const fields: any = {
        ..._fields,
        vacancy: vacancyId
          ? {
              create: [
                {
                  vacancy: {
                    id: vacancyId,
                  },
                },
              ],
            }
          : undefined,
      };
      const files = filesRef?.current?.map((file) => ({
        file: file.id,
      }));
      if (files) fields['documents'] = files;
      if (!vacancyId) {
        delete fields.vacancy;
      }
      delete fields.diplomas;
      delete fields.cv;
      return JSON.stringify(fields);
    },
  });
  const { errors } = form;

  return (
    <form className="mt-12 flex rounded-lg" onSubmit={onSubmit}>
      <div className="bg-neutral-100 md:p-8 lg:p-12 p-4 w-full flex flex-col gap-4 rounded-lg md:rounded-none md:rounded-l-lg">
        <h2 className="text-xl font-bold">{t('careers.applyThisPosition')}</h2>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <TextInput
            withAsterisk
            label={t('register.firstname')}
            {...form.getInputProps('first_name')}
            disabled={loading}
            error={errors?.first_name}
          />
          <TextInput
            withAsterisk
            label={t('register.lastname')}
            {...form.getInputProps('last_name')}
            disabled={loading}
            error={errors?.last_name}
          />
          <TextInput
            withAsterisk
            label={t('careers.emailAddress')}
            {...form.getInputProps('email')}
            disabled={loading}
            error={errors?.email}
          />
          <TextInput
            withAsterisk
            label={t('careers.phoneNumber')}
            {...form.getInputProps('phone_number')}
            disabled={loading}
            error={errors?.phone_number}
          />
          <Select
            data={genders}
            disabled={loading}
            error={form.errors.gender}
            label={t('careers.gender')}
            placeholder={t('careers.genderPlaceholder')}
            {...form.getInputProps('gender')}
          />
        </div>
        <Textarea
          withAsterisk
          disabled={loading}
          label={t('careers.whyHireYou')}
          {...form.getInputProps('motivation')}
        />
        <FileInput
          withAsterisk
          accept=".pdf,.doc,.docx"
          label="Curriculum Vitae (.pdf/.doc/.docx)"
          placeholder={t('validations.noFileSelected')}
          {...form.getInputProps('cv')}
          disabled={loading}
          error={errors?.cv}
        />
        <FileInput
          withAsterisk
          accept=".pdf,.doc,.docx"
          label={t('careers.diplomasCertificates')}
          placeholder={t('validations.noFileSelected')}
          {...form.getInputProps('diplomas')}
          disabled={loading}
          error={errors?.diplomas}
        />
        <div>
          <HCaptcha
            ref={captcha.ref}
            sitekey={CAPTCHA_SITE_KEY}
            size={isSmallScreen ? 'compact' : 'normal'}
            onError={captcha.onError}
            onExpire={captcha.onExpire}
            onVerify={captcha.onVerify}
          />
        </div>
        <Button
          className="min-w-[180px] self-start"
          disabled={loading}
          loading={loading}
          type="submit"
        >
          {t('global.buttons.send')}
        </Button>
      </div>
      <div className="hidden md:flex justify-center items-center bg-neutral-50 p-6 w-full rounded-r-lg">
        <Image
          alt="Job opening"
          height={500}
          src={getDirectusFile('02fcce67-666d-4533-87b8-9281ebd0406e')}
          width={500}
        />
      </div>
    </form>
  );
}
