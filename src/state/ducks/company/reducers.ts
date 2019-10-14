import _ from "lodash";
import { combineReducers } from "redux";
import { SELECT_COMPANY } from "./constants";
import { SelectCompanyAction, SelectCompanyState } from "./types";

export const COMPANY_DEFAULT_STATE: SelectCompanyState = {
  id: "",
  name: "",
  maxRevisionStages: 1,
  users: [],
  documentTypes: [],
  whiteLabeling: {
    logo: "",
    colors: {
      defaultBackground: "",
      primaryContrastText: "",
      primary: "",
      secondary: "",
      secondaryContrastText: "",
      textHighlight: "",
    },
  },
};

export const selectedCompany = (
  state: SelectCompanyState = COMPANY_DEFAULT_STATE,
  action: SelectCompanyAction,
): SelectCompanyState => {
  switch (action.type) {
    case SELECT_COMPANY:
      return { ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  selectedCompany,
});
