import { Icon } from '@/components/iconify';
import { Button, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations();

  return (
    <main className="flex-1 grid place-items-center">
      <div className="flex flex-col items-center gap-4 p-6">
        <Icon className="text-primary-600" height={48} icon="ph:magnifying-glass-bold" />
        <Title order={1}>404</Title>
        <p>{t('global.messages.pageNotFound')}</p>
        <Button
          component={Link}
          href="/"
          leftSection={<Icon height={16} icon="ph:house-bold" />}
          variant="default"
        >
          {t('global.buttons.backHome')}
        </Button>
      </div>
    </main>
  );
}
