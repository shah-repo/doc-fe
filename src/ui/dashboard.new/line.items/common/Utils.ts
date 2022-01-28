
export const formatCurrency = (data: string) =>  {
  if (data && !isNaN(+data)) {
    return (+data).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return "";
};
