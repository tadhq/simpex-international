'use client';

import { useTranslations } from 'next-intl';
import { useSearchOverlay } from '../search/SearchOverlayContext';
import NavLink from './NavLink';
import { useWishlist } from '../wishlist-drawer/WishlistContext';

export default function NavLinks({
  store,
  wishlistCount,
}: {
  store: string;
  wishlistCount?: number;
}) {
  const t = useTranslations('headerMain');
  const [opened, { open }] = useSearchOverlay();
  const { wishlist } = useWishlist();

  const navLinks = [
    {
      icon: 'ph:magnifying-glass-bold',
      label: t('search'),
      className: 'lg:hidden',
      onClick: open,
    },
    {
      icon: 'ph:heart-bold',
      label: t('wishlist'),
      href: `${store}/account/wishlist`,
      badgeCount: wishlist.length, // <--- Add the count here dynamically later
    },
    // {
    //   icon: 'streamline:interface-arrows-reload-2-arrows-load-arrow-sync-square-loading-reload-synchronize',
    //   label: t('compare'),
    // },
  ];

  return (
    <>
      {navLinks.map((item, index) => (
        <NavLink key={index} {...item}>
          {item.label}
        </NavLink>
      ))}
    </>
  );
}
