import type { MotionProps, Variants } from 'framer-motion';

const whileInViewProps: MotionProps = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: {
    once: true,
    margin: '-50px',
  },
  transition: {
    ease: 'easeOut',
    duration: 0.3,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInUpEaseProps: MotionProps = {
  variants: fadeInUp,
  ...whileInViewProps,
};

export const fadeInEaseProps: MotionProps = {
  variants: fadeIn,
  ...whileInViewProps,
};
