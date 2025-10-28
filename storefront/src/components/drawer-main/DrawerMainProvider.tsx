'use client';

import { Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DrawerMainContext } from './DrawerMainContext';

interface Props extends React.PropsWithChildren {
  content: React.ReactNode;
}

export default function DrawerMainProvider({ children, content }: Props) {
  const state = useDisclosure(false);

  return (
    <DrawerMainContext.Provider value={state}>
      {children}
      <Drawer opened={state[0]} size="sm" title="Menu" onClose={state[1].close}>
        {content}
      </Drawer>
    </DrawerMainContext.Provider>
  );
}
