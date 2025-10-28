'use client';

import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useDrawerMain } from './DrawerMainContext';

interface NavLink {
  title: string;
  href: Route;
}

export default function NavLinksMobile() {
  const [opened, { close }] = useDrawerMain();
  const t = useTranslations();
  const navLinks: NavLink[] = [
    {
      title: t('headerMain.Home'),
      href: '/' as Route,
    },
    {
      title: t('headerMain.LatestDeals'),
      href: '/deals' as Route,
    },
    {
      title: t('headerMain.OurProducts'),
      href: '/shop' as Route,
    },
  ];

  return (
    <>
      {navLinks.map((link, index) => (
        <Link
          key={index}
          className="hover:text-primary-200 transition-opacity cursor-pointer font-semibold"
          href={link.href}
          prefetch={false}
          onClick={close}
        >
          {link.title}
        </Link>
      ))}
    </>
  );
}
