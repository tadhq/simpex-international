import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';

export default function ComingSoon() {
  return (
    <div className="my-16 px-4">
      <MotionDiv
        {...fadeInUpEaseProps}
        transition={{
          ...fadeInUpEaseProps.transition,
          delay: 0.1,
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative aspect-video w-[400px]">
            <Image
              fill
              alt="Illustration"
              className="object-contain"
              src={getDirectusFile('24c790b3-ef00-4860-bd71-a19a59b55edb')}
            />
          </div>
          <MotionDiv
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1,
            }}
          >
            <h1 className="max-w-md text-2xl font-extrabold leading-tight lg:max-w-xl lg:text-4xl mt-6 text-primary-500">
              Coming Soon
            </h1>
          </MotionDiv>
          <MotionDiv
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.1,
            }}
          >
            <p className="mt-3 max-w-lg text-neutral-500 md:text-lg">
              We are currently working on this experience.
            </p>
          </MotionDiv>
        </div>
      </MotionDiv>
    </div>
  );
}
