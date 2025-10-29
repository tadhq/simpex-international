import { appConfig } from '@/config/app';
import { directusApi } from '@/lib/directus';
import { getDirectusFile } from '@/lib/directus/utils';
import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const generalSettings = await directusApi.getGeneralSettings();

  return {
    // name: generalSettings.project_title as any,
    name: 'Simpex International',
    // short_name: generalSettings.manifest_short_name as any,
    short_name: 'Simpex International',
    // description: generalSettings.meta_description ?? '',
    description:
      'Simpex International is a global leader in the production and distribution of high-quality products.',
    start_url: '/',
    display: 'fullscreen',
    background_color: '#FFFFFF',
    theme_color: appConfig.colors.primary[600],
    // icons: [
    //   {
    //     src: getDirectusFile(generalSettings.manifest_icon),
    //     sizes: 'any',
    //     type: 'image/png',
    //   },
    // ],
  };
}
