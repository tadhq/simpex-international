'use client';

import { Button } from '@mantine/core';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  className,
  size = 'md',
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  size?: string;
  onClick?: any;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={className}
      disabled={disabled}
      loading={pending}
      size={size}
      type="submit"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
