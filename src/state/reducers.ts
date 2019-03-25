import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import attachments from "./ducks/attachments";
import auth from "./ducks/auth";
import documents from "./ducks/documents";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["tokens", "user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  attachments,
  documents,
});

export type ApplicationState = ReturnType<typeof rootReducer>;
export default rootReducer;
