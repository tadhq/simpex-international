import { directusApi } from '@/lib/directus';

export default async function BannerText() {
  const headerTopSettings = (await directusApi.getHeaderTopSettings()) as any;

  if (!headerTopSettings) return null;

  return (
    <h1
      className="hidden ml-6 lg:flex"
      dangerouslySetInnerHTML={{ __html: headerTopSettings.banner_text }}
    />
  );
}
