import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import ContactFormBlock from './ContactFormBlock';
import ContactInfo from './ContactInfo';

export default async function ContactInfoFormSection({
  title,
  contactInfo,
  image,
}: {
  contactInfo?: Record<string, any>[] | null;
  title?: string | null;
  image?: string | null;
}) {
  return (
    <section className="my-16">
      <MotionDiv className="container grid gap-y-16 md:grid-cols-2" {...fadeInUpEaseProps}>
        <div className="md:pr-8">
          <div className="relative h-48 max-w-xl overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 lg:h-72 xl:h-80">
            <Image fill alt="Map" className="h-full w-full object-cover" src={image} />
          </div>
          <ContactInfo contactInfo={contactInfo} />
        </div>
        <ContactFormBlock title={title} />
      </MotionDiv>
    </section>
  );
}
