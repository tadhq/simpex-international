import NewsletterForm from '@/components/home/NewsletterForm';
import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Button, Image } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import type { Route } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface Props {
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_url: string;
  cta_image: DirectusFile;
  newsletter_title: string;
  newsletter_description: string;
  newsletter_image: DirectusFile;
  cta_enabled: boolean;
  newsletter_enabled: boolean;
}

export default async function NewsletterCtaSection({
  cta_title,
  cta_description,
  cta_button_text,
  cta_button_url,
  cta_image,
  newsletter_title,
  newsletter_description,
  newsletter_image,
  cta_enabled,
  newsletter_enabled,
}: Props) {
  const t = await getTranslations('newsletter');

  return (
    <section className="my-12 lg:my-16">
      <div
        className={cn('container', {
          'grid md:grid-cols-2 lg:grid-cols-[40%_auto] gap-4 xl:gap-6':
            cta_enabled && newsletter_enabled,
        })}
      >
        {cta_enabled && (
          <MotionDiv
            className={cn(
              'relative overflow-hidden flex justify-center items-start bg-primary-50 py-12 px-6 rounded-lg bg-no-repeat bg-right-bottom bg-contain',
              {
                'flex-col': newsletter_enabled,
                'flex-col lg:flex-row': !newsletter_enabled,
              }
            )}
            style={{ backgroundImage: `url(${getDirectusFile(cta_image)})` }}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from from-primary-50 to-primary-50/60 sm:to-transparent md:to-primary-50/60 lg:to-transparent"></div>
            {!newsletter_enabled && (
              <div className="absolute hidden lg:flex left-0 bottom-0 h-full">
                <Image
                  alt=""
                  className="object-contain scale-x-[-1] h-full"
                  src={getDirectusFile(cta_image)}
                />
              </div>
            )}
            <div
              className={cn('max-w-72 relative', {
                'text-left lg:text-center': !newsletter_enabled,
              })}
            >
              <h2 className="text-xl/snug font-bold mb-2">{cta_title}</h2>
              <p className="mb-4 text-base-600 text-sm">{cta_description}</p>
              <Button component={Link} href={cta_button_url as Route}>
                {cta_button_text}
              </Button>
            </div>
          </MotionDiv>
        )}
        {newsletter_enabled && (
          <MotionDiv
            className="flex flex-col overflow-hidden items-start relative justify-center py-12 px-6 bg-primary-50 rounded-lg bg-no-repeat bg-right-bottom bg-contain"
            style={{ backgroundImage: `url(${getDirectusFile(newsletter_image)})` }}
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.2,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from from-primary-50 to-primary-50/60 sm:to-transparent md:to-primary-50/60 lg:to-transparent"></div>
            <div className="max-w-xs relative">
              <h2 className="text-xl/snug font-bold mb-3">{newsletter_title}</h2>
              <div className="mb-3">
               <NewsletterForm/>
              </div>
              <p className="text-xs text-base-600">{newsletter_description}</p>
            </div>
          </MotionDiv>
        )}
      </div>
    </section>
  );
}
