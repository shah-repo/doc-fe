import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./ducks/auth";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["tokens", "user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export type ApplicationState = ReturnType<typeof rootReducer>;
export default rootReducer;
