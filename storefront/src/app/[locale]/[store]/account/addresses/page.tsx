import { getCustomer } from '@/lib/medusa/api';
import { getRegion } from '@/lib/medusa/server';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import AddressBook from '@/modules/account/components/address-book';
import { Title } from '@mantine/core';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('account.addresses'),
    description: t('account.metaAddressDescription'),
  };
}

export default async function Addresses({ params }: Props) {
  const countryCode = 'sr';
  const customer = await getCustomer();
  const region = await getRegion(countryCode);

  const t = await getTranslations('accountAddresses');

  if (!customer || !region) {
    notFound();
  }

  return (
    <MotionDiv
      className="w-full"
      {...fadeInUpEaseProps}
      transition={{
        ...fadeInUpEaseProps.transition,
        delay: 0.1,
      }}
    >
      <div className="mb-8 flex flex-col gap-y-4">
        <Title order={3}>{t('shippingAddresses')}</Title>
        <p className="text-base-regular">{t('shippingAddressesDescription')}</p>
      </div>
      <AddressBook customer={customer} region={region} />
    </MotionDiv>
  );
}
