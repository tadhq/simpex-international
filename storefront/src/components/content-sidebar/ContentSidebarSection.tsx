import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import ContentBlock from './ContentBlock';
import SidebarBlock from './SidebarBlock';

export default function ContentSidebarSection({
  links,
  content,
}: {
  links: Record<string, any>[] | null;
  content: string;
}) {
  return (
    <section className="mx-auto">
      <div className="container lg:flex">
        {links && (
          <MotionDiv className="w-full lg:w-4/12" {...fadeInUpEaseProps}>
            <SidebarBlock links={links} />
          </MotionDiv>
        )}
        {content && (
          <MotionDiv
            className="w-full py-2 md:py-4 lg:pl-16 lg:py-8 prose max-w-none prose-h2:mb-1 prose-headings:mt-0"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1,
            }}
          >
            <ContentBlock content={content} />
          </MotionDiv>
        )}
      </div>
    </section>
  );
}
