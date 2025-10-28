'use client';

import { SALES_CHANNEL_IS_B2B } from '@/config/env';
import { Icon } from '@iconify/react';
import { Button, Menu } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';

interface Item {
  value: string;
  label: string;
  icon?: string;
}

interface Props {
  value: string;
  // onChange: (value: string | null) => void;
  // HACK silent the type error: Props must be serializable
  onChange: any;
  data: Item[];
  menuProps?: any;
}

export default function Switcher({ value, onChange, data, menuProps }: Props) {
  const selectedItem = data.find((item) => item.value === value);
  if (!selectedItem) return null;

  return (
    <Menu
      transitionProps={{
        transition: 'scale',
        duration: 200,
      }}
      {...menuProps}
    >
      <Menu.Target>
        <Button
          classNames={{
            root: cn(
              'bg-transparent',
              SALES_CHANNEL_IS_B2B
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-transparent hover:text-inherit text-inherit'
            ),
          }}
          leftSection={selectedItem.icon && <Icon height={16} icon={selectedItem.icon} />}
          rightSection={
            <Icon className="opacity-80" height={14} icon="fluent:chevron-down-48-regular" />
          }
          size="xs"
        >
          {selectedItem.label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {data.map((item) => (
          <Menu.Item
            key={item.value}
            className={item.value === value ? 'bg-primary-100' : ''}
            leftSection={item.icon && <Icon height={16} icon={item.icon} />}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
