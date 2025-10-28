import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import Login from '@/modules/account/components/login';

export default function LoginTemplate() {
  return (
    <MotionDiv className="w-full flex justify-center px-8 py-8" {...fadeInUpEaseProps}>
      <Login />
    </MotionDiv>
  );
}
