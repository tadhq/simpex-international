import { SocialLinks } from '@/components/header-top';
import { medusaApi } from '@/lib/medusa/common';
import { Divider } from '@mantine/core';
import { getLocale, getTranslations } from 'next-intl/server';
import DrawerNavLink from './DrawerNavLink';
import InfoLink from './InfoLink';
import NavLinksMobile from './NavLinksMobile';

export default async function DrawerMainContent() {
  const t = await getTranslations('social');
  const locale = await getLocale();
  const categories = await medusaApi.getProductCategories({ locale });

  return (
    <>
      <Divider label="Information" labelPosition="left" />
      <div className="flex flex-col gap-4 mt-4 pb-6 font-bold text-md text-primary-600">
        <InfoLink />
      </div>
      <Divider label="Collections" labelPosition="left" />
      <div className="flex flex-col gap-4 mt-4 pb-6 font-bold text-primary-600">
        <NavLinksMobile />
      </div>
      <Divider className="mb-4" label="Categories" labelPosition="left" />
      <nav>
        {categories?.map((category: any) => <DrawerNavLink key={category.id} {...category} />)}
      </nav>
      <footer className="sticky bottom-0 bg-white py-2 flex items-center flex-col z-10">
        <p className="mb-1 text-sm text-base-600 text-center">{t('followUs')}</p>
        <SocialLinks
          actionIconProps={{ color: 'primary', size: 'xl' }}
          iconProps={{ height: 22 }}
        />
      </footer>
    </>
  );
}
