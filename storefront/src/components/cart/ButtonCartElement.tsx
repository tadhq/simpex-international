'use client';

import { useCartDrawer } from '@/components/cart-drawer';
import { Icon } from '@/components/iconify';
import { Button, ButtonProps, Indicator, IndicatorProps } from '@mantine/core';

interface Props extends ButtonProps {
  indicatorProps: IndicatorProps;
}

export default function ButtonCartElement({ children, indicatorProps, ...props }: Props) {
  const [opened, { open }] = useCartDrawer();

  return (
    <Indicator inline color="red" size={24} {...indicatorProps}>
      <Button
        classNames={{
          root: 'ml-2 pe-4 rounded-3xl',
          section: 'me-auto xs:me-2',
          label: 'hidden xs:flex',
        }}
        color="#213d6e"
        leftSection={<Icon height={20} icon="solar:cart-large-minimalistic-bold" />}
        size="md"
        onClick={open}
        {...props}
      >
        {children}
      </Button>
    </Indicator>
  );
}
