import { Anchor, Breadcrumbs as MantineBreadcrumbs } from '@mantine/core';
import type { Route } from 'next';
import Link from 'next/link';

export interface BreadcrumbsProps {
  items: { label: string; url?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <MantineBreadcrumbs classNames={{ root: 'flex-wrap gap-y-3', separator: 'text-base-300' }}>
      {items.map((item, index) => {
        if (!item.url) return <span key={index}>{item.label}</span>;
        return (
          <Anchor key={index} component={Link} href={item.url as Route}>
            {item.label}
          </Anchor>
        );
      })}
    </MantineBreadcrumbs>
  );
}
