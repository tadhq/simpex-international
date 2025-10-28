import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Loader } from '@mantine/core';

export default function Loading() {
  // TODO reuse
  return (
    <MotionDiv
      className="flex items-center justify-center w-full h-full p-8"
      {...fadeInUpEaseProps}
    >
      <Loader size={36} />
    </MotionDiv>
  );
}
