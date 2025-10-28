'use client';

import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { useDrawerMain } from './DrawerMainContext';

interface Props {
  id: string;
  name: string;
  thumbnail: string;
}

export default function DrawerNavLink({ id, name, thumbnail }: Props) {
  const [opened, { close }] = useDrawerMain();

  return (
    <NavLink
      classNames={{
        label: 'text-[16px] font-semibold',
      }}
      component={Link}
      href={`/shop/${id}`}
      label={name}
      leftSection={
        <div className="relative aspect-square w-10 h-10">
          <Image
            fill
            alt="Category image"
            className="object-contain object-center"
            fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
            src={getDirectusFile(thumbnail)}
          />
        </div>
      }
      onClick={close}
    />
  );
}
