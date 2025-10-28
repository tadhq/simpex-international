import { directusClient } from '@/config/directus';
import { readItems, readSingleton } from '@directus/sdk';
import { DirectusSchema } from '../types';
import { deepTranslationFilter } from './utils';

export function getGeneralSettings() {
  return directusClient.request<DirectusSchema['settings_general']>(
    readSingleton('settings_general', {
      fields: ['*.*.*'] as any,
    })
  );
}

export function getShopSettings() {
  return directusClient.request<DirectusSchema['settings_shop']>(
    readSingleton('settings_shop', {
      fields: ['*.*.*'] as any,
    })
  );
}

export function getHeaderTopSettings() {
  return directusClient.request(readSingleton('settings_header_top'));
}

export function getFooterSettings({ locale }: { locale: string }) {
  return directusClient
    .request(
      readSingleton('settings_footer', {
        deep: {
          ...deepTranslationFilter({ locale }),
        },
        fields: ['*.*.*'] as any,
      })
    )
    .then((response) => {
      return {
        translations: response?.translations?.[0] as DirectusSchema['settings_footer_translations'],
        footerLogo: response?.footer_logo, // Access the footer_logo field
      };
    })
    .catch((reason) => {
      throw reason;
    });
}

export function getPaymentsSettings() {
  return directusClient.request(readSingleton('settings_payments'));
}

export function getStoreSettings() {
  return directusClient.request<DirectusSchema['settings_store']>(
    readItems('settings_store', {
      fields: ['*.*.*'] as any,
    })
  );
}

export function getCitySettings() {
  return directusClient.request<DirectusSchema['settings_district']>(
    readItems('settings_district', {
      fields: ['*.*.*'] as any,
    })
  );
}

export function getResortSettings() {
  return directusClient.request<DirectusSchema['settings_resort']>(
    readItems('settings_resort', {
      fields: ['*.*.*'] as any,
    })
  );
}
