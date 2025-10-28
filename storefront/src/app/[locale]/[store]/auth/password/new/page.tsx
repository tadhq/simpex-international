import NewPasswordTemplate from '@/modules/account/templates/new-password-template';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('newPassword.newPasswordTitle'),
    description: t('newPassword.enterNewPassword'),
  };
}

export default function Page({ params }: Props) {
  return <NewPasswordTemplate />;
}
