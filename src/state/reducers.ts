import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./ducks/auth";
import { LOGOUT_USER } from "./ducks/auth/constants";
import changeRequests from "./ducks/changeRequest";
import documentRevisions from "./ducks/documentRevisions";
import documents from "./ducks/documents";
import dashboard from "./ducks/dashboard";
import formBuilderState from "./ducks/formBuilder";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["tokens", "user"],
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  documents,
  changeRequests,
  documentRevisions,
  dashboard,
  formBuilderState,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT_USER) {
    const { auth } = state;
    state = { auth };
  }

  return appReducer(state, action);
};

export type ApplicationState = ReturnType<typeof rootReducer>;
export default rootReducer;
