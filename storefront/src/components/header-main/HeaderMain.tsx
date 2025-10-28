import { ButtonCart } from '@/components/cart';
import { DrawerMainButton } from '@/components/drawer-main';
import { SearchBarTrigger } from '@/components/search';
import { directusApi } from '@/lib/directus';
import { getDirectusFile } from '@/lib/directus/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInEaseProps } from '@/lib/motion/animations';
import Image from 'next/image';
import Link from 'next/link';
import B2BConditional from '../b2b/B2BConditional';
import ButtonAccountIndicator from './ButtonAccountIndicator';
import NavLinks from './NavLinks';
import NavLinksComponent from './NavLinksComponent';
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/medusa/api';

interface HeaderMainProps {
  params: { store: string }; // Accept the `store` parameter as a prop
}

export default async function HeaderMain({ params }: HeaderMainProps) {
  const store = params.store;
  const generalSettings = await directusApi.getGeneralSettings();
  const accessToken = cookies().get('_medusa_jwt')?.value;
  const customer = await getCustomer(accessToken);
  const wishlistCount = (customer?.metadata?.wish_list as []) || [];

  return (
    <header className="sticky top-0 shadow bg-primary-500 z-40 mb-4 md:mb-12">
      <MotionDiv
        className="container h-20 md:h-24 flex items-center gap-1"
        {...fadeInEaseProps}
        transition={{
          ...fadeInEaseProps.transition,
          delay: 0.1,
        }}
      >
        <div className="flex-1 flex items-center gap-3">
          <DrawerMainButton />
          <Link
            className="hover:opacity-80 transition-opacity cursor-pointer"
            href={`/${store}`}
            prefetch={false}
          >
            <div className="relative w-20 md:w-48 h-12 md:h-16">
              <Image
                alt="Logo"
                layout="fill"
                objectFit="contain"
                src={getDirectusFile(generalSettings.logo)}
              />
            </div>
          </Link>
          <div className="hidden xl:block">
            <nav className="flex gap-4 w-80 justify-center mr-2 text-white">
              <NavLinksComponent store={store} />
            </nav>
          </div>
        </div>
        <SearchBarTrigger />

        <nav className="flex-1 flex justify-end items-center gap-1">
          <NavLinks store={store} wishlistCount={wishlistCount.length} />
          <ButtonAccountIndicator store={store} />
          <ButtonCart />
        </nav>
      </MotionDiv>

      <B2BConditional elseif>{/* <CategoriesCarousel /> */}</B2BConditional>
    </header>
  );
}
