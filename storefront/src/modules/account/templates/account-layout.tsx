import { MotionDiv } from '@/lib/motion';
import { fadeInUpEaseProps } from '@/lib/motion/animations';
import { Customer } from '@medusajs/medusa';
import AccountNav from '../components/account-nav';

interface AccountLayoutProps {
  customer: Omit<Customer, 'password_hash'> | null;
  children: React.ReactNode;
  store: string;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, store, children }) => {
  return (
    <main className="flex-1">
      <div className="flex-1 lg:py-12">
        <div className="flex-1 container h-full max-w-5xl mx-auto flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] pb-12">
            {customer && (
              <MotionDiv {...fadeInUpEaseProps}>
                <AccountNav customer={customer} store={store} />
              </MotionDiv>
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountLayout;
