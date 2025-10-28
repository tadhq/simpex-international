import { useTranslations } from 'next-intl';

export const useVacancyTypeMap = (type?: string | null) => {
  const t = useTranslations();
  let vacancyType = type;

  switch (type) {
    case 'full-time':
      vacancyType = t('careers.full_time');
      break;
    case 'part-time':
      vacancyType = t('careers.part_time');
      break;
  }

  return { vacancyType };
};
