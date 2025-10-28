export function deepTranslationFilter({ locale }: { locale: string }) {
  return {
    translations: { _filter: { language_code: { _eq: locale } } },
  };
}
