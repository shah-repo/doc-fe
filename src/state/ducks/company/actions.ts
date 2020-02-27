import { COMPANY_MINE_URL } from "../../../ui/constants/urls";
import { apiAction } from "../../factories";
import { GET_COMPANY_MINE, SELECT_COMPANY } from "./constants";
import { Company, CompanyMineAction, SelectCompanyAction } from "./types";

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

const companyMine = (company: Company): CompanyMineAction => ({
  type: GET_COMPANY_MINE,
  payload: company,
});

const getCompanyMine = () =>
  apiAction({
    url: COMPANY_MINE_URL,
    method: "get",
    onSuccess: (data: any, dispatch) => {
      dispatch(companyMine(data));
    },
  });

export default {
  selectCompany,
  getCompanyMine,
};
