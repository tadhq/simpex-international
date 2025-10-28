import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface NavLink {
  title: string;
  href: Route;
}

export default function NavLinksComponent({ store }: { store: string }) {
  const t = useTranslations();
  const navLinks: NavLink[] = [
    {
      title: t('headerMain.Home'),
      href: `/${store}/` as Route,
    },
    {
      title: t('headerMain.LatestDeals'),
      href: `/${store}/deals` as Route,
    },
    {
      title: t('headerMain.OurProducts'),
      href: `/${store}/shop` as Route,
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
        >
          {link.title}
        </Link>
      ))}
    </>
  );
}
