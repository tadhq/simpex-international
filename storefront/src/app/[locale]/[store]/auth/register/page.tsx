import RegisterTemplate from '@/modules/account/templates/register-template';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('register.registerTitle'),
    description: t('register.metaRegisterDescription'),
  };
}

export default function Page({ params }: Props) {
  return <RegisterTemplate />;
}
