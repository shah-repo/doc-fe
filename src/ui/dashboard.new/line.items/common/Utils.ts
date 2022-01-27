import { isNumber } from "lodash";

export const formatCurrency = (data: string) =>  {
  if (isNumber(data)) {
    return (+data).toLocaleString();
  }
  return "";
};
