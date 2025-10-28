import { Alert, Select, Skeleton } from '@mantine/core';
import { AdminCustomerGroupsRes } from '@medusajs/medusa';
import { useOne } from '@refinedev/core';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function CustomerGroupField() {
  const searchParams = useSearchParams();
  const id = searchParams.get('customer_group');

  if (!!id) return <Field id={id} />;

  return null;
}

function Field({ id }: { id: string }) {
  const { data, isLoading } = useOne<AdminCustomerGroupsRes>({
    dataProviderName: 'admin',
    resource: 'customer-groups',
    id: id as string,
  });

  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        <Skeleton height={20} width={150} />
        <Skeleton height={36} />
      </div>
    );
  }

  if (!data?.data?.customer_group) {
    return <Alert color="red">{t('validations.invalidCustomerGroup')}</Alert>;
  }

  return (
    <Select
      readOnly
      data={[
        {
          label: data?.data?.customer_group?.name as string,
          value: data?.data?.customer_group?.id as string,
        },
      ]}
      defaultValue={data?.data?.customer_group?.id as string}
      label={t('register.customerGroup')}
      name="customer_group"
    />
  );
}
