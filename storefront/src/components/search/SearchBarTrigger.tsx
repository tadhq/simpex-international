'use client';

import { Icon } from '@/components/iconify';
import { useTranslations } from 'next-intl';
import { useSearchOverlay } from './SearchOverlayContext';

export default function SearchBarTrigger() {
  const t = useTranslations();
  const [opened, { open }] = useSearchOverlay();

  return (
    <button
      className="hover:bg-base-50 bg-base-100 hidden lg:grid transition grid-cols-[auto_1fr] gap-4 w-96 items-center max-w-md border h-10 rounded-full cursor-pointer shadow-sm px-3"
      type="button"
      onClick={open}
    >
      <Icon className="text-primary-600" height={24} icon="ph:magnifying-glass-bold" />
      <span className="text-base-400 text-sm whitespace-nowrap truncate text-left">
        {t('searchbar.placeholder')}
      </span>
    </button>
  );
}
