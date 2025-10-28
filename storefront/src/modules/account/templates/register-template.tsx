import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import Register from '@/modules/account/components/register';

export default function RegisterTemplate() {
  return (
    <MotionDiv className="w-full flex justify-center px-8 py-8" {...fadeInUpEaseProps}>
      <Register />
    </MotionDiv>
  );
}
