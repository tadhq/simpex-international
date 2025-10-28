import { Icon } from '@/components/iconify';
import { formatDistanceToNow } from 'date-fns';
import { enUS, nl } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useVacancyTypeMap } from './hooks';

interface VacancyItemProps {
  href: string;
  title?: string;
  type?: string | null;
  createdAt: string;
}

export default function VacancyItem({ href, title, type, createdAt }: VacancyItemProps) {
  const locale = useLocale();
  const { vacancyType } = useVacancyTypeMap(type);

  const dateLocale = locale === 'nl' ? nl : enUS;

  return (
    <Link
      className="flex items-center gap-4 py-4 transition hover:bg-neutral-100 focus:bg-neutral-200 lg:gap-8 xl:px-4 border-b border-gray-100"
      href={href}
    >
      <div className="flex flex-1 justify-between flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4">
        <div>{title && <h3 className="text-lg font-bold leading-tight">{title}</h3>}</div>
        <div className="flex flex-wrap gap-4">{vacancyType && <span>{vacancyType}</span>}</div>
        <span className="text-neutral-600">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: dateLocale })}
        </span>
      </div>
      <Icon className="h-6 w-5 text-neutral-400" icon="ph:caret-right" />
    </Link>
  );
}
