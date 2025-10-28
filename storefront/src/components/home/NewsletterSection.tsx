import NewsletterForm from '@/components/home/NewsletterForm';
import { DirectusFile } from '@/lib/directus/types';
import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { getTranslations } from 'next-intl/server';

interface Props {
  newsletter_title: string;
  newsletter_description: string;
  newsletter_image: DirectusFile;
  newsletter_background: DirectusFile;
}

export default async function NewsletterCtaSection({
  newsletter_title,
  newsletter_description,
  newsletter_image,
  newsletter_background,
}: Props) {
  const t = await getTranslations('newsletter');

  return (
    <div className="my-12 lg:my-16 p-4">
      <MotionDiv
        className="container relative overflow-hidden rounded-[20px]"
        {...fadeInUpEaseProps}
        transition={{
          ...fadeInUpEaseProps.transition,
          delay: 0.2,
        }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${getDirectusFile(newsletter_background.id)})`,
          }}
        />

        {/* Content Layout */}
        <div className="relative grid md:grid-cols-2 items-center py-12 px-6 gap-4 md:gap-6">
          <div className="relative max-w-md mb-5 lg:ml-28">
            <Image
              alt="Newsletter image"
              className="w-full h-auto object-contain justify-center items-center lg:justify-end"
              height={200}
              src={getDirectusFile(newsletter_image.id)}
              width={300}
            />
          </div>

          {/* Right - Text & Form */}
          <div className="relative max-w-lg text-white">
            <h2 className="text-3xl font-extrabold mb-3">{newsletter_title}</h2>
            <p className="text-base mb-6">{newsletter_description}</p>
            <NewsletterForm />
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
