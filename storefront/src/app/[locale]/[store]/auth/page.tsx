import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; store: string };
}

export default function Page({ params }: Props) {
  const store = params.store;
  redirect(`/${store}/auth/login`);
}
