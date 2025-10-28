import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';

export default function PageHeaderSection({
  title,
  description,
  style,
}: {
  title?: string | null;
  description?: string | null;
  style?: React.CSSProperties;
}) {
  return (
    <section className="my-16" style={style}>
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="grid items-center gap-4 grid-cols-1 md:grid-cols-2">
          <div>{title && <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>}</div>
          {description && <p className="text-lg text-neutral-600">{description}</p>}
        </div>
      </MotionDiv>
    </section>
  );
}
