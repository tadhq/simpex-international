/* eslint-disable @next/next/no-img-element */
import { DIRECTUS_URL } from '@/config/env';

type File = {
  width: number;
  height: number;
  title: string;
  url: string;
};

interface Props extends React.ComponentProps<'figure'> {
  data: {
    file: File;
    caption: string;
  };
}

export function ImageRenderer({ data, className = '' }: Props) {
  if (!!data?.file?.url) {
    return (
      <figure className={className}>
        <img
          alt={data?.file?.title}
          className="object-contain"
          height={data?.file?.height}
          src={`${DIRECTUS_URL}${data?.file?.url}`}
          width={data?.file?.width}
        />
        {data?.caption && <figcaption>{data?.caption}</figcaption>}
      </figure>
    );
  }
  return <div></div>;
}
