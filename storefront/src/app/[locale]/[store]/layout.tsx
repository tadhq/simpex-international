import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'react-international-phone/style.css';
import '../../../styles/globals.css';

import { MainLayout } from '@/components/layouts';
import { GTM_CONTAINER_ID } from '@/config/env';
import { locales } from '@/config/i18n';
import { theme } from '@/config/mantine';
import { directusApi } from '@/lib/directus';
import { getDirectusFile } from '@/lib/directus/utils';
import { RefineContext } from '@/lib/refine';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { GoogleTagManager } from '@next/third-parties/google';
import pick from 'lodash/pick';
import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Lato } from 'next/font/google';

const font = Lato({ weight: ['400', '700', '900'], subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const generalSettings = await directusApi.getGeneralSettings();

  const ogImages = [];
  if ((generalSettings.og_image as any)?.id) {
    ogImages.push({
      url: getDirectusFile(generalSettings.og_image),
    });
  }

  return {
    title: {
      template: `%s | ${generalSettings.project_title}`,
      default: generalSettings.project_title as any,
    },
    description: generalSettings.meta_description,
    manifest: '/manifest.json',
    metadataBase: new URL('http://localhost:3000'),
    icons: {
      icon: getDirectusFile(generalSettings.favicon),
      shortcut: getDirectusFile(generalSettings.favicon),
    },
    openGraph: {
      images: ogImages,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface Props extends React.PropsWithChildren {
  params: { locale: string; store: string };
}

export default function Layout({ children, params }: Props) {
  const messages = useMessages();

  return (
    <html lang={params.locale}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={font.className}>
        <MantineProvider theme={theme}>
          <RefineContext
            resources={[
              {
                name: 'shop',
                list: '/shop',
              },
            ]}
          >
            <NextIntlClientProvider
              locale={params.locale}
              // TODO rename namespaces to camel case
              messages={pick(
                messages,
                'global',
                'product',
                'searchbar',
                'money',
                'resources',
                'login',
                'register',
                'resetPassword',
                'newPassword',
                'headerMain',
                'validations',
                'shop',
                'cart',
                'checkout',
                'orderCompleted',
                'account',
                'accountOrders',
                'accountAddresses',
                'accountProfile',
                'accountWishlist',
                'careers',
                'newsletter'
              )}
            >
              <MainLayout params={{ ...params, store: params.store }}>{children}</MainLayout>
            </NextIntlClientProvider>
          </RefineContext>
          <Notifications position="top-center" />
        </MantineProvider>
        <GoogleTagManager gtmId={GTM_CONTAINER_ID} />
      </body>
    </html>
  );
}
