import { Table, Title } from '@mantine/core';
import { LineItem, Region } from '@medusajs/medusa';

import { TableScrollContainer, TableTbody, TableTh, TableThead, TableTr } from '@/lib/mantine';
import Item from '@/modules/cart/components/item';
import SkeletonLineItem from '@/modules/skeletons/components/skeleton-line-item';
import { useTranslations } from 'next-intl';

type ItemsTemplateProps = {
  items?: Omit<LineItem, 'beforeInsert'>[];
  region?: Region;
  price_list?: any;
};

const ItemsTemplate = ({ items, region, price_list }: ItemsTemplateProps) => {
  const t = useTranslations();

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Title className="text-[2rem] leading-[2.75rem]">{t('cart.cartItems')}</Title>
      </div>
      <TableScrollContainer minWidth={480}>
        <Table>
          <TableThead className="border-t-0">
            <TableTr className="text-base-600">
              <TableTh className="!pl-0">Item</TableTh>
              <TableTh></TableTh>
              <TableTh>{t('product.quantity')}</TableTh>
              <TableTh className="hidden sm:table-cell">{t('shop.price')}</TableTh>
              <TableTh className="!pr-0 text-center">{t('money.total')}</TableTh>
              <TableTh className="text-center">{t('global.buttons.remove')}</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {items && region
              ? items
                  .sort((a, b) => {
                    return a.created_at > b.created_at ? -1 : 1;
                  })
                  .map((item) => {
                    // Find the matching price_list for the current item
                    const matchingPriceList = price_list?.find((price: any) =>
                      price.variants.some((variant: any) => variant.id === item.variant_id)
                    );

                    return (
                      <Item
                        key={item.id}
                        item={item}
                        region={region}
                        price_list={matchingPriceList} // Pass the matched price_list
                      />
                    );
                  })
              : Array.from(Array(5).keys()).map((i) => {
                  return <SkeletonLineItem key={i} />;
                })}
          </TableTbody>
        </Table>
      </TableScrollContainer>
    </div>
  );
};

export default ItemsTemplate;
