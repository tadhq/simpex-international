import ComingSoon from '@/components/home/ComingSoon';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: 'Coming Soon',
    description: 'Building',
  };
}

export default function Page({ params }: Props) {
  return <ComingSoon />;
}
