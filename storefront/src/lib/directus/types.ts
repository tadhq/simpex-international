import type { Schema, components } from './generated/schema';

export type DirectusSchema = Schema & {
  // HACK there is a bug in the generated schema, so we need to add this
  forms: Schema['forms'][];
  pages: Schema['pages'][];
  product_categories: Schema['product_categories'][];
  faqs: Schema['faqs'][];
  vacancies: Schema['vacancies'][];
  settings_store: Schema['settings_store'][];
  settings_district: Schema['settings_district'][];
  settings_resort: Schema['settings_resort'][];
  sales_events: Schema['sales_events'][];
};
export type DirectusComponents = components;
export type DirectusFile = components['schemas']['Files'];

export interface RepeaterItem {
  label: string;
  icon: string;
  url: string;
}

export interface FormItem {
  id: number;
  title: string;
  icon: string | null;
  description: string | null;
  collection: string;
  schema: Record<string, any>[];
  notification_success_options: Record<string, any> | null;
}
