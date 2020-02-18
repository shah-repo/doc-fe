import { combineReducers } from "redux";
import { LOGOUT_USER } from "../auth/constants";
import { LogoutUserAction } from "../auth/types";
import { SELECT_COMPANY, WHITE_LABEL_DEFAULT } from "./constants";
import { SelectCompanyAction, SelectCompanyState } from "./types";

export const COMPANY_DEFAULT_STATE: SelectCompanyState = {
  id: "",
  name: "",
  maxRevisionStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: WHITE_LABEL_DEFAULT,
  slackIntegrationEnabled: false,
  helloSignAppId: "",
  teamId: "",
};

type CompanyActions = SelectCompanyAction | LogoutUserAction;

export const selectedCompany = (
  state: SelectCompanyState = COMPANY_DEFAULT_STATE,
  action: CompanyActions,
): SelectCompanyState => {
  switch (action.type) {
    case SELECT_COMPANY:
      return { ...action.payload };
    case LOGOUT_USER:
      return { ...COMPANY_DEFAULT_STATE };
    default:
      return state;
  }
};

export default combineReducers({
  selectedCompany,
});
