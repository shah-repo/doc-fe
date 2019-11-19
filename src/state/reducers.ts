import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./ducks/auth";
import { LOGOUT_USER } from "./ducks/auth/constants";
import changeRequests from "./ducks/changeRequest";
import company from "./ducks/company";
import dashboard from "./ducks/dashboard";
import documentRevisions from "./ducks/documentRevisions";
import documentType from "./ducks/documentRevisions/documentType";
import documents from "./ducks/documents";
import formBuilderState from "./ducks/formBuilder";
import tableSearch from "./ducks/tableSearch";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["tokens", "user"],
};
const companyPersistConfig = {
  key: "company",
  storage,
  whitelist: ["selectedCompany"],
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  documents,
  changeRequests,
  documentRevisions,
  dashboard,
  formBuilderState,
  documentType,
  company: persistReducer(companyPersistConfig, company),
  tableSearch,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT_USER) {
    const { auth: authState } = state;
    const { company: companyState } = state;
    state = {
      auth: authState,
      company: companyState,
    };
  }

  return appReducer(state, action);
};

export type ApplicationState = ReturnType<typeof rootReducer>;
export default rootReducer;
