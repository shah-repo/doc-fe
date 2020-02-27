import { COMPANY_MINE_URL } from "../../../ui/constants/urls";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { GET_COMPANY_MINE, SELECT_COMPANY } from "./constants";
import { Company, CompanyMineAction, CompanyMineRequest, SelectCompanyAction } from "./types";

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

const changeCompanyMine = (body: CompanyMineRequest, handlers: Handlers):
ApiAction<Company> => apiActionWithCallbacks({
  url: COMPANY_MINE_URL,
  method: "patch",
  data: body,
  onSuccess: (data, dispatch) => {
    dispatch(getCompanyMine());
  },
  handlers,
});
export default {
  selectCompany,
  getCompanyMine,
  changeCompanyMine,
};
