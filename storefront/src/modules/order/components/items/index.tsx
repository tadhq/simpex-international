import { Table, TableTbody } from '@/lib/mantine';
import Item from '@/modules/order/components/item';
import SkeletonLineItem from '@/modules/skeletons/components/skeleton-line-item';
import { Divider } from '@mantine/core';
import { LineItem, Region } from '@medusajs/medusa';

type ItemsProps = {
  items: LineItem[];
  region: Region;
  hideImage?: boolean;
  price_list: any;
  store: string;
};

const Items = ({ items, region, hideImage, price_list, store }: ItemsProps) => {
  return (
    <div className="flex flex-col">
      <Divider className="!mb-0" />
      <Table>
        <TableTbody>
          {items?.length && region
            ? items
                .sort((a, b) => {
                  return a.created_at > b.created_at ? -1 : 1;
                })
                .map((item) => {
                  const matchingPriceList = price_list?.find((price: any) =>
                    price.variants.some((variant: any) => variant.id === item.variant_id)
                  );

                  return (
                    <Item
                      key={item.id}
                      hideImage={hideImage}
                      item={item}
                      price_list={matchingPriceList}
                      region={region}
                      store={store}
                    />
                  );
                })
            : Array.from(Array(5).keys()).map((i) => {
                return <SkeletonLineItem key={i} />;
              })}
        </TableTbody>
      </Table>
    </div>
  );
};

export default Items;
