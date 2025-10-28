import ResetPasswordTemplate from '@/modules/account/templates/reset-password-template';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('resetPassword.resetTitle'),
    description: t('resetPassword.metaResetPasswordDescription'),
  };
}

export default function Page({ params }: Props) {
  return <ResetPasswordTemplate />;
}
