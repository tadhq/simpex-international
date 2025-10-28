import { Icon } from '@/components/iconify';
import { DirectusError } from '@directus/errors';
import { notifications } from '@mantine/notifications';

interface ErrorResponse {
  errors: DirectusError<{
    code: string | null;
    collection: string | null;
    field: string | null;
  }>[];
}

export function showDirectusErrors(ex: unknown) {
  const err = ex as ErrorResponse;
  const errorMessages: string[] = [];

  if (err.errors) {
    err.errors?.forEach((error) => {
      const message = error?.extensions?.code || 'Unknown cause';
      errorMessages.push(message);
    });
  } else {
    const message = (ex as Error)?.message || 'Unknown cause';
    errorMessages.push(message);
  }

  errorMessages?.forEach((message) => {
    notifications.show({
      title: 'Error',
      message,
      color: 'red',
      icon: <Icon icon="ph:warning" />,
    });
  });
}
