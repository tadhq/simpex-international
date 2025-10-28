import { Icon } from '@/components/iconify';
import { directusApi } from '@/lib/directus';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { getLocale, getTranslations } from 'next-intl/server';
import VacancyItem from './VacancyItem';

export default async function VacanciesSection() {
  const locale = await getLocale();
  const vacancies = await directusApi.getAllVacancies({ locale });
  const t = await getTranslations();

  return (
    <section className="my-10 lg:my-12">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        {vacancies.length > 0 ? (
          vacancies.map((vacancy: any) => (
            <VacancyItem
              key={vacancy.id}
              createdAt={vacancy.created_at!}
              href={`/careers/vacancies/${vacancy.id}`}
              title={vacancy.translations?.[0]?.title}
              type={vacancy.type}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 p-4">
            <Icon className="h-16 w-16 text-primary-600" icon="ph:magnifying-glass" />
            <h1 className="text-lg font-bold">{t('global.messages.emptyVacancies')}</h1>
            <span className="text-center">
              <p>{t('global.messages.emptyVacanciesDescription')}</p>
            </span>
          </div>
        )}
      </MotionDiv>
    </section>
  );
}
