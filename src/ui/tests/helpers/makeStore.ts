import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import apiMiddleware from "../../../state/middlewares/api";
import rootReducer from "../../../state/reducers";

export const makeStore = (state = {}) => {
  const middlewares = [apiMiddleware, thunk];
  const store = createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(...middlewares)),
  );

  return store;
};

export default makeStore;
