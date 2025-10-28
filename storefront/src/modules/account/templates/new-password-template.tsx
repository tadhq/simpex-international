import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import NewPassword from '@/modules/account/components/new-password';

export default function NewPasswordTemplate() {
  return (
    <MotionDiv className="w-full flex justify-center px-8 py-8" {...fadeInUpEaseProps}>
      <NewPassword />
    </MotionDiv>
  );
}
