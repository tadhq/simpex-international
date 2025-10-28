import { directusApi } from '@/lib/directus';
import Renderer from '@/lib/directus/renderer';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string; slug: string[]; store: string };
}

export default async function Page({ params }: Props) {
  const page = await directusApi.getPageBySlug({
    slug: params.slug.join('/'),
    locale: params.locale,
  });

  return (
    <main className="flex-1">
      <Renderer page={page as any} />
    </main>
  );
}
