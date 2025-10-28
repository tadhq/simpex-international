import { Button, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function LoginPrompt() {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-between">
      <div>
        <Title order={3}>{t('login.title')}</Title>
        <p className="mt-2">{t('login.description')}</p>
      </div>
      <div>
        <Button component={Link} href="/account" variant="default">
          {t('global.buttons.loginIcon')}
        </Button>
      </div>
    </div>
  );
}
