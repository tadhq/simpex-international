import { ImageProps, Image as MantineImage, PolymorphicComponentProps } from '@mantine/core';
import NextImage from 'next/image';

interface Props extends PolymorphicComponentProps<'img', ImageProps> {
  fill?: boolean | undefined;
}

export default function Image(props: Props) {
  return <MantineImage component={NextImage as any} {...props} />;
}
