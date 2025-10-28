import { showNotification } from '@mantine/notifications';
import { useRef, useState } from 'react';

export const useCaptcha = () => {
  const ref = useRef(null) as any;
  const [verified, setVerified] = useState(false);

  const onExpire = () => {
    showNotification({
      color: 'red',
      title: 'Captcha',
      message: 'Token has expired',
    });
  };

  const onError = (error: string) => {
    showNotification({
      color: 'red',
      title: 'Captcha',
      message: `Error: ${error}`,
    });
  };

  const onVerify = (token: string) => {
    if (token) setVerified(true);
  };

  const onVerifyError = () => {
    showNotification({
      color: 'red',
      title: 'Captcha',
      message: `Please proof that you're human`,
    });
  };

  return {
    ref,
    verified,
    setVerified,
    onExpire,
    onError,
    onVerify,
    onVerifyError,
  };
};
