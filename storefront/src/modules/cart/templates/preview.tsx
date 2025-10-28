'use client';

import { LineItem, Region } from '@medusajs/medusa';

import { TableTbody } from '@/lib/mantine';
import Item from '@/modules/cart/components/item';
import SkeletonLineItem from '@/modules/skeletons/components/skeleton-line-item';
import { Table } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';

type ItemsTemplateProps = {
  items?: Omit<LineItem, 'beforeInsert'>[];
  region?: Region;
  price_list?: any;
};

const ItemsPreviewTemplate = ({ items, region, price_list }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4;

  return (
    <div
      className={cn({
        'pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]': hasOverflow,
      })}
    >
      <Table>
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
                      price_list={matchingPriceList} // Pass the matched price_list
                      region={region}
                      type="preview"
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

export default ItemsPreviewTemplate;
