import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";
import apiMiddleware from "./middlewares/api";
import reducers from "./reducers";

const middlewares = [apiMiddleware, thunk];

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(...middlewares)),
);

const persistor = persistStore(store);

export { store, persistor };
