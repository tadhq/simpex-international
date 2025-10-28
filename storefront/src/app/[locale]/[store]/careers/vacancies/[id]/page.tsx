import { VacancyDetails } from '@/components/careers/vacancies/VacancyDetails';
import { VacancyForm } from '@/components/careers/vacancies/VacancyForm';
import { getVacancy } from '@/lib/directus/api';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { locale: string; id: string } }) {
  const vacancy = await getVacancy({
    id: params.id,
    locale: params.locale,
  });

  if (!vacancy) return notFound();

  return (
    <section className="my-10 lg:my-12">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <VacancyDetails vacancy={vacancy} />
        <VacancyForm vacancyId={vacancy.id} />
      </MotionDiv>
    </section>
  );
}
