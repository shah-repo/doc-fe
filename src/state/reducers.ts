import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./ducks/auth";
import documents from "./ducks/documents";
import changeRequests from "./ducks/changeRequest";
import documentRevisions from "./ducks/documentRevisions";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["tokens", "user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  documents,
  changeRequests,
  documentRevisions,
});

export type ApplicationState = ReturnType<typeof rootReducer>;
export default rootReducer;
