import { Action, Middleware } from "redux";

const middlewareMockStore = (middlewareFn: Middleware, defaultState: any = {}) => {

  const store = {
    getState: jest.fn(() => defaultState),
    dispatch: jest.fn(),
  };

  const next = jest.fn();

  const invoke = (action: Action) => middlewareFn(store)(next)(action);

  return {
    store, next, invoke, defaultState,
  };
};

export default middlewareMockStore;
