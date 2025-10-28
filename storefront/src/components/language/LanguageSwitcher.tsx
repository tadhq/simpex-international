import { getLocale } from 'next-intl/server';
import LanguageSwitcherSelect from './LanguageSwitcherSelect';

export default async function LanguageSwitcher() {
  const locale = await getLocale();

  return <LanguageSwitcherSelect defaultValue={locale} />;
}
