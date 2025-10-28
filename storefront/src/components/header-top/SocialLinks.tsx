import { Icon } from '@/components/iconify';
import { directusApi } from '@/lib/directus';
import { RepeaterItem } from '@/lib/directus/types';
import type { IconProps } from '@iconify/react';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';

interface Props extends React.ComponentProps<'div'> {
  actionIconProps?: ActionIconProps;
  iconProps?: Omit<IconProps, 'icon'>;
}

export default async function SocialLinks({ className, actionIconProps, iconProps }: Props) {
  const headerTopSettings = await directusApi.getHeaderTopSettings();

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {headerTopSettings.social_links?.map((item: RepeaterItem) => (
        <ActionIcon
          key={item.label}
          component="a"
          href={item.url}
          target="_blank"
          title={item.label}
          variant="subtle"
          {...actionIconProps}
        >
          <Icon icon={item.icon} {...iconProps} />
        </ActionIcon>
      ))}
    </div>
  );
}
