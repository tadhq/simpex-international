import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';

interface Props {
  banners: {
    id: number;
    section_double_promo_banner_id: { id: number; banners: unknown[] };
    directus_files_id: {
      id: string;
      filename_disk: string;
      title: string | null;
      width: number;
      height: number;
    };
  }[];
}

export default function DoublePromoBannerSection({ banners }: Props) {
  return (
    <MotionDiv className="container py-2" {...fadeInEaseProps}>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        {banners.map((banner, index) => {
          const file = banner.directus_files_id;

          return (
            <div key={file.id} className="rounded-lg overflow-hidden shadow">
              <Image
                alt={file.title || `Promo Banner ${index + 1}`}
                className="object-cover"
                fallbackSrc="https://placehold.co/000000/FFFFFF/100x100?text=No+image"
                height={file.height}
                src={getDirectusFile(file.id)}
                width={file.width}
              />
            </div>
          );
        })}
      </div>
    </MotionDiv>
  );
}
