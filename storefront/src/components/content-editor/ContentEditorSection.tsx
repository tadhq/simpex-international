import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { ImageRenderer } from '@/modules/editorjs/ImageRenderer';
import Blocks from 'editorjs-blocks-react-renderer';

export default function ContentEditorSection({ content }: { content: any }) {
  return (
    <section>
      <MotionDiv className="container" {...fadeInUpEaseProps}>
        <div className="my-8 prose prose-td:text-center prose-th:w-96 prose-th:pt-8 prose-th:text-3xl prose-th:text-center max-w-none">
          <Blocks data={content} renderers={{ image: ImageRenderer }} />
        </div>
      </MotionDiv>
    </section>
  );
}
