import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import ResetPassword from '@/modules/account/components/reset-password';

export default function ResetPasswordTemplate() {
  return (
    <MotionDiv className="w-full flex justify-center px-8 py-8" {...fadeInUpEaseProps}>
      <ResetPassword />
    </MotionDiv>
  );
}
