import { combineReducers } from "redux";
import { createMigrate, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import attachments from "./ducks/attachments";
import auth, { CLEAR_NON_AUTH_DATA, LOGOUT_USER } from "./ducks/auth";
import changeRequests from "./ducks/changeRequest";
import company from "./ducks/company";
import dashboard from "./ducks/dashboard";
import documentRevisions from "./ducks/documentRevisions";
import documentType from "./ducks/documentRevisions/documentType";
import documents from "./ducks/documents";
import pageDetails from "./ducks/pageDetails";
import supplierSurvey from "./ducks/supplierSurvey";
import tableSearch from "./ducks/tableSearch";
import userManagement from "./ducks/userManagement";
import migrations from "./migrations";

const authPersistConfig = {
  key: "auth",
  storage,
  version: 2,
  whitelist: ["user", "groups"],
  migrate: createMigrate(migrations),
};

const companyPersistConfig = {
  key: "company",
  storage,
  whitelist: ["selectedCompany"],
};

const documentTypePersistConfig = {
  key: "documentType",
  storage,
  whitelist: ["byId"],
};

const tableSearchPersistConfig = {
  key: "tableSearch",
  storage,
  whitelist: ["criteria"],
};

const appReducer = combineReducers({
  attachments,
  auth: persistReducer(authPersistConfig, auth),
  documents,
  changeRequests,
  documentRevisions,
  dashboard,
  documentType: persistReducer(documentTypePersistConfig, documentType),
  company: persistReducer(companyPersistConfig, company),
  tableSearch: persistReducer(tableSearchPersistConfig, tableSearch),
  supplierSurvey,
  userManagement,
  pageDetails,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT_USER || action.type === CLEAR_NON_AUTH_DATA) {
    const { auth: authState } = state;
    const { company: companyState } = state;
    const { tableSearch: tableSearchState } = state;
    state = {
      auth: authState,
      company: companyState,
      tableSearch: tableSearchState,
    };
  }

  return appReducer(state, action);
};

export type ApplicationState = ReturnType<typeof rootReducer>;
export default rootReducer;
