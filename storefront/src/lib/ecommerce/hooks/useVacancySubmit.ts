import { DIRECTUS_URL } from '@/config/env';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { z } from 'zod';
import { useCaptcha } from './use-captcha';

interface VacancySubmitProps {
  onPreSubmit: (fields: FormFieldsType) => Promise<any>;
  successMessage: string;
  headers: Record<string, string>;
  transformFormData?: (fields: FormFieldsType) => string;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 25000000;
const ACCEPTED_FILE_TYPES = [
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formFields = z.object({
  first_name: z.string().min(1, { message: 'Required' }),
  last_name: z.string().min(1, { message: 'Required' }),
  email: z.string().email(),
  phone_number: z
    .string()
    .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{6,32}$/, 'Invalid phone number')
    .min(1, { message: 'Required' }),
  gender: z.string(),
  motivation: z.string().min(1, { message: 'Required' }),
  cv: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 25MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      'Only .docx, .doc and .pdf formats are supported.'
    )
    .refine((file) => file !== null, 'Required'),
  diplomas: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 25MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      'Only .docx, .doc and .pdf formats are supported.'
    )
    .refine((file) => file !== null, 'Required'),
  documents: z.array(z.object({ file: z.string() })).optional(),
});

export type FormFieldsType = z.infer<typeof formFields>;

export function useVacancySubmit({
  onPreSubmit,
  successMessage,
  headers,
  transformFormData,
  onSuccess,
}: VacancySubmitProps) {
  const form = useForm<FormFieldsType>({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      gender: 'male',
      motivation: '',
      cv: null,
      diplomas: null,
    },
    validate: zodResolver(formFields),
  });

  const [loading, setLoading] = useState<boolean>();

  const captcha = useCaptcha();

  const onSubmit = form.onSubmit(async (formData) => {
    // Check captcha
    if (!captcha.verified)
      return showNotification({
        color: 'red',
        message: "Please prove that you're human",
      });

    // Reset loading state
    setLoading(true);

    // Send API request
    try {
      if (onPreSubmit) await onPreSubmit(formData);
      const response = await fetch(DIRECTUS_URL.concat('/items/applicants'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: transformFormData ? transformFormData(formData) : JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.errors) {
        showNotification({
          color: 'red',
          message: 'Failed to submit this form',
        });
      } else {
        if (onSuccess) onSuccess();
        form.reset();
        showNotification({
          color: 'green',
          message: successMessage,
        });
      }
    } catch (ex: any) {
      showNotification({
        color: 'red',
        message: ex.message,
      });
    } finally {
      setLoading(false);
      captcha.setVerified(false);
      captcha.ref.current?.resetCaptcha();
    }
  });

  return {
    form,
    loading,
    onSubmit,
    captcha,
  };
}
