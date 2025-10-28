import { DirectusSchema } from '@/lib/directus/types';
import Prose from '../Prose';
import { useVacancyTypeMap } from './hooks';

interface Props {
  vacancy: DirectusSchema['vacancies'];
}

export function VacancyDetails({ vacancy }: Props) {
  const { vacancyType } = useVacancyTypeMap(vacancy.type);

  const translated = vacancy?.translations?.[0] as any;

  return (
    <div className="flex flex-col gap-3">
      {translated?.title && <h1 className="text-3xl font-bold">{translated?.title}</h1>}
      {vacancyType && <p className="text-neutral-500">{vacancyType}</p>}
      {translated?.content && <Prose>{translated?.content}</Prose>}
    </div>
  );
}
