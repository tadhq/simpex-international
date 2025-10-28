import { Icon } from '@/components/iconify';
import { formatAmount } from '@/lib/medusa/utils';
import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Title } from '@mantine/core';
import { Customer, Order } from '@medusajs/medusa';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type OverviewProps = {
  customer: Omit<Customer, 'password_hash'> | null;
  orders: Order[] | null;
  store: string;
};

const Overview = ({ customer, orders, store }: OverviewProps) => {
  const t = useTranslations();

  return (
    <MotionDiv
      className="bg-white p-6 rounded-[20px] hidden lg:block"
      {...fadeInUpEaseProps}
      transition={{
        ...fadeInUpEaseProps.transition,
        delay: 0.1,
      }}
    >
      <div className="hidden lg:block">
        <div className="flex justify-between items-center mb-4">
          <Title order={3}>
            {t('account.hello')} {customer?.first_name}
          </Title>
          <span className="text-sm">
            {t('account.signedInAs')}: <span className="font-bold">{customer?.email}</span>
          </span>
        </div>
        <div className="flex flex-col py-8 border-t border-base-200">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-6">
              <div className="flex flex-col gap-y-4">
                <h3 className="text-lg font-bold">{t('account.profile')}</h3>
                <div className="flex items-end gap-x-2">
                  <span className="text-3xl font-bold leading-none">
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-base-600">
                    {t('account.completed')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="text-lg font-bold">{t('account.addresses')}</h3>
                <div className="flex items-end gap-x-2">
                  <span className="text-3xl font-bold leading-none">
                    {customer?.shipping_addresses?.length || 0}
                  </span>
                  <span className="uppercase text-base-regular text-base-600">
                    {t('account.saved')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-lg font-bold">{t('account.recentOrders')}</h3>
              </div>
              <ul className="flex flex-col gap-y-4">
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li key={order.id}>
                        <Link
                          href={`/${store}/account/orders/details/${order.id}`}
                          prefetch={false}
                        >
                          <div className="bg-primary-50 flex justify-between items-center p-4 rounded-xl">
                            <div className="grid grid-cols-3 grid-rows-2 text-sm gap-x-4 flex-1">
                              <span className="font-bold">{t('account.datePlaced')}</span>
                              <span className="font-bold">{t('orderCompleted.orderNumber')}</span>
                              <span className="font-bold">{t('account.totalAmount')}</span>
                              <span>{new Date(order.created_at).toDateString()}</span>
                              <span>#{order.display_id}</span>
                              <span>
                                {formatAmount({
                                  amount: order.total,
                                  region: order.region,
                                  includeTaxes: false,
                                })}
                              </span>
                            </div>
                            <button className="flex items-center justify-between">
                              <span className="sr-only">
                                {t('account.goToOrder', { display_id: order.display_id })}
                              </span>
                              <Icon className="-rotate-90" icon="ph:caret-down-bold" />
                            </button>
                          </div>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <span>{t('account.noRecentOrders')}</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const getProfileCompletion = (customer: Omit<Customer, 'password_hash'> | null) => {
  let count = 0;

  if (!customer) {
    return 0;
  }

  if (customer.email) {
    count++;
  }

  if (customer.first_name && customer.last_name) {
    count++;
  }

  if (customer.phone) {
    count++;
  }

  if (customer.billing_address) {
    count++;
  }

  return (count / 4) * 100;
};

export default Overview;
