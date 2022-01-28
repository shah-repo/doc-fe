
export const formatCurrency = (data: string) =>  {
  const language = "en";
  if (data && !isNaN(+data)) {
    return (+data).toLocaleString(language, {
      minimumFractionDigits: 2,
    });
  }
  return "";
};
