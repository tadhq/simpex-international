import { directusApi } from '@/lib/directus';
import { FormItem } from '@/lib/directus/types';
import SubmitForm from '@/modules/form/submitForm';
import { getLocale } from 'next-intl/server';

export default async function ContactFormBlock({ title }: { title?: string | null }) {
  const locale = await getLocale();
  const form = await directusApi.getFormBySlug({
    slug: 'contact',
    locale: locale,
  });

  return (
    <div>
      <div className="shadow-lg ring-1 ring-black/10 rounded-xl py-6 px-4 lg:p-8">
        {title && <h2 className="text-2xl lg:text-3xl text-center font-bold">{title}</h2>}
        {form && (
          <div className="mt-8">
            <SubmitForm settings={form as unknown as FormItem} />
          </div>
        )}
      </div>
    </div>
  );
}
