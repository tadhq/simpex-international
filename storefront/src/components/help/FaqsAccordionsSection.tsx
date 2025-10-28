import { directusApi } from '@/lib/directus';
import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from '@mantine/core';
import { getLocale, getTranslations } from 'next-intl/server';
import { Icon } from '../iconify';

interface Props {
  image: DirectusFile;
}

export default async function FaqsAccordionsSection({ image }: Props) {
  const locale = await getLocale();
  const t = await getTranslations('social');
  const faqs = await directusApi.getFaqs({ locale });

  return (
    <section className="my-12 lg:my-16">
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center xl:px-32 px-4">
          <div className="relative aspect-square w-full max-w-md rounded-xl bg-white shadow-lg overflow-hidden">
            <Image fill alt="Hero image" className="object-cover" src={getDirectusFile(image)} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">{t('whyChooseUs')}</h2>
            <Accordion chevron={<Icon icon="ph:arrow-down-right" />} variant="separated">
              {faqs?.map((faq: any) => (
                <AccordionItem key={faq.id} value={String(faq.id)}>
                  <AccordionControl
                    classNames={{ label: 'flex flex-wrap gap-2 items-center justify-between' }}
                  >
                    <span>{faq.translations?.[0]?.title}</span>
                    {/* {faq.topic?.translations?.[0]?.title && (
                      <Pill className="mr-2" color="primary">
                        {faq.topic?.translations?.[0]?.title}
                      </Pill>
                    )} */}
                  </AccordionControl>
                  <AccordionPanel>
                    {faq.translations?.[0]?.content && (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.translations?.[0]?.content }}
                      />
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
