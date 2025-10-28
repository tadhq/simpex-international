'use client';

import { Icon } from '@/components/iconify';
import { signOut } from '@/modules/account/actions';
import { Title } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import { cn } from '@tadsr/web-core/tailwindcss';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const AccountNav = ({
  customer,
  store,
}: {
  customer: Omit<Customer, 'password_hash'> | null;
  store: string;
}) => {
  const route = usePathname();
  const { locale } = useParams();

  const t = useTranslations();

  const handleLogout = async () => {
    await signOut();
  };

  const routes = [
    {
      label: t('account.overview'),
      icon: 'ph:house-bold',
      url: `/${store}/account`,
    },
    {
      label: t('account.orders'),
      icon: 'ph:package-bold',
      url: `/${store}/account/orders`,
    },
    {
      label: t('account.wishlist'),
      icon: 'ph:heart-bold',
      url: `/${store}/account/wishlist`,
    },
    {
      label: t('account.addresses'),
      icon: 'ph:map-pin-bold',
      url: `/${store}/account/addresses`,
    },
    {
      label: t('account.profile'),
      icon: 'ph:user-bold',
      url: `/${store}/account/profile`,
    },
  ];

  return (
    <div>
      <div className="lg:hidden mt-8">
        {route !== `/${locale}/account` ? (
          <Link
            className="flex items-center gap-x-2 text-sm pt-2 pb-6"
            href="/account"
            prefetch={false}
          >
            <>
              <Icon className="transform rotate-90" icon="ph:caret-down-bold" />
              <span>Account</span>
            </>
          </Link>
        ) : (
          <>
            <Title className="text-xl-semi mb-4 px-4" order={3}>
              {t('account.hello')} {customer?.first_name}
            </Title>
            <div>
              <ul>
                {routes
                  .filter((_, i) => i !== 0)
                  .map((item) => (
                    <li key={item.label}>
                      <Link
                        className="flex items-center justify-between py-4 border-b border-base-200 px-4"
                        href={item.url}
                        prefetch={false}
                      >
                        <div className="flex items-center gap-x-2">
                          <Icon height={20} icon={item.icon} width={20} />
                          <span>{item.label}</span>
                        </div>
                        <Icon icon="ph:caret-right-bold" />
                      </Link>
                    </li>
                  ))}
                <li>
                  <button
                    className="flex items-center justify-between py-4 px-4 w-full"
                    type="button"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-x-2">
                      <Icon height={20} icon="ph:sign-out-bold" width={20} />
                      <span>{t('account.logout')}</span>
                    </div>
                    <Icon icon="ph:caret-right-bold" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden lg:block">
        <div>
          <div className="pb-4">
            <h3 className="font-bold">Account</h3>
          </div>
          <div>
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              {routes.map((item) => (
                <li key={item.label}>
                  <AccountNavLink href={item.url} route={route!}>
                    <div className="flex items-center gap-x-2">
                      <Icon icon={item.icon} />
                      <span>{item.label}</span>
                    </div>
                  </AccountNavLink>
                </li>
              ))}
              <li>
                <button className="flex items-center gap-x-2" type="button" onClick={handleLogout}>
                  <Icon icon="ph:sign-out-bold" />
                  <span>{t('account.logout')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

type AccountNavLinkProps = {
  href: string;
  route: string;
  children: React.ReactNode;
};

const AccountNavLink = ({ href, route, children }: AccountNavLinkProps) => {
  const { locale }: { locale: string } = useParams();

  const active = route.split(locale)[1] === href;
  return (
    <Link
      className={cn('', {
        'font-bold': active,
      })}
      href={href}
      prefetch={false}
    >
      {children}
    </Link>
  );
};

export default AccountNav;
