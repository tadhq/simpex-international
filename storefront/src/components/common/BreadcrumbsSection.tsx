import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';
import Breadcrumbs, { BreadcrumbsProps } from './Breadcrumbs';

interface Props extends BreadcrumbsProps {}

export default function BreadcrumbsSection({ ...props }: Props) {
  return (
    <section className="my-4 md:my-6">
      <MotionDiv className="container" {...fadeInEaseProps}>
        <Breadcrumbs {...props} />
      </MotionDiv>
    </section>
  );
}
