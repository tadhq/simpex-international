import { getCustomer } from '@/lib/medusa/api';
import { getTranslations } from 'next-intl/server';
import NavLink from './NavLink';

export default async function ButtonAccountIndicator({ store }: { store: string }) {
  const t = await getTranslations();
  const customer = await getCustomer().catch(() => null);

  if (!customer) {
    return (
      <NavLink href={`/${store}/auth`} icon="ph:sign-in-bold">
        {t('global.buttons.loginIcon')}
      </NavLink>
    );
  }

  return (
    <NavLink href={`/${store}/account`} icon="ph:user-bold">
      {t('global.pages.account')}
    </NavLink>
  );
}
