import { LineItem, Region } from '@medusajs/medusa';

import { BASE_MEDIA_URL } from '@/config/env';
import { getDirectusFile } from '@/lib/directus/utils';
import { TableTd, TableTr } from '@/lib/mantine';
import Image from '@/lib/mantine/Image';
import LineItemOptions from '@/modules/common/components/line-item-options';
import LineItemPrice from '@/modules/common/components/line-item-price';
import LineItemUnitPrice from '@/modules/common/components/line-item-unit-price';

type ItemProps = {
  item: Omit<LineItem, 'beforeInsert'>;
  region: Region;
  hideImage?: boolean;
  store: string;
  price_list: any;
};

const Item = ({ item, region, hideImage, store, price_list }: ItemProps) => {
  return (
    <TableTr className="w-full">
      {!hideImage && (
        <TableTd className="!pl-0 p-4 w-24">
          <div className="flex w-16">
            <div className="aspect-[4/3] relative h-16">
              <Image
                fill
                alt="Product image"
                className="object-contain object-center product-thumbnail"
                fallbackSrc={getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a')}
                src={`${BASE_MEDIA_URL}/${item.variant.sku}.png`}
              />
            </div>
          </div>
        </TableTd>
      )}

      <TableTd className="text-left">
        <p>{item.title}</p>
        <p className="text-gray-500">{item.variant.sku}</p>
        <LineItemOptions variant={item.variant} />
      </TableTd>

      <TableTd className="!pr-0">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1">
            <p className="text-ui-fg-muted">{item.quantity}x </p>
            <LineItemUnitPrice
              item={item}
              price_list={price_list}
              region={region}
              store={store}
              style="tight"
            />
          </span>

          <LineItemPrice
            item={item}
            price_list={price_list}
            region={region}
            store={store}
            style="tight"
          />
        </span>
      </TableTd>
    </TableTr>
  );
};

export default Item;
