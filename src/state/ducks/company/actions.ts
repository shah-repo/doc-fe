import { SELECT_COMPANY } from "./constants";
import { Company, SelectCompanyAction } from "./types";

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

export default {
  selectCompany,
};
