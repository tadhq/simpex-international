/**
 * @param dateStr - `DD-MM-YYYY`
 * @param reversed - Reverse the formatting
 * @returns `YYYY-MM-DD` | Empty string
 */
export const formatDateJson = (dateStr: string, reversed?: true) => {
  if (!dateStr) return '';
  // Check if the value includes d, m, y
  if (/[dmy]/gi.test(dateStr)) return '';
  if (reversed) {
    const [year, month, day] = dateStr.split('-');
    return [day, month, year].join('-');
  } else {
    const [day, month, year] = dateStr.split('-');
    return [year, month, day].join('-');
  }
};

export const extractDateObject = (date: Date) => {
  let day: number | string = date.getDate();
  let month: number | string = date.getMonth() + 1;
  const year = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  return {
    day,
    month,
    year,
  };
};
