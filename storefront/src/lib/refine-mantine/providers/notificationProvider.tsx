import { RingCountdown } from '@/lib/refine-mantine/components/ring-countdown';
import { ActionIcon, Box, Group } from '@mantine/core';
import { hideNotification, showNotification, updateNotification } from '@mantine/notifications';
import { NotificationProvider } from '@refinedev/core';
// TODO replace with iconify
import { IconCheck, IconRotate2, IconX } from '@tabler/icons-react';

export const useNotificationProvider = (): NotificationProvider => {
  const activeNotifications: string[] = [];

  const isNotificationActive = (key?: string) => {
    return activeNotifications.includes(key as string);
  };

  const addNotification = (key?: string) => {
    if (key) {
      const index = activeNotifications.indexOf(key);
      if (index === -1) {
        activeNotifications.push(key);
      }
    }
  };

  const removeNotification = (key?: string) => {
    if (key) {
      const index = activeNotifications.indexOf(key);
      if (index > -1) {
        activeNotifications.splice(index, 1);
      }
    }
  };

  const notificationProvider: NotificationProvider = {
    open: ({ message, description, type, undoableTimeout, key, cancelMutation }) => {
      if (type === 'progress') {
        if (isNotificationActive(key)) {
          updateNotification({
            id: key!,
            message: (
              <Group justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs">
                  <RingCountdown undoableTimeout={undoableTimeout ?? 0} />
                  <Box>
                    <p>{message}</p>
                    {description && <p>{description}</p>}
                  </Box>
                </Group>
                <ActionIcon
                  variant="default"
                  onClick={() => {
                    cancelMutation?.();
                    if (key) {
                      removeNotification(key);
                      hideNotification(key);
                    }
                  }}
                >
                  <IconRotate2 size={18} />
                </ActionIcon>
              </Group>
            ),
            styles: {
              root: {
                paddingLeft: '8px',
                paddingTop: '0px',
                paddingBottom: '0px',
                '&::before': { display: 'none' },
              },
            },
            disallowClose: true,
            autoClose: false,
          });
        } else {
          addNotification(key);
          showNotification({
            id: key,
            message: (
              <Group justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs">
                  <RingCountdown undoableTimeout={undoableTimeout ?? 0} />
                  <Box>
                    <p>{message}</p>
                    {description && <p>{description}</p>}
                  </Box>
                </Group>
                <ActionIcon
                  variant="default"
                  onClick={() => {
                    cancelMutation?.();
                    if (key) {
                      removeNotification(key);
                      hideNotification(key);
                    }
                  }}
                >
                  <IconRotate2 size={18} />
                </ActionIcon>
              </Group>
            ),

            styles: {
              root: {
                paddingLeft: '8px',
                paddingTop: '0px',
                paddingBottom: '0px',
                '&::before': { display: 'none' },
              },
            },
            disallowClose: true,
            autoClose: false,
          });
        }
      } else {
        if (isNotificationActive(key)) {
          updateNotification({
            id: key!,
            color: type === 'success' ? 'primary' : 'red',
            icon: type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />,
            message,
            title: description,
            autoClose: 5000,
          });
        } else {
          addNotification(key);
          showNotification({
            id: key!,
            color: type === 'success' ? 'primary' : 'red',
            icon: type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />,
            message,
            title: description,
            onClose: () => {
              removeNotification(key);
            },
            autoClose: 5000,
          });
        }
      }
    },
    close: (key) => {
      removeNotification(key);
      hideNotification(key);
    },
  };

  return notificationProvider;
};
