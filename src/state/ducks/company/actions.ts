import { COMPANY_MINE_URL } from "../../../ui/constants/urls";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { SELECT_COMPANY, SET_COMPANY_MINE } from "./constants";
import { Company, CompanyMineAction, CompanyMineRequest, SelectCompanyAction } from "./types";

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

const setCompanyMine = (company: Company): CompanyMineAction => ({
  type: SET_COMPANY_MINE,
  payload: company,
});

const getCompanyMine = (handlers: Handlers) =>
  apiActionWithCallbacks({
    url: COMPANY_MINE_URL,
    method: "get",
    onSuccess: (data: any, dispatch) => {
      dispatch(setCompanyMine(data));
    },
    handlers,
  });

const updateCompanyMine = (body: CompanyMineRequest, handlers: Handlers):
ApiAction<Company> => apiActionWithCallbacks({
  url: COMPANY_MINE_URL,
  method: "patch",
  data: body,
  onSuccess: (data, dispatch) => {
    dispatch(setCompanyMine(data));
  },
  handlers,
});
export default {
  selectCompany,
  getCompanyMine,
  updateCompanyMine,
};
