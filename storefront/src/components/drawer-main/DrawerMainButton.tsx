'use client';

import { Icon } from '@/components/iconify';
import { ActionIcon } from '@mantine/core';
import { useDrawerMain } from './DrawerMainContext';

export default function DrawerMainButton() {
  const [opened, { open }] = useDrawerMain();

  return (
    <ActionIcon className="md:hidden" color="white" variant="transparent" onClick={open}>
      <Icon fontSize={28} icon="ph:list" />
    </ActionIcon>
  );
}
