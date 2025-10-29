import { ComingSoon } from '@/components/home';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; slug: string[]; store: string };
}

export default function Page({ params }: Props) {
  return <ComingSoon />;
}
