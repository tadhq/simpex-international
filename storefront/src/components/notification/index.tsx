import { Icon } from '@/components/iconify';
import { NotificationData, showNotification } from '@mantine/notifications';

export const notification = {
  success: (message: string, options?: Omit<NotificationData, 'message'>) => {
    showNotification({
      message,
      color: 'green.6',
      icon: <Icon icon="ph:check-bold" />,
      autoClose: 5000,
      ...options,
    });
  },
  error: (message: string, options?: Omit<NotificationData, 'message'>) => {
    showNotification({
      message,
      color: 'red.6',
      icon: <Icon icon="ph:x-bold" />,
      autoClose: 5000,
      ...options,
    });
  },
};
