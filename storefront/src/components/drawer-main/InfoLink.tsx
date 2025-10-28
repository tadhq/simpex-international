'use client';

import Link from 'next/link';
import { useDrawerMain } from './DrawerMainContext';

export default function InfoLink() {
  const [opened, { close }] = useDrawerMain();
  return (
    <>
      <Link href="/user-manual" onClick={close}>
        User Manual
      </Link>
      <Link href="/about" onClick={close}>
        About us
      </Link>
    </>
  );
}
