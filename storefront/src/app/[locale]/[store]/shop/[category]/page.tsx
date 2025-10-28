import { redirect } from 'next/navigation';
import { stringify } from 'qs';

interface Props {
  params: { locale: string; category: string };
}

export default function Page({ params }: Props) {
  const qs = stringify({
    filters: [
      {
        field: 'category_id',
        operator: 'eq',
        value: [params.category],
      },
    ],
  });

  redirect(`/shop?${qs}`);
}
