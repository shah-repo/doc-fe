import { combineReducers } from "redux";
import { LOGOUT_USER } from "../auth/constants";
import { LogoutUserAction } from "../auth/types";
import { DEFAULT_NAVIGATION_ITEMS, SELECT_COMPANY, SET_COMPANY_MINE, WHITE_LABEL_DEFAULT } from "./constants";
import { CompanyMineAction, SelectCompanyAction, SelectCompanyState } from "./types";

export const COMPANY_DEFAULT_STATE: SelectCompanyState = {
  id: "",
  name: "",
  numOfRevStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: WHITE_LABEL_DEFAULT,
  slackIntegrationEnabled: false,
  helloSignAppId: "",
  teamId: "",
  addresses: [],
  acctCodes: [],
  helloSignIntegrationEnabled: false,
  navigation: DEFAULT_NAVIGATION_ITEMS,
};

type CompanyActions = SelectCompanyAction | LogoutUserAction;

export const selectedCompany = (
  state: SelectCompanyState = COMPANY_DEFAULT_STATE,
  action: CompanyActions,
): SelectCompanyState => {
  switch (action.type) {
    case SELECT_COMPANY:
      return {
        ...action.payload,
        navigation:
          action.payload.navigation?.length
            ? action.payload.navigation
            : DEFAULT_NAVIGATION_ITEMS,
      };
    case LOGOUT_USER:
      return { ...COMPANY_DEFAULT_STATE };
    default:
      return state;
  }
};

export const companyMine = (
  state: SelectCompanyState = COMPANY_DEFAULT_STATE,
  action: CompanyMineAction,
): SelectCompanyState => {
  switch (action.type) {
    case SET_COMPANY_MINE:
      return {
        ...action.payload,
        navigation:
          action.payload.navigation?.length
            ? action.payload.navigation
            : DEFAULT_NAVIGATION_ITEMS,
      };
    default:
      return state;
  }
};

export default combineReducers({
  selectedCompany,
  companyMine,
});
