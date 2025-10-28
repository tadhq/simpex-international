import { Icon } from '@/components/iconify';
import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from '@mantine/core';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { getTranslations } from 'next-intl/server';

interface Props {
  product: PricedProduct;
}

export default async function ProductInfo({ product }: Props) {
  const t = await getTranslations('product');

  const items = [
    {
      value: 'description',
      icon: 'ph:notepad-bold',
      label: t('description'),
      content: product.description,
      contentEmpty: t('descriptionEmpty'),
    },
    // {
    //   value: 'specifications',
    //   icon: 'ph:faders-bold',
    //   label: t('specifications'),
    //   content: null,
    //   contentEmpty: t('specificationsEmpty'),
    // },
  ];

  return (
    <Accordion defaultValue={items[0].value}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionControl
            icon={<Icon color="var(--mantine-color-primary-4)" height={16} icon={item.icon} />}
          >
            {item.label}
          </AccordionControl>
          <AccordionPanel>
            {item.content ? (
              <div
                className="prose whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></div>
            ) : (
              <p className="text-base-600 text-sm py-1">{item.contentEmpty}</p>
            )}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
