'use client';

import { Icon } from '@/components/iconify';
import { cn } from '@tadsr/web-core/tailwindcss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarBlock({ links }: { links?: Record<string, any>[] | null }) {
  const pathName = usePathname();
  const path = pathName.split('/');
  const pathSpliced = path.splice(2);
  const currentURL = pathSpliced.join('/');

  return (
    <nav className="flex flex-col py-4 my-2 gap-2">
      {links?.map(({ label, url }, i) => {
        if (!url) return null;
        return (
          <Link
            key={i}
            className={cn(
              'break-words flex py-1 text-neutral-600 transition-all hover:text-primary-600 justify-between gap-2',
              {
                'text-primary-600': url === '/' + currentURL,
              }
            )}
            href={url}
          >
            {label}
            <Icon className="shrink-0 self-center" icon="iconamoon:arrow-right-2-thin" />
          </Link>
        );
      })}
    </nav>
  );
}
