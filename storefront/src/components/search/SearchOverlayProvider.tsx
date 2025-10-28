'use client';

import { Icon } from '@/components/iconify';
import { BASE_MEDIA_URL } from '@/config/env';
import { getDirectusFile } from '@/lib/directus/utils';
import { ActionIcon, Autocomplete, Avatar, Group, Loader, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useList } from '@refinedev/core';
import { useTranslations } from 'next-intl';
import { stringify } from 'qs';
import { useEffect, useRef, useState } from 'react';
import { SearchOverlayContext } from './SearchOverlayContext';

interface Props extends React.PropsWithChildren {}

export default function SearchOverlayProvider({ children }: Props) {
  const t = useTranslations();
  const formRef = useRef<any>();
  const state = useDisclosure(false);
  const [opened, { open, close }] = state;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Fetch products dynamically based on the query
  const { data, isLoading } = useList<PricedProduct>({
    resource: 'products',
    filters: debouncedQuery
      ? [
          {
            operator: 'or',
            value: [
              { field: 'title', operator: 'contains', value: debouncedQuery },
              { field: 'metadata.item_code', operator: 'contains', value: debouncedQuery },
              { field: 'metadata.barcode', operator: 'contains', value: debouncedQuery },
            ],
          },
        ]
      : [],
    config: { pagination: { pageSize: 1000 } },
  });

  // Create a Map to store product titles with item codes
  const productMap = new Map(
    data?.data
      ?.filter((product) => Boolean(product.title))
      .map((product) => {
        const title = product.title!;
        const itemCode = product.metadata?.item_code ? `${product.metadata.item_code}` : '';
        const image =
          `${BASE_MEDIA_URL}/${product.metadata?.item_code}.png` ||
          getDirectusFile('968c7361-86dc-4b5f-bc16-8ce3a40b875a');
        return [`${title} ${itemCode}`.trim(), { title, itemCode, image }]; // Key: "Title (Item Code)", Value: { title, itemCode, image }
      }) || []
  );

  // Convert Map entries to an array for Autocomplete
  const productSuggestions = Array.from(productMap.keys()).map((title) => ({
    value: title,
  }));

  // Debounce logic to limit the search calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleClose = () => {
    setQuery('');
    setDebouncedQuery('');
    close();
  };

  const renderAutocompleteOption = ({ option }: { option: { value: string } }) => {
    if (option.value === 'No results found') {
      return <Text className="text-gray-500 text-sm px-4 py-2">No results found</Text>;
    }
    const productDetails = productMap.get(option.value);

    if (!productDetails) return null;

    return (
      <Group gap="sm">
        {productDetails.image && <Avatar radius="sm" size={'lg'} src={productDetails.image} />}
        <div>
          <Text className="truncate max-w-[200px] md:max-w-[300px]" size="sm">
            {productDetails.title}
          </Text>
          {productDetails.itemCode && (
            <Text opacity={0.5} size="xs">
              ItemCode: {productDetails.itemCode}
            </Text>
          )}
        </div>
      </Group>
    );
  };

  return (
    <SearchOverlayContext.Provider value={state}>
      {children}
      <Modal
        classNames={{ body: 'p-1' }}
        opened={opened}
        radius="md"
        withCloseButton={false}
        onClose={handleClose}
      >
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (debouncedQuery) {
              const qs = stringify({
                filters: [{ field: 'q', operator: 'eq', value: debouncedQuery }],
              });
              window.location.href = `/shop?${qs}`;
            }
          }}
        >
          <Autocomplete
            autoComplete="off"
            classNames={{ input: 'border-transparent focus:border-transparent' }}
            data={
              debouncedQuery.length > 0
                ? productSuggestions.length > 0
                  ? productSuggestions
                  : [{ value: 'No results found' }]
                : []
            }
            leftSection={
              isLoading ? (
                <Loader color="#32519f" size={18} />
              ) : (
                <Icon className="text-secondary-600" height={18} icon="ph:magnifying-glass-bold" />
              )
            }
            limit={12}
            maxDropdownHeight={450}
            placeholder={t('searchbar.instruction')}
            renderOption={renderAutocompleteOption}
            rightSection={
              <ActionIcon onClick={handleClose}>
                <Icon color="white" height={18} icon="fluent:dismiss-12-regular" />
              </ActionIcon>
            }
            rightSectionWidth={40}
            size="md"
            value={query}
            onChange={(value) => {
              setQuery(value);

              // Extract the original title from "Title (Item Code)"
              const cleanTitle = productMap.get(value);

              if (cleanTitle) {
                const qs = stringify(
                  {
                    filters: [{ field: 'q', operator: 'eq', value: cleanTitle.title }],
                    pageSize: 8,
                    current: 1,
                  },
                  { encodeValuesOnly: true }
                );

                window.location.href = `/shop?${qs}`;
              }
            }}
            onFocus={() => open()}
          />
        </form>
      </Modal>
    </SearchOverlayContext.Provider>
  );
}
