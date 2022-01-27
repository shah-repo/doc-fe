
export const formatCurrency = (data: string) =>  {
  if (data && !isNaN(+data)) {
    return (+data).toLocaleString();
  }
  return "";
};
