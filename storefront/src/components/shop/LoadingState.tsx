import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Loader, MantineSize } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';

interface Props {
  className?: string;
  size?: MantineSize;
}

export default function LoadingState({ className, size = 'md' }: Props) {
  return (
    <div className={cn('grid place-items-center flex-1', className)}>
      <MotionDiv className="flex flex-col text-center items-center" {...fadeInUpEaseProps}>
        <Loader size={size} />
      </MotionDiv>
    </div>
  );
}
