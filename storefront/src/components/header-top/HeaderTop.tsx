import B2BConditional from '@/components/b2b/B2BConditional';
import { LanguageSwitcher } from '@/components/language';
import { SALES_CHANNEL_IS_B2B } from '@/config/env';
import { MotionDiv } from '@/lib/motion';
import { fadeIn } from '@/lib/motion/animations';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import CurrencySwitcher from '../currency/CurrencySwitcher';
import SocialLinks from './SocialLinks';

interface HeaderTopProps {
  params: { store: string }; // Accept the `store` parameter as a prop
}

export default function HeaderTop({ params }: HeaderTopProps) {
  const t = useTranslations('global');
  const store = params.store;

  return (
    <header className="bg-primary-900 border-b-transparent text-white">
      <MotionDiv
        animate="visible"
        className="container h-10 flex items-center gap-2 pr-1"
        initial="hidden"
        variants={fadeIn}
      >
        <B2BConditional elseif>
          <Link
            className={`px-4 py-1 rounded-full text-sm ${
              store === 'wholesale'
                ? 'bg-blue-500 text-white' // Active: Blue background with white text
                : 'bg-blue-900 text-gray-300' // Inactive: Dark blue background with gray text
            }`}
            href="/wholesale"
          >
            {t('buttons.wholesale')}
          </Link>
          <Link
            className={`px-4 py-1 rounded-full text-sm ${
              store === 'retail'
                ? 'bg-blue-500 text-white' // Active: Blue background with white text
                : 'bg-blue-900 text-gray-300' // Inactive: Dark blue background with gray text
            }`}
            href="/retail"
          >
            retail
          </Link>
        </B2BConditional>
        <B2BConditional>
          <SocialLinks
            actionIconProps={{ color: SALES_CHANNEL_IS_B2B ? 'white' : 'primary' }}
            className="hidden xs:flex"
          />
        </B2BConditional>
        <div className="flex gap-2 flex-1 justify-end items-center md:mr-4">
          <LanguageSwitcher />
          <CurrencySwitcher />
          <div className="hidden md:block">
            <div className="flex gap-4">
              <Link className="text-sm cursor-pointer hover:text-primary-300" href="/user-manual">
                {t('pages.userManual')}
              </Link>
              <Link className="text-sm cursor-pointer hover:text-primary-300" href="/about">
                {t('pages.aboutUs')}
              </Link>
            </div>
          </div>
        </div>
      </MotionDiv>
    </header>
  );
}
