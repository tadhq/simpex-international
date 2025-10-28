export function usePagination(
  total: number | null | undefined,
  currentPage: string | null | undefined,
  DEFAULT_PAGE_LIMIT = 10
) {
  const totalItems = total ?? 0;
  const firstItemNumber = (parseInt(currentPage ?? '1') - 1) * DEFAULT_PAGE_LIMIT + 1;
  let lastItemNumber = firstItemNumber + DEFAULT_PAGE_LIMIT - 1;
  // If last item number exceeds total items
  if (lastItemNumber > totalItems) lastItemNumber = totalItems;

  return { totalItems, firstItemNumber, lastItemNumber };
}
