import B2BConditional from '@/components/b2b/B2BConditional';
import B2BFloatingIndicator from '@/components/b2b/B2BFloatingIndicator';
import { CartDrawerContent, CartDrawerProvider } from '@/components/cart-drawer';
import { DrawerMainContent, DrawerMainProvider } from '@/components/drawer-main';
import { Footer } from '@/components/footer';
import HeaderMain from '@/components/header-main/HeaderMain'; // Ensure correct import
import SearchOverlayProvider from '@/components/search/SearchOverlayProvider';
import { defaultCurrency } from '@/config/money';
import { MedusaClientProvider } from '@/lib/medusa/client';
import { getCurrency } from '@/lib/medusa/server';
import { HeaderTop } from '../header-top';
import FloatingButton from '../home/FloatingButton';
import { WishlistProvider } from '../wishlist-drawer/WishlistContext';
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/medusa/api';

interface MainLayoutProps {
  children: React.ReactNode;
  params: { locale: string; store: string }; // Accept params as a prop
  hideLayout?: boolean; // Optional prop to hide header/footer
}

export default async function MainLayout({
  children,
  params,
  hideLayout = false,
}: MainLayoutProps) {
  const currency = await getCurrency();
  const accessToken = cookies().get('_medusa_jwt')?.value;
  const customer = await getCustomer(accessToken);

  // If hideLayout is true, just render children without header/footer
  if (hideLayout) {
    return (
      <MedusaClientProvider currency={currency} defaultCurrency={defaultCurrency}>
        <WishlistProvider customer={customer}>{children}</WishlistProvider>
      </MedusaClientProvider>
    );
  }

  return (
    <MedusaClientProvider currency={currency} defaultCurrency={defaultCurrency}>
      <WishlistProvider customer={customer}>
        <div className="flex flex-col min-h-screen bg-[#E8ECF8]">
          <HeaderTop params={params} />
          <DrawerMainProvider content={<DrawerMainContent />}>
            <CartDrawerProvider content={<CartDrawerContent />}>
              <SearchOverlayProvider>
                {/* Pass params to HeaderMain */}
                <HeaderMain params={params} />
              </SearchOverlayProvider>
            </CartDrawerProvider>
          </DrawerMainProvider>
          {children}
          <Footer />
          <FloatingButton />
        </div>
        <B2BConditional>
          <B2BFloatingIndicator />
        </B2BConditional>
      </WishlistProvider>
    </MedusaClientProvider>
  );
}
