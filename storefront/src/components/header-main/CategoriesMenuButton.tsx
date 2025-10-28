import { Icon } from '@/components/iconify';
import { medusaApi } from '@/lib/medusa/common';
import { Button, Menu, MenuDropdown, MenuItem, MenuTarget } from '@mantine/core';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function CategoriesMenuButton() {
  const t = await getTranslations();
  const locale = await getLocale();
  const categories = await medusaApi.getProductCategories({ locale });

  return (
    <Menu>
      <MenuTarget>
        <Button
          className="hidden md:inline-block rounded-full w-40 h-12 bg-gradient-to-r from-primary-500 to-[#02AAEA]"
          leftSection={<Icon height={20} icon="ph:squares-four-fill" />}
          rightSection={<Icon icon="ph:caret-down-fill" />}
        >
          {t('resources.categories')}
        </Button>
      </MenuTarget>
      <MenuDropdown>
        {categories?.map((item, index) => (
          <MenuItem key={index} component={Link} href={`/shop/${item?.id}`} prefetch={false}>
            {item?.name}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
