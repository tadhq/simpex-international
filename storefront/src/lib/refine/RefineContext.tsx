'use client';

import { directusClient } from '@/config/directus';
import { MEDUSA_BACKEND_URL } from '@/config/env';
import { useNotificationProvider } from '@/lib/refine-mantine';
import medusaDataProvider, { authProvider } from '@/lib/refine-medusa';
import { Refine, RefineProps } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { dataProvider as directusDataProvider } from '@tspvivek/refine-directus';

interface Props extends RefineProps {}

export default function RefineContext({ children, ...props }: Props) {
  return (
    <Refine
      authProvider={authProvider(MEDUSA_BACKEND_URL)}
      dataProvider={{
        default: medusaDataProvider(`${MEDUSA_BACKEND_URL}/store`),
        admin: medusaDataProvider('/api/medusa/admin'),
        directus: directusDataProvider(directusClient),
      }}
      notificationProvider={useNotificationProvider}
      options={{
        disableTelemetry: true,
        mutationMode: 'optimistic',
        syncWithLocation: true,
        useNewQueryKeys: true,
      }}
      routerProvider={routerProvider}
      {...props}
    >
      {children}
    </Refine>
  );
}
