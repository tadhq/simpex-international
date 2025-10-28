import LoginTemplate from '@/modules/account/templates/login-template';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('headerMain.login'),
    description: t('login.metaLoginDescription'),
  };
}

export default function Page({ params }: Props) {
  return <LoginTemplate />;
}
