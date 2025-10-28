import { getCustomer, listRegions } from '@/lib/medusa/api';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import ProfilePhone from '@/modules/account//components/profile-phone';
import ProfileBillingAddress from '@/modules/account/components/profile-billing-address';
import ProfileCompany from '@/modules/account/components/profile-company';
import ProfileEmail from '@/modules/account/components/profile-email';
import ProfileName from '@/modules/account/components/profile-name';
import ProfilePassword from '@/modules/account/components/profile-password';
import { Divider, Title } from '@mantine/core';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('account.profile'),
    description: t('accountProfile.metaProfileDescription'),
  };
}

export default async function Profile({ params }: Props) {
  const customer = await getCustomer();
  const regions = await listRegions();

  const t = await getTranslations();

  if (!customer || !regions) {
    notFound();
  }

  return (
    <MotionDiv
      className="w-full bg-white rounded-[20px] p-6"
      {...fadeInUpEaseProps}
      transition={{
        ...fadeInUpEaseProps.transition,
        delay: 0.1,
      }}
    >
      <div className="mb-8 flex flex-col gap-y-4">
        <Title order={3}>{t('account.profile')}</Title>
        <p className="text-base-regular">{t('accountProfile.profileDescription')}</p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <ProfileEmail customer={customer} />
        <Divider />
        <ProfilePhone customer={customer} />
        <Divider />
        <ProfileCompany customer={customer} />
        <Divider />
        <ProfilePassword customer={customer} />
        <Divider />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </MotionDiv>
  );
}
