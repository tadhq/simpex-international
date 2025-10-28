import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { getYoutubeEmbedUrl } from '@tadsr/web-core/youtube';
import getYoutubeId from 'get-youtube-id';
// TODO migrate to qs
import queryString from 'query-string';

export default function VideoHeroSection({
  videoUrl,
  videoOptions,
  slot1,
  slot2,
}: {
  videoUrl: string;
  videoOptions: Record<string, any>;
  slot1?: React.ReactNode;
  slot2?: React.ReactNode;
}) {
  const embedUrl = getYoutubeEmbedUrl(videoUrl);
  const optionParams = videoOptions;
  if (videoOptions.loop) {
    const youtubeId = getYoutubeId(videoUrl);
    optionParams['playlist'] = youtubeId; // This will make sure to loop the video
  }
  const qs = queryString.stringify(optionParams);

  return (
    <section className="bg-base-50 py-6 lg:py-8">
      <div className="container grid lg:grid-cols-[30%_30%_37%] grid-cols-2 grid-rows-2 gap-5">
        {embedUrl && (
          <MotionDiv
            className="pointer-events-none rounded-xl overflow-hidden aspect-[16/10] shadow col-span-2 row-span-2 bg-white"
            {...fadeInUpEaseProps}
          >
            <iframe
              allowFullScreen
              allow="autoplay; encrypted-media"
              className="ml-[-100%]"
              height="100%"
              src={`${embedUrl}?${qs}`}
              width="300%"
            />
          </MotionDiv>
        )}
        {slot1 && (
          <MotionDiv
            className="bg-white col-span-2 sm:col-span-1 rounded-xl overflow-hidden shadow"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.2,
            }}
          >
            {slot1}
          </MotionDiv>
        )}
        {slot2 && (
          <MotionDiv
            className="bg-white col-span-2 sm:col-span-1 rounded-xl overflow-hidden shadow"
            {...fadeInUpEaseProps}
            transition={{
              ...fadeInUpEaseProps.transition,
              delay: 0.3,
            }}
          >
            {slot2}
          </MotionDiv>
        )}
      </div>
    </section>
  );
}
