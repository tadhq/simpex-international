import { directusApi } from '@/lib/directus';
import { getTranslations } from 'next-intl/server';

export default async function Copyright() {
  const t = await getTranslations('footer');
  const generalSettings = await directusApi.getGeneralSettings();

  return (
    <p className="text-sm text-center leading-relaxed">
      &copy;
      {t('copyright', {
        year: new Date().getFullYear(),
        project: generalSettings.project_title,
      })}
      <a
        className="underline underline-offset-2"
        href="https://www.tad.sr"
        referrerPolicy="no-referrer"
        target="_blank"
      >
        TAD
      </a>
    </p>
  );
}
